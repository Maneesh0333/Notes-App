import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// yup schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgetPassword() {
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
  const loginMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await apiAxios.post("/api/auth/forget-password", formData);
      return res.data;
    },
    onSuccess: (data, variables) => {
      toast.success(data.message || "OTP sent successfully");
      navigate(`/verify-otp/${variables.email}`);
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

    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md  max-sm:rounded-none max-sm:h-screen max-sm:max-w-full max-sm:flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
          Reset your password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your registered email address and we’ll send you an OTP to reset
          your password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <input
              id="email"
              type="email"
              placeholder="Enter email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              {...register("email")}
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || loginMutation.isPending}
            className={`w-full py-2 rounded-lg transition 
              ${
                isValid && !loginMutation.isPending
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-green-300 text-gray-200 cursor-not-allowed"
              }`}
          >
            {loginMutation.isPending ? "Sending OTP" : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
