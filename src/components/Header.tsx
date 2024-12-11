'use client'

import Image from 'next/image'

interface HeaderProps {
  step: number
  selectedCategory?: string
  isUploadMode?: boolean
  selectedTemplate?: boolean
}

export default function Header({ 
  step, 
  selectedCategory, 
  isUploadMode, 
  selectedTemplate 
}: HeaderProps) {
  const title = step === 1 
    ? "Get Your Scripts Ready to Get Trained and Close More Deals" 
    : selectedCategory || ""

  let subheadline = ""
  if (step === 1) {
    subheadline = "Upload Your Scripts or Choose from Our Templates to Be Set Up and Ready When You Start the Call."
  } else if (step === 2) {
    subheadline = "Prepare your script to ensure you're ready to deliver your best performance."
  } else if (step === 3) {
    if (isUploadMode) {
      subheadline = "Your Uploaded Script. Make any edits you need, then click 'Save' when you're done."
    } else if (selectedTemplate) {
      subheadline = "Make any edits you need, then click 'Save' when you're done."
    } else {
      subheadline = "Choose One of Our Templates."
    }
  }

  return (
    <div className="w-full bg-white rounded-[20px] px-4 py-2">
      <div className="flex items-start space-x-2">
        <div className="flex-shrink-0 mt-[2px]">
          <Image
            src="https://res.cloudinary.com/drkudvyog/image/upload/v1733749804/Script_icon_qqt4mv.png"
            alt="Script icon"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-[18px] md:text-[16px] sm:text-[14px] font-extrabold font-montserrat leading-tight text-[#5b06be] mb-1">
            {title.endsWith('.') ? title.slice(0, -1) : title}
          </h1>
          <p className="text-[11px] md:text-[10px] sm:text-[9px] font-bold font-montserrat text-gray-600 leading-snug">
            {subheadline}
          </p>
        </div>
      </div>
    </div>
  )
}
