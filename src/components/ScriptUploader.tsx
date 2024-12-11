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
import { scriptService } from '@/services/scriptService'
import { getMemberData } from '@/utils/memberstack'

export default function ScriptUploader() {
  // Core state
  const [step, setStep] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [uploadedContent, setUploadedContent] = useState<string | null>(null)
  const [categoryData, setCategoryData] = useState<CategoryData[]>([])
  const [history, setHistory] = useState<number[]>([1])
  const [editingScript, setEditingScript] = useState<SavedScript | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSaveNotification, setShowSaveNotification] = useState(false)

  // Member state
  const [memberId, setMemberId] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)

  // Initialize member data
  useEffect(() => {
    const initializeMemberData = async () => {
      try {
        const { memberstackId, teamId } = await getMemberData()
        setMemberId(memberstackId)
        setTeamId(teamId)
      } catch (err) {
        setError('Error loading member data. Please refresh the page.')
        console.error('Member data error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializeMemberData()
  }, [])

  // Save notification effect
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

  // Load scripts when category is selected
  useEffect(() => {
    const loadScripts = async () => {
      if (!selectedCategory || !teamId || !memberId) return
      
      setIsLoading(true)
      try {
        const scripts = await scriptService.getScripts(teamId, memberId, selectedCategory)
        setCategoryData(prev => {
          const existingCategoryIndex = prev.findIndex(data => data.category === selectedCategory)
          if (existingCategoryIndex !== -1) {
            const newData = [...prev]
            newData[existingCategoryIndex] = {
              category: selectedCategory,
              scripts
            }
            return newData
          }
          return [...prev, { category: selectedCategory, scripts }]
        })
      } catch (err) {
        setError('Error loading scripts. Please try again.')
        console.error('Script loading error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadScripts()
  }, [selectedCategory, teamId, memberId])

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

  const handleScriptSave = async (content: string) => {
    if (!teamId || !memberId || !selectedCategory) {
      setError('Unable to save script. Please try again.')
      return
    }

    setIsLoading(true)
    try {
      const scriptName = selectedTemplate?.title || editingScript?.name || 'New Script'
      const savedScript = await scriptService.createScript(
        teamId,
        memberId,
        scriptName,
        content,
        selectedCategory
      )

      setCategoryData(prev => {
        const categoryIndex = prev.findIndex(data => data.category === selectedCategory)
        if (categoryIndex !== -1) {
          const newData = [...prev]
          if (editingScript) {
            newData[categoryIndex].scripts = newData[categoryIndex].scripts.map(script => 
              script.id === editingScript.id ? savedScript : script
            )
          } else {
            newData[categoryIndex].scripts = [...newData[categoryIndex].scripts, savedScript]
          }
          return newData
        }
        return [...prev, {
          category: selectedCategory,
          scripts: [savedScript]
        }]
      })

      setIsSaved(true)
      setTimeout(() => {
        setStep(1)
        setSelectedCategory(null)
        setSelectedTemplate(null)
        setUploadedContent(null)
        setEditingScript(null)
        setHistory([1])
      }, 1500)
    } catch (err) {
      setError('Error saving script. Please try again.')
      console.error('Script saving error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    if (history.length > 1) {
      const newHistory = [...history]
      newHistory.pop()
      const previousStep = newHistory[newHistory.length - 1]
      setStep(previousStep)
      setHistory(newHistory)
      if (previousStep === 1) {
        setSelectedCategory(null)
        setSelectedTemplate(null)
        setUploadedContent(null)
        setEditingScript(null)
      } else if (previousStep === 2) {
        setSelectedTemplate(null)
        setUploadedContent(null)
        setEditingScript(null)
      }
    }
  }

  const handleEditScript = (script: SavedScript) => {
    setEditingScript(script)
    setStep(3)
    setHistory([...history, 3])
  }

  const handleRemoveScript = async (scriptId: string) => {
    if (!teamId) return

    try {
      await scriptService.deleteScript(scriptId, teamId)
      setCategoryData(prev => {
        return prev.map(categoryData => {
          if (categoryData.category === selectedCategory) {
            return {
              ...categoryData,
              scripts: categoryData.scripts.filter(script => script.id !== scriptId)
            }
          }
          return categoryData
        })
      })
    } catch (err) {
      setError('Error deleting script. Please try again.')
      console.error('Script deletion error:', err)
    }
  }

  const handleRenameScript = async (scriptId: string, newName: string) => {
    if (!teamId) return

    try {
      const updatedScript = await scriptService.updateScript(scriptId, teamId, { name: newName })
      setCategoryData(prev => {
        return prev.map(categoryData => {
          if (categoryData.category === selectedCategory) {
            return {
              ...categoryData,
              scripts: categoryData.scripts.map(script => 
                script.id === scriptId ? { ...script, name: newName } : script
              )
            }
          }
          return categoryData
        })
      })
    } catch (err) {
      setError('Error updating script name. Please try again.')
      console.error('Script rename error:', err)
    }
  }

const handleSelectScript = async (scriptId: string) => {
    if (!teamId) return;

    try {
      await scriptService.updateScript(scriptId, teamId, { isSelected: true });
      setCategoryData(prev => {
        return prev.map(categoryData => {
          if (categoryData.category === selectedCategory) {
            return {
              ...categoryData,
              scripts: categoryData.scripts.map(script => ({
                ...script,
                isSelected: script.id === scriptId
              }))
            };
          }
          return categoryData;
        });
      });
    } catch (err) {
      setError('Error selecting script. Please try again.');
      console.error('Script selection error:', err);
    }
  };

  if (isLoading && !selectedCategory) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>
  }

  return (
    <div className="w-full max-w-[600px] bg-white rounded-[20px] overflow-hidden flex flex-col px-3 sm:px-5 h-full">
      <div className="py-2 sm:py-3 flex flex-col flex-grow overflow-y-auto min-h-[calc(100vh-200px)]">
        <Header 
          step={step}
          selectedCategory={selectedCategory}
          isUploadMode={!!uploadedContent}
          selectedTemplate={!!selectedTemplate}
        />

        <div className="mt-1 sm:mt-2 flex flex-col space-y-2">
          {error && (
  <div className="bg-red-50 border border-red-200 rounded-[20px] p-3 flex items-center text-red-600">
    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-xs sm:text-sm font-montserrat">{error}</span>
      <span className="text-xs text-red-400 mt-1">
        URL Parameters: {window.location.search}
      </span>
    </div>
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
              onRename={handleRenameScript}
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
            <span className="font-montserrat font-semibold text-sm sm:text-base">
              Script Saved Successfully!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
