import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";

// ✅ Yup schema
const schema = yup.object({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { email } = useParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const {
    setValue,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // ✅ React Query mutation
  const verifyOtpMutation = useMutation({
    mutationFn: async ({ otp }) => {
      const res = await apiAxios.post(`/api/auth/verify-otp/${email}`, { otp });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verified successfully!");
      navigate(`/change-password/${email}`);
    },
    onError: (err) => {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error(err.message);
      }
    },
  });

  const onSubmit = (data) => {
    verifyOtpMutation.mutate(data);
  };

  const handleChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Update react-hook-form value
    const otpValue = newCode.join("");
    setValue("otp", otpValue, { shouldValidate: true });

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newCode = [...code];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    // Update react-hook-form value
    const otpValue = newCode.join("");
    setValue("otp", otpValue, { shouldValidate: true });

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md max-sm:rounded-none max-sm:h-screen max-sm:max-w-full max-sm:flex flex-col justify-center">
        <h2 className="text-2xl font-bold text-center text-green-500 mb-2">
          Enter verification code
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* OTP Field */}
          <div>
            <label
              htmlFor="otp"
              className="block text-center text-sm font-medium text-gray-500 mb-6"
            >
              We've sent a 6-digit verification code to your email
            </label>

            {/* 6-Digit Input Boxes */}
            <div className="flex gap-2 justify-center">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-400 text-center text-2xl font-semibold transition-colors"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={!isValid || verifyOtpMutation.isPending}
            className={`w-full py-2 rounded-lg transition 
              ${
                isValid && !verifyOtpMutation.isPending
                  ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                  : "bg-green-300 text-gray-200 cursor-not-allowed"
              }`}
          >
            {verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}