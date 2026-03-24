import axios from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const submitHandler = async (data) => {
    setLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const res = await axios.post("/user/forgotpassword", data)
      if (res.status === 200) {
        setSuccessMessage('Password reset link sent to your email! Redirecting...')
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Forgot Password</h1>
        <p className="text-center text-gray-600 text-sm mb-6">Enter your email to receive a password reset link</p>

        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email"
                }
              })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Remember your password?{' '}
          <a href="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
            Back to Login
          </a>
        </p>
      </div>
    </div>
  )
}
