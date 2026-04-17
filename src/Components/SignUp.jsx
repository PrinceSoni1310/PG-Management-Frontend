import { authAPI } from "../services/api";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

  const navigate = useNavigate();

  const submitHandler = async (data) => {
  try {
    const { confirmPassword, ...sendData } = data; // ✅ remove confirmPassword

    const res = await authAPI.register(sendData);

    if (res.status == 201) {
      toast.success("user register successfully");
      navigate("/login");
    }
  } catch (err) {
    console.log(err.response?.data);
    toast.error("user not sign-up successfully");
  }
};

  const validataionSchema = {
    fullNameValidation: {
      required: { value: true, message: "Username is required*" },
      minLength: { value: 5, message: "Minimum 5 characters required*" },
      maxLength: { value: 15, message: "Max 15 characters allowed*" },
    },
    emailValidation: {
      required: { value: true, message: "Email is required*" },
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email",
      },
    },
    passwordValidation: {
      required: { value: true, message: "Password is required*" },
      minLength: { value: 8, message: "Minimum 8 characters*" },
    },
    confirmPasswordValidation: {
      required: { value: true, message: "Confirm password is required*" },
      validate: (params) =>
        params === password || "Confirm password does not match*",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 relative bg-blue-600">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070"
            alt="Modern Architecture"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white bg-gradient-to-t from-black/60 to-transparent">
            <h2 className="text-4xl font-bold italic mb-2">Paying Guest</h2>
            <p className="text-gray-200">
              The world's most trusted PG management platform for owners.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
            <p className="text-gray-500 mt-2 text-sm">
              Create an account to start managing your PG effortlessly.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(submitHandler)}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                fullName
              </label>
              <input
                type="text"
                placeholder="Enter fullName"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                {...register("fullName", validataionSchema.fullNameValidation)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="owner@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                {...register("email", validataionSchema.emailValidation)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>

              <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="tenant"
                    {...register("role", { required: "Role is required*" })}
                  />
                  Tenant
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="owner"
                    {...register("role", { required: "Role is required*" })}
                  />
                  Owner
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="admin"
                    {...register("role", { required: "Role is required*" })}
                  />
                  Admin
                </label>
              </div>

              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  {...register(
                    "password",
                    validataionSchema.passwordValidation,
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  {...register(
                    "confirmPassword",
                    validataionSchema.confirmPasswordValidation,
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transform active:scale-[0.98] transition-all duration-200 mt-6 shadow-md"
            >
              Sign up
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?
            <Link to="/login">
              <button className="text-blue-600 font-semibold cursor-pointer hover:underline">
                Log In
              </button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
