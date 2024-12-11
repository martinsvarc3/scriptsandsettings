'use client'

import ScriptUploader from '@/components/ScriptUploader'
import SetCallTargetsModal from '@/components/SetCallTargetsModal'

export default function Home() {
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
