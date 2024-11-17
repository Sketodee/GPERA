import { getSession } from '@/lib/getSession'
import { redirect } from 'next/navigation'
import React from 'react'

const Profile = async () => {
  const session = await getSession()
  const user = session?.user 
  if(!user) redirect('/login')
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
    <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Coming soon</h1>
            <p className="mt-2 text-sm text-gray-600">
                Just hang on,, 
            </p>
        </div>
    </div>
</div>
  )
}

export default Profile