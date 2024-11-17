"use client"

import Link from 'next/link';
import React, { startTransition, useActionState, useState } from 'react';
import { useSession } from 'next-auth/react';
import { logout } from '@/actions/onboard';
import { getSession } from '@/lib/getSession';

const initialState = {
  message: undefined,
  errors: {}
}
  
const Navbar =  ({user} : any) => {
  const [isOpen, setIsOpen] = useState(false);

  const [state, action, pending] = useActionState(logout, initialState)

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false)
  }

  const logOutAction = () => {
    startTransition(() => {
      action();
    });
  }

  return (
    <nav className="bg-gray-800 text-white relative">  {/* Added relative */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold">Logo</a>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            {user.role === "Admin" && <Link href="/dashboard" className="hover:text-gray-300">Admin</Link> }
            <Link href="/profile" className="hover:text-gray-300">Profile</Link>
            <p onClick={logOutAction} className="cursor-pointer hover:text-gray-300">Logout</p>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
             🍔
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-800 shadow-lg z-50"> {/* Added positioning */}
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" onClick={closeMenu} className="block hover:text-gray-300 py-2">Home</Link>
            {user.role === "Admin" && <Link href="/dashboard" onClick={closeMenu} className="block hover:text-gray-300 py-2">Admin</Link> }
            <Link href="/profile" onClick={closeMenu} className="block hover:text-gray-300 py-2">Profile</Link>
            <p onClick={logOutAction} className="cursor-pointer hover:text-gray-300 py-2">Logout</p>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;