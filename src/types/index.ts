export type Category = 'Wholesaling' | 'Creative Finance' | 'Agent Outreach' | 'Foreclosure'

export interface Template {
  title: string
  preview: string
  fullScript: string
}

export interface SavedScript {
  id: string
  name: string
  content: string
  lastEdited: string
  isSelected: boolean
}

export interface CategoryData {
  category: Category
  scripts: SavedScript[]
}

