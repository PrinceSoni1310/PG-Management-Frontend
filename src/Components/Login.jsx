import axios from "axios";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export const Login = () => {
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    console.log(data);
    try {
      const res = await axios.post("/user/login", data);
      console.log("response..", res);
      console.log(res.data.role);
      

      if (res.status == 200) {
        toast.success("Login sucess");
         console.log("role...",res.data.role)

         console.log(res.data.token);
         localStorage.setItem("token",res.data.token)
         localStorage.setItem("role",res.data.role)
         

        if (res.data.role.toLowerCase() == "tenant" || res.data.role == "TENANT") {
          navigate("/tenant/dashboard");
        } else if (res.data.role.toLowerCase() == "owner" || res.data.role == "OWNER") {
          navigate("/owner/dashboard");
        } 
      }
       else {
          toast.error("invalid role");
          navigate("/login");
        }
    } catch (err) {
      toast.error("error while login user");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const validataionSchema = {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 relative bg-blue-600">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
            alt="Office Lobby"
            className="absolute inset-0 w-full h-full object-cover opacity-90"
          />
          <div className="relative z-10 h-full flex flex-col justify-end p-10 text-white bg-gradient-to-t from-black/70 to-transparent">
            <h2 className="text-3xl font-bold italic mb-2">Paying Guest</h2>
            <p className="text-gray-200 text-sm italic">
              Manage your property with ease and precision.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition duration-200 focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                {...register("email", validataionSchema.emailValidation)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                  <Link to="/forgotpassword">
                  Forgot Password?
                  </Link>
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg outline-none transition duration-200 focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                {...register("password", validataionSchema.passwordValidation)}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transform active:scale-[0.98] transition duration-200"
            >
              Sign In
            </button>
          </form>



          <div className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?
            <Link to="/signup">
              <button className="text-blue-600 font-bold hover:underline cursor-pointer">
                Register Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
