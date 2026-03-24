import axios from 'axios'
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export const ResetPassword = () => {
    const token = useParams().token
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const { register, handleSubmit, formState: { errors }, watch } = useForm()

    const password = watch('password', '')

    const submitHandler = async (data) => {
        setLoading(true)
        setErrorMessage('')
        setSuccessMessage('')

        try {
            const payload = {
                ...data,
                token: token
            }
            const res = await axios.put("/user/resetpassword", payload)
            
            if (res.status === 200) {
                setSuccessMessage('Password reset successful! Redirecting to login...')
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to reset password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Reset Password</h1>
                <p className="text-center text-gray-600 text-sm mb-6">Enter your new password below</p>

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
                        <label className="block text-gray-700 text-sm font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                    message: "Password must contain uppercase, lowercase, and numbers"
                                }
                            })}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            {...register("confirmPassword", {
                                required: "Please confirm your password",
                                validate: (value) =>
                                    value === password || "Passwords do not match"
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
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
