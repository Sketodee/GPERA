"use client"
import React, { startTransition, useActionState, useState } from 'react';
import { FormState, createCode } from '@/actions/user';
import CodesList from './CodesList';

const initialState: FormState = {
    message: undefined,
    error: undefined,
    data: undefined// Changed from null to undefined
};


const HomeComp = () => {

    const [state, action, pending] = useActionState(createCode, initialState);

    const [refresh, setRefresh] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        startTransition( async () => {
            await action(formData);
          });

        // Trigger the refresh for the child component
        setRefresh(prev => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Code Generator</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter a name and generate a unique code
                    </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                         {/* i changed from action to onsubmit here because i want the child codelist component to refresh anytime a new code is generated */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Enter Name
                            </label>
                            <div className='mt-1 flex gap-x-4'>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    disabled={pending}
                                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 px-3 focus:ring-blue-500 sm:text-sm"
                                    placeholder="Enter your name"
                                />

                                <button
                                    type="submit"
                                    disabled={pending}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm  text-white bg-black  hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {pending ? 'Submitting...' : 'Submit'}
                                </button>

                            </div>

                        </div>
                        {state?.error && (
                            <p className="mt-1 text-sm text-red-600">
                                {state.error}
                            </p>
                        )}
                    </form>
                </div>

                {/* Input Section */}
                {state?.data && <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                    <div className="mt-6 text-center">
                        <div className="text-sm text-gray-500">Generated Code:</div>
                        <div className="mt-2 text-5xl font-mono font-bold text-green-600 tracking-wider">
                            {state?.data?.code}
                        </div>
                    </div>
                </div>}

                <CodesList refresh = {refresh}/>

            </div>
        </div>
    );
}

export default HomeComp