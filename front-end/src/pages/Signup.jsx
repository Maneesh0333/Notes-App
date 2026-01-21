import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// yup schema
const schema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await apiAxios.post("/api/auth/register", formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate('/verify');
    },
    onError: (err) => {
      if (err.response) {
        toast.error(err.response.data.message); // backend error
      } else {
        toast.error(err.message); // network error
      }
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);

    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md  max-sm:rounded-none max-sm:h-screen max-sm:max-w-full max-sm:flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("username")}
            />
            <p className="text-red-500 text-sm">{errors.username?.message}</p>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("email")}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                {...register("password")}
              />
              {/* Show/hide button */}
              <button
                className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <Eye className="text-gray-800" />
                ) : (
                  <EyeOff className="text-gray-600" />
                )}
              </button>
            </div>
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || registerMutation.isPending}
            className={`w-full py-2 rounded-lg transition 
              ${
                isValid && !registerMutation.isPending
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-green-300 text-gray-200 cursor-not-allowed"
              }`}
          >
            {registerMutation.isPending ? "Signing up" : "Sign Up"}
          </button>
        </form>

        {/* Extra link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link to={'/login'} className="text-indigo-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
