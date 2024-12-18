'use client'

import { useState, useEffect } from 'react'
import ScriptUploader from '@/components/ScriptUploader'
import SetCallTargetsModal from '@/components/SetCallTargetsModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { scriptService } from '@/services/scriptService'
import { categories } from '@/components/CategorySelector'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const preloadData = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const memberId = params.get('memberId');
        
        if (!memberId) {
          console.error('No memberId found in URL');
          return;
        }

        const scriptsPromises = categories.map(category => 
          scriptService.getScripts(memberId, category)
        )
        await Promise.all(scriptsPromises)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsLoading(false)
      } catch (err) {
        console.error('Error preloading:', err)
        setTimeout(() => setIsLoading(false), 2000)
      }
    }

    preloadData()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-0.5">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-3 justify-center items-stretch p-3">
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
