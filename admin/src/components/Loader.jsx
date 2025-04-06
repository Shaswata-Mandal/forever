import React from 'react'
import { TailSpin } from 'react-loader-spinner';

const Loader = () => {
  return (
    <div className="flex  justify-center items-center h-48">
      <TailSpin
        height="60"
        width="60"
        color="#4F46E5" // Customize the color
        ariaLabel="loading"
      />
    </div>
  )
}

export default Loader