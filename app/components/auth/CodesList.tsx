"use client"
import { FormState, getRecentCodes } from '@/actions/user';
import React, { startTransition, useActionState, useEffect } from 'react'
import Loader from './Loader';

const initialState: FormState = {
    message: undefined,
    error: undefined,
    data: undefined// Changed from null to undefined
};

const CodesList = ({ refresh }: any) => {

    const [state, action, pending] = useActionState(getRecentCodes, initialState)

    useEffect(() => {
        startTransition(() => {
            action();
        });
    }, [action, refresh]);


    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Recent Codes
                    </h3>
                    {pending ? <Loader /> : 
                    <div className="mt-4">
                        {state?.message && <p className="text-sm text-gray-500">{state?.message}</p>}
                        {state?.error && <p className="text-sm text-gray-500">{state?.error}</p>}

                        {state?.data && <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Visitor Name</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Code</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {state.data.map((entry: any, index: any) => (
                                        <tr key={index}>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                {entry.visitorName}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm font-mono font-medium text-gray-900">
                                                {entry.code}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${entry.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : entry.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {entry.status}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                {new Date(entry.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}


                    </div>}
                </div>
            </div>

        </div>

    )
}

export default CodesList