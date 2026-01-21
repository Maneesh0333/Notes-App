import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import apiAxios from "@/api/apiAxios";
import { toast } from "react-toastify";

function Verify() {
  const { token } = useParams();
  const navigate = useNavigate();

  // Define mutation
  const verifyMutation = useMutation({
    mutationFn: async (token) => {
      const res = await apiAxios.post(
        "/api/auth/verify",
        {}, // body is empty
        { headers: { Authorization: `Bearer ${token}` } } // config
      );
      return res.data;
    },
    onSuccess: () => {
      setTimeout(() => navigate("/login"), 3000);
    },
  });

  // Trigger mutation once when component loads
  useEffect(() => {
    if (token) verifyMutation.mutate(token);
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-5">
          Email Verification
        </h2>

        {verifyMutation.isPending && (
          <p className="text-gray-700 animate-pulse">Verifying your email...</p>
        )}

        {verifyMutation.isSuccess && verifyMutation.data?.success && (
          <p className="text-green-700 font-semibold">
            ✅ Email verified successfully!
          </p>
        )}

        {verifyMutation.isError && (
          <p className="text-red-500 font-semibold">
            {verifyMutation.error?.response?.data?.message ||
              "Verification failed."}
          </p>
        )}
      </div>
    </div>
  );
}

export default Verify;
