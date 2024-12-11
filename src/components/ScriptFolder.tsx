'use client'

import { useState } from 'react'
import { SavedScript, Category } from '@/types'
import { Edit, Trash2, PenLine, Save, ArrowLeft } from 'lucide-react'

interface ScriptFolderProps {
  category: Category
  scripts: SavedScript[]
  onEdit: (script: SavedScript) => void
  onRemove: (scriptId: string) => void
  onSelect: (scriptId: string) => void
  onUploadNew: () => void
  onRename: (scriptId: string, newName: string) => void
  onBack: () => void
}

export default function ScriptFolder({
  category,
  scripts,
  onEdit,
  onRemove,
  onSelect,
  onUploadNew,
  onRename,
  onBack
}: ScriptFolderProps) {
  const [editingNameId, setEditingNameId] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-[200px] hover:bg-gray-50 transition-colors border-2 border-[#f2f3f8] bg-white"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-semibold font-montserrat">{category} Scripts</h2>
      </div>
      <div className="scrollable-content space-y-3 max-h-[400px] overflow-y-auto">
        {scripts.map((script) => (
          <div key={script.id} className="bg-[#f2f3f8] p-4 rounded-[20px] border border-[#d1d1d1]">
            <div className="flex flex-col space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={script.name}
                      onChange={(e) => {
                        const newName = e.target.value;
                        onRename(script.id, newName);
                      }}
                      onBlur={() => setEditingNameId(null)}
                      className={`font-montserrat font-semibold text-sm truncate w-full bg-transparent ${
                        editingNameId === script.id
                          ? 'border-b border-gray-300 focus:outline-none focus:border-[#5b06be]'
                          : 'border-b border-transparent'
                      }`}
                      readOnly={editingNameId !== script.id}
                    />
                    <button
                      onClick={() => {
                        if (editingNameId === script.id) {
                          setEditingNameId(null);
                        } else {
                          setEditingNameId(script.id);
                        }
                      }}
                      className="p-1 rounded-full bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
                    >
                      {editingNameId === script.id ? (
                        <Save className="w-4 h-4 text-[#5b06be]" />
                      ) : (
                        <PenLine className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 mb-2">Last edited: {new Date(script.lastEdited).toLocaleString()}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(script)}
                      className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onRemove(script.id)}
                      className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={onUploadNew}
        className="w-full bg-white text-black h-[45px] px-3 rounded-[20px] font-montserrat font-semibold transition-all duration-300 flex items-center justify-center text-xs sm:text-sm hover:border-2 hover:border-[#5b06be] border-2 border-[#f2f3f8]"
      >
        Upload New Script or Choose Template
      </button>
    </div>
  )
}
