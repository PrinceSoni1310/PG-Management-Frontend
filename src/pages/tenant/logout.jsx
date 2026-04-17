import React from 'react'

export const logout = () => {
  return (
    <div className="p-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Logout
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg">You have been logged out successfully.</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Thank you for using our service.</p>
      </div>
    </div>
  )
}
