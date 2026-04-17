import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI, pgAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (data) => {
    try {
      const res = await authAPI.login(data);

      const user = res?.data?.user;
      const token = res?.data?.token;

      if (!user || !token) {
        toast.error("Invalid response from server");
        return;
      }

      const role = user.role?.toLowerCase();

      // ✅ STORE DATA
      const normalizedUser = { ...user, id: user._id };

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      localStorage.setItem("userId", user._id);
      if (user.pgId) localStorage.setItem("pgId", user.pgId);

      login(token, role);

      toast.success("Login successful");

      // ===========================
      // ✅ TENANT
      // ===========================
      if (role === "tenant") {
        navigate("/tenant/dashboard");
      }

      // ===========================
      // ✅ OWNER
      // ===========================
      else if (role === "owner") {
        try {
          const pgRes = await pgAPI.getOwnerPGs();
          const pgs = pgRes?.data?.data || [];

          // 🟢 FIRST TIME OWNER
          if (pgs.length === 0) {
            navigate("/owner/create-pg");
            return;
          }

          const approvedPGs = pgs.filter(pg => pg.status === "approved");
          const pendingPGs = pgs.filter(pg => pg.status === "pending");

          // 🟢 APPROVED
          if (approvedPGs.length > 0) {
            localStorage.setItem("selectedPgId", approvedPGs[0]._id);
            navigate("/owner/dashboard");
          }

          // 🟡 PENDING
          else if (pendingPGs.length > 0) {
            navigate("/owner/pending-approval");
          }

          // 🔴 REJECTED / NO VALID
          else {
            navigate("/owner/create-pg");
          }

        } catch (err) {
          console.error("PG fetch error:", err);
          navigate("/owner/dashboard"); // fallback
        }
      }

      // ===========================
      // ✅ ADMIN
      // ===========================
      else if (role === "admin") {
        navigate("/admin/dashboard");
      }

      else {
        toast.error("Invalid role");
      }

    } catch (err) {
      console.error("Login error:", err);

      const message =
        err?.response?.data?.message || "Login failed";
      toast.error(message);
    }
  };

  const validationSchema = {
    email: {
      required: "Email is required",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email",
      },
    },
    password: {
      required: "Password is required",
      minLength: {
        value: 6,
        message: "Minimum 6 characters",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT IMAGE */}
        <div className="hidden md:block md:w-1/2 bg-blue-600 relative">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069"
            alt="bg"
            className="absolute w-full h-full object-cover opacity-90"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-6">
            Please login to continue
          </p>

          <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

            {/* EMAIL */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-3 border rounded ${
                  errors.email ? "border-red-500" : ""
                }`}
                {...register("email", validationSchema.email)}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-3 border rounded ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", validationSchema.password)}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>

          <div className="mt-5 text-sm text-center">
            <Link to="/forgotpassword" className="text-blue-600">
              Forgot Password?
            </Link>
          </div>

          <div className="mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;