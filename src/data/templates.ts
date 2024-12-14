import { Category, Template } from '@/types'

const templates: Record<Category, Template[]> = {
  'Wholesaling': [
    {
      title: "Professional Acquisition Script",
      preview: "Professional acquisition script for wholesale deals with complete process from contact to close.",
      fullScript: "Hi [OWNER_NAME], this is [YOUR_NAME] calling from [COMPANY_NAME]. I am one of the senior buying specialists here. Your file came across my desk from our acquisitions team regarding the property at [ADDRESS].\n\nJust want to confirm some of the property details, I apologize in advance if some of what we discuss is redundant but want to make sure I have all the correct facts so we can give you our best offer.\n\nSETTING THE STAGE\n• [OWNER_NAME], typically people who call us want to know what we do, how we do it, & how much we can offer for their property... those kinds of things. Do you have those same types of questions?\n\n• We are a Real Estate Investment Company. We work with a group of investors and we buy in AS IS condition, all cash and can close in your timeframe. Sometimes in as little as a few days. There are no hidden fees, real-estate commission and we pay all closing costs! Make sense?\n\n[REST OF ACQUISITION SCRIPT CONTINUES...]"
    }
  ],
  'Creative Finance': [
    {
      title: "Owner Financing Script",
      preview: "Script for discussing creative financing solutions with property owners.",
      fullScript: "Hi [OWNER_NAME], this is [YOUR_NAME] with [COMPANY_NAME]. I noticed you own the property at [ADDRESS], and I wanted to discuss some flexible purchase options that might interest you.\n\n[OWNER_NAME], unlike typical buyers, we can offer several creative ways to structure the sale that could be more beneficial for your situation. For example, have you ever considered owner financing? This could provide you with reliable monthly income while potentially saving on taxes compared to a lump sum sale.\n\nWould you be interested in hearing about how you could potentially get a better overall return while selling your property?\n\nKEY DISCUSSION POINTS:\n• Monthly payment options\n• Interest rate possibilities\n• Term length flexibility\n• Down payment considerations\n• Tax benefit explanations\n\nCLOSING:\nBased on what we've discussed [OWNER_NAME], would you like to meet in person to review some specific numbers for your situation?"
    }
  ],
  'Agent Outreach': [
    {
      title: "Agent Partnership Script",
      preview: "Professional script for building relationships with real estate agents.",
      fullScript: "Hi [AGENT_NAME], this is [YOUR_NAME] with [COMPANY_NAME]. I understand you're a successful agent in the [AREA] market, and I wanted to discuss a potential partnership opportunity.\n\n[AGENT_NAME], we work with several investors who buy multiple properties each month, and we're always looking to build relationships with experienced agents like yourself. We can be an excellent resource for:\n\n• Expired listings\n• Properties needing renovation\n• Quick-close situations\n• Difficult-to-finance properties\n\nWhat we offer:\n• 7-14 day closings\n• Cash purchases\n• As-is condition\n• Full agent commission\n• No staging or showings required\n\n[AGENT_NAME], would you be open to meeting for coffee this week to discuss how we might be able to help each other?"
    }
  ],
  'Foreclosure': [
    {
      title: "Pre-Foreclosure Assistance Script",
      preview: "Compassionate script for helping homeowners facing foreclosure.",
      fullScript: "Hello [OWNER_NAME], this is [YOUR_NAME] with [COMPANY_NAME]. I understand you might be dealing with a challenging situation with your property at [ADDRESS].\n\n[OWNER_NAME], I want you to know that we specialize in helping homeowners who are facing foreclosure, and we may be able to help you too. We have several options that could help you avoid foreclosure and protect your credit.\n\nOptions we can discuss:\n• Quick cash sale before foreclosure\n• Potential lease-back arrangements\n• Negotiation assistance with lenders\n• Short sale guidance if needed\n\nKEY QUESTIONS:\n• [OWNER_NAME], where are you in the foreclosure process?\n• Have you been able to work with your lender?\n• What would be your ideal outcome in this situation?\n• What's the approximate amount owed on the property?\n• Would you prefer to stay in the area?\n\nCLOSING:\n[OWNER_NAME], I know this is a lot to consider, but would you be open to meeting in person to discuss your options in more detail? Everything we discuss will be completely confidential."
    }
  ]
}

export default templates
