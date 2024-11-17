"use client"
import React, { startTransition, useActionState, useEffect } from 'react'
import { getActiveUsers, UserResponseState } from '@/actions/user'
import Loader from '@/app/components/auth/Loader'

const initialState: UserResponseState = {
  message: undefined,
  error: undefined,
}

const ActiveUserComp = ({ userPage }: any) => {
  const [state, action, pending] = useActionState(getActiveUsers, initialState)

  useEffect(() => {
    startTransition(() => {
      action(userPage)
    })
  }, [action, userPage])

  return (
    <div>
      {pending ? <Loader /> : 
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-300">
          {state?.data &&
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
              Name
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Email
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Role
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              House Number
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Join Date
            </th>
          </tr>
        </thead>}
          {state?.data &&
            <tbody className="divide-y divide-gray-200 bg-white">
              {state.data.map((user: any, index: any) => (
                <tr key={index}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {user.role}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {user.houseNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>} 
    </div>
  )
}

export default ActiveUserComp