'use client'
import { useState, useEffect } from 'react'
import ScriptUploader from '@/components/ScriptUploader'
import SetCallTargetsModal from '@/components/SetCallTargetsModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getMemberData } from "@/utils/memberstack"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [scriptsReady, setScriptsReady] = useState(false)
  const [targetsReady, setTargetsReady] = useState(false)
  const [teamId, setTeamId] = useState<string | null>(null)

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { teamId } = await getMemberData()
        setTeamId(teamId)
      } catch (err) {
        console.error('Initialization error:', err)
      }
    }

    initializeData()
  }, [])

  // Only hide loading when both components are ready
  useEffect(() => {
    if (scriptsReady && targetsReady) {
      setIsLoading(false)
    }
  }, [scriptsReady, targetsReady])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <main className="min-h-screen bg-[#f2f3f8] flex items-center justify-center p-5">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row gap-4 justify-center items-stretch p-3">
        <div className="w-full lg:w-1/2 flex justify-center">
          <ScriptUploader onReady={() => setScriptsReady(true)} />
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <SetCallTargetsModal onReady={() => setTargetsReady(true)} />
        </div>
      </div>
    </main>
  )
}
