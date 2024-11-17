"use client"

import React, { useActionState} from 'react';
import { login, signInWithGoogle } from '@/actions/onboard';
import Link from 'next/link';

const initialState = {
    message: undefined,
    errors: {}
  }

const LoginComp =  () => {
    const [state, action, pending] = useActionState(login, initialState)

    return (
      <div className="flex items-center justify-center min-h-screen w-[95%] md:w-[90%] mx-auto ">
        <div className="px-2 md:px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-[95%] md:w-[50%] mx-auto">
          <h3 className="text-2xl font-semibold text-center">Login to your account</h3>
          <form  action={action}>
            <div className="mt-4">
              <div>
                <label className="block" htmlFor="email">Email</label>
                <input
                  type="email"
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
              {state?.message && <p className='text-sm text-red-600'> {state?.message}</p>}
              <div className="flex items-baseline justify-between">
              <button  disabled={pending} className="px-6 py-2 mt-4 text-white bg-black rounded-lg hover:bg-gray-700">{pending ? 'Logging' : 'Login'}</button>
              <Link href="/register" className="text-sm text-gray-400 hover:underline">Don't have an account? Register</Link>
              </div>
            </div>
          </form>
          {/* <div>
              <form action= {signInWithGoogle} >
                <button> Sign In With Google</button>
              </form>
          </div> */}
        </div>
      </div>
    );
}

export default LoginComp