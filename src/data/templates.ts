import { Category, Template } from '@/types'

const templates: Record<Category, Template[]> = {
  'Wholesaling': [
    {
      title: "Basic Wholesaling Script",
      preview: "A straightforward script for initial contact with potential sellers.",
      fullScript: "Hello, I'm calling about your property at [ADDRESS]..."
    },
    // Add more wholesaling templates
  ],
  'Creative Finance': [
    {
      title: "Owner Financing Script",
      preview: "Script for discussing owner financing options with sellers.",
      fullScript: "Hi, I'm reaching out regarding your property..."
    },
    // Add more creative finance templates
  ],
  'Agent Outreach': [
    {
      title: "Agent Partnership Script",
      preview: "Build relationships with real estate agents.",
      fullScript: "Hello [AGENT NAME], I'm calling to discuss potential partnerships..."
    },
    // Add more agent outreach templates
  ],
  'Foreclosure': [
    {
      title: "Foreclosure Assistance Script",
      preview: "Help homeowners facing foreclosure.",
      fullScript: "Hi, I understand you might be in a difficult situation..."
    },
    // Add more foreclosure templates
  ]
}

export default templates
