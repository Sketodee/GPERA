"use client"
import React, { useState, useActionState } from 'react'
import { register } from '@/actions/onboard'
import Link from 'next/link';

const initialState = {
  message: undefined,
  errors: {}
}

type HouseUnit = {
  [key: string]: string[];
};

const RegisterComp = () => {

  const [state, action, pending] = useActionState(register, initialState)

  const [selectedHouse, setSelectedHouse] = useState('');

  // Define house numbers
  const houses = Array.from({ length: 14 }, (_, i) => (i + 1).toString());

  // Define units based on house numbers
  const houseUnits: HouseUnit = {
    '1-11': ['A', 'B'],
    '12-14': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  };

  // Get available units based on selected house
  const getAvailableUnits = (house: string) => {
    const houseNumber = parseInt(house);
    if (houseNumber >= 1 && houseNumber <= 11) {
      return houseUnits['1-11'];
    } else if (houseNumber >= 12 && houseNumber <= 14) {
      return houseUnits['12-14'];
    }
    return [];
  };

  const handleHouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedHouse(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-[95%] md:w-[90%] mx-auto">
      <div className="px-2 md:px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-[95%] md:w-[50%] mx-auto">
        <h3 className="text-2xl font-semibold text-center">Create an account</h3>
        <form action={action} >
          <div className="mt-4">
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  id="firstName"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  name='firstName'
                />
                {state?.errors?.firstName && <p className='text-sm text-red-600'> {state.errors.firstName}</p>}
              </div>
              <div className="w-1/2">
                <label className="block" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  id="lastName"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                  name='lastName'
                />
                {state?.errors?.lastName && <p className='text-sm text-red-600'> {state.errors.lastName}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Email"
                id="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                name='email'
              />
              {state?.errors?.email && <p className='text-sm text-red-600'> {state.errors.email}</p>}
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                id="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                name='password'
              />
              {state?.errors?.password && <p className='text-sm text-red-600'> {state.errors.password}</p>}
            </div>


            <div className='flex justify-between gap-3 mt-4'>

              {/* House Select */}
              <div className='w-1/2 '>
                <label
                  htmlFor="house"
                  className="block"
                >
                  Select House
                </label>
                <select
                  id="house"
                  name="house" // Important: add name for FormData
                  value={selectedHouse}
                  onChange={handleHouseChange}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                >
                  <option value="">Select a house</option>
                  {houses.map((house) => (
                    <option key={house} value={house}>
                      House {house}
                    </option>
                  ))}
                </select>
                {state?.errors?.house && <p className='text-sm text-red-600'> {state.errors.house}</p>}
              </div>

              {/* Unit Select */}
              <div className='w-1/2'>
                <label
                  htmlFor="unit"
                  className="block "
                >
                  Select Unit
                </label>
                <select
                  id="unit"
                  name="unit" // Important: add name for FormData
                  disabled={!selectedHouse}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:cursor-not-allowed"
                >
                  <option value="">Select a unit</option>
                  {selectedHouse && getAvailableUnits(selectedHouse).map((unit) => (
                    <option key={unit} value={unit}>
                      Unit {unit}
                    </option>
                  ))}
                </select>
                 {state?.errors?.unit && <p className='text-sm text-red-600'> {state.errors.unit}</p>}
              </div>
            </div>

            {state?.message && <p className='text-sm text-red-600'> {state.message}</p>}
            <div className="flex items-baseline justify-between">
              <button disabled={pending} className="px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-700">{pending ? 'Registering...' : 'Register'}</button>
              <Link href="/login" className="text-sm text-gray-400 hover:underline">Already have an account? Proceed to login</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterComp