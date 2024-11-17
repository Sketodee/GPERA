import React from 'react'

const NotActiveComp = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-red-900">Your Profile Is Inactive</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Wait while the administrator activate your account
                    </p>
                </div>
            </div>
        </div>
    )
}

export default NotActiveComp