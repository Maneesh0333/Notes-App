import { MailCheck } from "lucide-react";

function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-300">
      <div className="bg-gray-100 p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <MailCheck className="mx-auto text-green-500 w-12 h-12 mb-3" />
        <h2 className="text-2xl font-bold text-green-500 mb-3">
          Verify your Email
        </h2>
        <p className="text-gray-900">
          We’ve sent a verification link to your registered email. Please check your inbox.
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;
