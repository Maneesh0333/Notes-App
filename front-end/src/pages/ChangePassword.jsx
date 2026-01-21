import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// ✅ Yup schema
const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "all",
  });

  // ✅ Mutation for changing password
  const changePasswordMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await apiAxios.post(`/api/auth/change-password/${email}`, formData);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Password changed successfully!");
      setTimeout(() => navigate("/login"), 2000);
    },
    onError: (err) => {
      if (err.response) {
        toast.error(err.response?.data?.message);
      } else {
        toast.error(err.message);
      }
    },
  });

  const onSubmit = (data) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md max-sm:rounded-none max-sm:h-screen max-sm:max-w-full max-sm:flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Password */}
          <div className="relative">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              New Password
            </label>
            <input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("newPassword")}
            />
            <div
              className="absolute top-9 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            <p className="text-red-500 text-sm mt-1">{errors.newPassword?.message}</p>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-800 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter new password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              {...register("confirmPassword")}
            />
            <div
              className="absolute top-9 right-3 cursor-pointer text-gray-600"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {!showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword?.message}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid || changePasswordMutation.isPending}
            className={`w-full py-2 rounded-lg transition 
              ${
                isValid && !changePasswordMutation.isPending
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-green-300 text-gray-200 cursor-not-allowed"
              }`}
          >
            {changePasswordMutation.isPending
              ? "Changing Password..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
