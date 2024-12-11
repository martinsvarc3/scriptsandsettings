'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import CategorySelector from '@/components/CategorySelector'
import ScriptActions from '@/components/ScriptActions'
import TemplateSelector from '@/components/TemplateSelector'
import ScriptEditor from '@/components/ScriptEditor'
import BackButton from '@/components/BackButton'
import DocumentUploader from '@/components/DocumentUploader'
import ScriptFolder from '@/components/ScriptFolder'
import { Category, Template, SavedScript, CategoryData } from '@/types'
import { Check, AlertCircle } from 'lucide-react'

export default function ScriptUploader() {
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [uploadedContent, setUploadedContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [history, setHistory] = useState<number[]>([1])
  const [editingScript, setEditingScript] = useState<SavedScript | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isSaved) {
      setShowSaveNotification(true)
      timer = setTimeout(() => {
        setShowSaveNotification(false)
        setIsSaved(false)
      }, 1500)
    }
    return () => clearTimeout(timer)
  }, [isSaved])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category)
    const categoryScripts = categoryData.find(data => data.category === category)?.scripts || []
    if (categoryScripts.length > 0) {
      setStep(5)
    } else {
      setStep(2)
    }
    setHistory([...history, step])
  }

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template)
    setStep(3)
    setHistory([...history, 3])
  }

  const handleNavigateToTemplates = async () => {
    try {
      setError(null)
      setIsLoading(true)
      
      if (!selectedCategory) {
        setSelectedCategory('Wholesaling')
      }
      
      setStep(3)
      setHistory([...history, 3])
      
    } catch (err) {
      setError('Templates section not available at the moment. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadScript = async (content: string, fileName: string) => {
    setUploadedContent(content)
    setEditingScript({
      id: Date.now().toString(),
      name: fileName,
      content: content,
      lastEdited: new Date().toISOString(),
      isSelected: false
    })
    setStep(3)
    setHistory([...history, 3])
  }

  const handleScriptSave = async (script: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    setIsSaved(true)
    
    if (selectedCategory) {
      const newScript: SavedScript = {
        id: Date.now().toString(),
        name: `Script ${Date.now()}`,
        content: script,
        lastEdited: new Date().toISOString(),
        isSelected: true
      }
      
      setCategoryData(prevData => {
        const categoryIndex = prevData.findIndex(data => data.category === selectedCategory)
        if (categoryIndex !== -1) {
          const updatedScripts = prevData[categoryIndex].scripts.map(s => ({ ...s, isSelected: false }))
          updatedScripts.push(newScript)
          const updatedData = [...prevData]
          updatedData[categoryIndex] = { ...updatedData[categoryIndex], scripts: updatedScripts }
          return updatedData
        } else {
          return [...prevData, { category: selectedCategory, scripts: [newScript] }]
        }
      })
    }
    
    setTimeout(() => {
      setStep(1)
      setSelectedCategory(null)
      setSelectedTemplate(null)
      setUploadedContent(null)
      setHistory([1])
    }, 1500)
  }

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousStep = newHistory[newHistory.length - 1];
      setStep(previousStep);
      setHistory(newHistory);
      if (previousStep === 1) {
        setSelectedCategory(null);
        setSelectedTemplate(null);
        setUploadedContent(null);
        setEditingScript(null);
      } else if (previousStep === 2) {
        setSelectedTemplate(null);
        setUploadedContent(null);
        setEditingScript(null);
      }
    }
  };

  const handleEditScript = (script: SavedScript) => {
    setEditingScript(script)
    setStep(3)
    setHistory([...history, 3])
  }

  const handleRemoveScript = (scriptId: string) => {
    if (selectedCategory) {
      setCategoryData(prevData => {
        const categoryIndex = prevData.findIndex(data => data.category === selectedCategory)
        if (categoryIndex !== -1) {
          const updatedScripts = prevData[categoryIndex].scripts.filter(s => s.id !== scriptId)
          const updatedData = [...prevData]
          updatedData[categoryIndex] = { ...updatedData[categoryIndex], scripts: updatedScripts }
          return updatedData
        }
        return prevData
      })
    }
  }

  const handleSelectScript = (scriptId: string) => {
    if (selectedCategory) {
      setCategoryData(prevData => {
        const categoryIndex = prevData.findIndex(data => data.category === selectedCategory)
        if (categoryIndex !== -1) {
          const updatedScripts = prevData[categoryIndex].scripts.map(s => ({
            ...s,
            isSelected: s.id === scriptId
          }))
          const updatedData = [...prevData]
          updatedData[categoryIndex] = { ...updatedData[categoryIndex], scripts: updatedScripts }
          return updatedData
        }
        return prevData
      })
    }
  }

  const handleRenameScript = (scriptId: string, newName: string) => {
    setCategoryData(prevData => {
      return prevData.map(category => {
        if (category.category === selectedCategory) {
          return {
            ...category,
            scripts: category.scripts.map(script => 
              script.id === scriptId ? { ...script, name: newName, lastEdited: new Date().toISOString() } : script
            )
          };
        }
        return category;
      });
    });
  };

  return (
    <div className="w-full max-w-[600px] bg-white rounded-[20px] overflow-hidden flex flex-col px-3 sm:px-5 h-full">
      <div className="py-2 sm:py-3 flex flex-col flex-grow overflow-y-auto min-h-[calc(100vh-200px)]">
        <Header step={step} selectedCategory={selectedCategory} isUploadMode={!!uploadedContent} selectedTemplate={!!selectedTemplate} />
        <div className="mt-1 sm:mt-2 flex flex-col space-y-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-[20px] p-3 flex items-center text-red-600">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-montserrat">{error}</span>
            </div>
          )}
          {step === 1 && (
            <div className="mt-1 w-full flex-grow flex items-center justify-center px-4 py-8">
              <CategorySelector
                onSelect={handleCategorySelect}
                categoryData={categoryData}
              />
            </div>
          )}
          {step === 2 && (
            <>
              <ScriptActions
                onUpload={() => {
                  setStep(4)
                  setHistory([...history, 4])
                }}
                onTemplateSelect={handleNavigateToTemplates}
              />
              <div className="mt-1">
                <BackButton onClick={handleGoBack} />
              </div>
            </>
          )}
          {step === 3 && selectedCategory && !selectedTemplate && !uploadedContent && !editingScript && (
            <>
              <TemplateSelector
                category={selectedCategory}
                onSelect={handleTemplateSelect}
              />
              <div className="mt-1">
                <BackButton onClick={handleGoBack} />
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <DocumentUploader onUpload={handleUploadScript} />
              <div className="mt-1">
                <BackButton onClick={handleGoBack} />
              </div>
            </>
          )}
          {step === 3 && (selectedTemplate || uploadedContent || editingScript) && (
            <ScriptEditor
              template={selectedTemplate}
              uploadedContent={uploadedContent || undefined}
              editingScript={editingScript}
              onSave={handleScriptSave}
              handleGoBack={handleGoBack}
            />
          )}
          {step === 5 && selectedCategory && (
            <ScriptFolder
              category={selectedCategory}
              scripts={categoryData.find(data => data.category === selectedCategory)?.scripts || []}
              onEdit={handleEditScript}
              onRemove={handleRemoveScript}
              onSelect={handleSelectScript}
              onUploadNew={() => setStep(2)}
              onRename={handleRenameScript}
              onBack={handleGoBack}
            />
          )}
        </div>
      </div>
      {showSaveNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white p-4 rounded-[20px] flex items-center shadow-lg">
            <Check className="text-[#5b06be] w-6 h-6 mr-3" />
            <span className="font-montserrat font-semibold text-sm sm:text-base">Script Saved Successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

