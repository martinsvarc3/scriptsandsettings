'use client'

import { Category, CategoryData } from '@/types'
import { Check, Folder } from 'lucide-react'

interface CategorySelectorProps {
  onSelect: (category: Category) => void
  categoryData: CategoryData[]
}

// Could be moved to a constants file
const categories: Category[] = [
  'Wholesaling',
  'Creative Finance', 
  'Agent Outreach',
  'Foreclosure'
]

export default function CategorySelector({ onSelect, categoryData }: CategorySelectorProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      {categories.map((category) => {
        const hasScripts = categoryData.some(
          data => data.category === category && data.scripts.length > 0
        )
        
        return (
          <button
            key={category}
            className="bg-white h-[60px] w-full px-4 rounded-[20px] font-montserrat font-semibold text-center flex items-center justify-center transition-all duration-300 text-sm sm:text-base hover:border-2 hover:border-[#5b06be] border-2 border-[#f2f3f8]"
            onClick={() => onSelect(category)}
            type="button"
          >
            <span className="truncate">{category}</span>
            {hasScripts && (
              <Folder className="ml-2 w-4 h-4 flex-shrink-0 text-[#5b06be]" />
            )}
          </button>
        )
      })}
    </div>
  )
}
