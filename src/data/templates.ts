import { Category, Template } from '@/types'

const templates: Record<Category, Template[]> = {
  'Wholesaling': [
   {
     title: "High-Converting Wholesaling Property Acquisition Script",
     preview: "To identify motivated sellers and secure wholesale real estate deals through cold calling. Duration: 8-12 minutes",
     fullScript: "OPENING (0-60 seconds)
"Hi, this is [YOUR NAME] with [COMPANY NAME]. I'm a local real estate investor actively looking to buy properties in [AREA/NEIGHBORHOOD]. I noticed your property at [ADDRESS] and wanted to reach out directly to see if you might consider selling for the right offer?"

[If they seem hesitant]
"I understand this call is unexpected. We're local investors who buy properties as-is for cash, and I'd love to learn more about your property if you have just a few minutes."

INITIAL QUALIFICATION (1-2 minutes)
"Would you have about 5-7 minutes to answer a few questions about the property? This will help me understand if it might be a good fit for our investment portfolio."

[If YES]
"Excellent! Let me get some basic information first."

[If NO]
"I completely understand. When would be a better time to have this conversation?"

CONTACT INFORMATION (2-3 minutes)
"Before we discuss the property, let me verify a few details:
- Could you confirm your full name?
- And I have your property address as [ADDRESS] - is that correct?
- What's the best phone number to reach you?
- Where would you like me to send additional information by email?"

PROPERTY CONDITION (3-5 minutes)
"Now, I'd like to learn more about your property:
- How long have you owned the house?
- Is anyone currently living in the property?
- What's the general condition of the house?
- Are there any repairs or updates needed?
- How many bedrooms and bathrooms does it have?
- What's the approximate square footage?
- Have you done any major renovations recently?
- How would you describe the condition of the roof and foundation?
- Are there any special features I should know about?"

MOTIVATION DISCOVERY (5-7 minutes)
"Thank you for sharing those details. May I ask what's making you consider selling at this time?"

[Listen carefully and show empathy]

"How long have you been thinking about selling?"

[If they mention any challenges or problems]
"That sounds challenging. How has that been affecting you?"

TIMELINE AND FINANCIAL POSITION (7-8 minutes)
"If you decided to move forward with selling:
- What kind of timeline are you looking at - 30 days, 90 days, or longer?
- Are there any mortgages or liens on the property?
- Do you have a rough idea of the payoff amount?"

PRICE DISCUSSION (8-9 minutes)
"Regarding property value:
- Have you had any other offers on the property?
- Do you have a specific price in mind?
- Would you be flexible on price for a quick, as-is cash sale with no realtor fees?"

CLOSING & NEXT STEPS (9-10 minutes)
[If Showing Strong Interest]
"This sounds like it could be a great fit for our buying criteria. Here's what happens next:
1. I'd like to schedule a quick 15-minute walkthrough of the property
2. My team will analyze the information and prepare a cash offer
3. We can present you with a no-obligation offer within 24 hours after viewing
4. If you accept, we can close in as little as 7-14 days

When would be the best time for me to come take a look at the property?"

[If Needs Time]
"I understand you need time to think about it. Would it be okay if I:
1. Send you some information about our company by email?
2. Follow up with you next week to answer any questions?
3. Add you to our priority buyer list in case our offer increases?",
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
