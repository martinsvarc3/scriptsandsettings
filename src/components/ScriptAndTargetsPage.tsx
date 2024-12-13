'use client'
import { useState, useEffect } from 'react'
import ScriptUploader from '@/components/ScriptUploader'
import SetCallTargetsModal from '@/components/SetCallTargetsModal'
import LoadingSpinner from '@/components/LoadingSpinner'
import { getMemberData } from "@/utils/memberstack"

export default function ScriptAndTargetsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [teamId, setTeamId] = useState<string | null>(null)

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { teamId } = await getMemberData()
        setTeamId(teamId)
        setIsLoading(false)
      } catch (err) {
        console.error('Initialization error:', err)
        setIsLoading(false)
      }
    }

    initializeData()
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex gap-4 p-4">
      <ScriptUploader />
      <SetCallTargetsModal />
    </div>
  )
}
