'use client'
import { useState, useEffect } from 'react'
import ScriptUploader from '@/components/ScriptUploader'
import SetCallTargetsModal from '@/components/SetCallTargetsModal'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen bg-[#f2f3f8] flex items-center justify-center p-5">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 justify-center items-stretch p-3">
        <div className="w-full lg:w-1/2 flex justify-center">
          <ScriptUploader />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <SetCallTargetsModal />
        </div>
      </div>
    </main>
  )
}
