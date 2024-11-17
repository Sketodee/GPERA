import React from 'react'

const Loader = () => {
  return (
        <div className="flex justify-center items-center min-h-[50px]">
          <div className="animate-spin w-8 h-8 border-4 border-black-700 border-t-transparent rounded-full" />
        </div>
  )
}

export default Loader