"use client"

import { confirmCode, ConfirmCodeState } from '@/actions/user'
import React, { startTransition, useActionState } from 'react'

const initialState: ConfirmCodeState = {
    message: undefined,
    error: undefined,
}

const ConfirmCodeComp = () => {

const [state, action, pending] = useActionState(confirmCode, initialState);

const handleSubmit= async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    startTransition( async () => {
        await action(formData);
      });
};

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Confirm Code</h1>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* i changed from action to onsubmit here because i want the child codelist component to refresh anytime a new code is generated */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Enter Code
                            </label>
                            <div className='mt-1 flex gap-x-4'>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    disabled={pending}
                                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3"
                                    placeholder="Enter code"
                                />

                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm  text-white bg-black  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pending ? 'Confirming...' : 'Confirm'}
                                </button>

                            </div>

                        </div>
                        {state?.error && (
                            <p className="mt-1 text-base text-red-600">
                                {state.error}
                            </p>
                        )}
                        {state?.message && (
                            <p className="mt-1 text-base text-green-600">
                                {state.message}
                            </p>
                        )}
                    </form>
                </div>

            </div>
        </div>
    )
}

export default ConfirmCodeComp