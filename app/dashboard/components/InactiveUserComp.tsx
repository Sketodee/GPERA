"use client"
import React, { startTransition, useActionState, useEffect, useState } from 'react'
import { getInactiveUsers, UserResponseState, approveUser } from '@/actions/user'
import Loader from '@/app/components/auth/Loader'

const initialState: UserResponseState = {
  message: undefined,
  error: undefined,
}

const userUpdateState: UserResponseState = {
  message: undefined,
  error: undefined,
}

const InactiveUserComp = ({ userPage }: any) => {
  const [userState, userAction, userPending] = useActionState(getInactiveUsers, initialState);
  const [approveState, approveAction, updatePending] = useActionState(approveUser, userUpdateState);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);

  // Effect for handling approval message and re-fetching data
  useEffect(() => {
    if (approveState?.message) {
      setShowMessage(true);

      const messageTimer = setTimeout(() => {
        setShowMessage(false);
        // Re-fetch the users data after message disappears
        startTransition(() => {
          userAction(userPage);
        });
      }, 1000);

      return () => clearTimeout(messageTimer);
    }
  }, [approveState?.message, userAction, userPage]);

  useEffect(() => {
    if (approveState?.error) {
      setShowError(true);

      const errorTimer = setTimeout(() => {
        setShowError(false);
      }, 1000);

      return () => clearTimeout(errorTimer);
    }
  }, [approveState?.error]);

  const approve = (userId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
    const data = {
      userId,
      isActive: true
    };

    startTransition(() => {
      approveAction(data);
    });
  };

  // Initial data fetch
  useEffect(() => {
    startTransition(() => {
      userAction(userPage)
    })
  }, [userAction, userPage])

  return (
    <div>
    {showError && <p className='text-center text-sm text-red-600'>{approveState?.error}</p>}
    {showMessage && <p className='text-center text-sm text-green-600'>{approveState?.message}</p>}
    {userPending ? <Loader /> : 
      <div className="overflow-x-auto">  {/* Make the table horizontally scrollable on small screens */}
        <table className="min-w-full divide-y divide-gray-300">
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
                Join Date
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
  
          {userState?.data &&
            <tbody className="divide-y divide-gray-200 bg-white">
              {userState.data.map((user: any, index: any) => (
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
                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={approve(user._id)}
                      >
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div> 
    }
  </div>
  
  )
}

export default InactiveUserComp