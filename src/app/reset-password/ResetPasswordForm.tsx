"use client";
import api from "@/lib/axios";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const externalId = searchParams.get("external_id") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await api.post("/password/reset", {
        token,
        email,
        external_id: externalId,
        password,
        password_confirmation: confirmPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      console.log(err);
      setError(
        err?.response?.data?.message || "Password reset failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Countdown and redirect after success
  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((c) => {
          if (c === 1) {
            clearInterval(timer);
            router.push("/login");
          }
          return c - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [success, router]);

  return (
    <Suspense>
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex rounded-2xl shadow-xl bg-white overflow-hidden min-h-[480px] min-w-[850px] max-w-3xl w-full">
          {/* Left Side Image */}
          <div className="relative w-[420px] bg-gray-200 hidden md:block">
            <Image
              src="/generic/login-image.jpg"
              alt="Visual"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute left-0 right-0 bottom-0 bg-black/50 px-8 py-6 rounded-bl-2xl rounded-tr-[90px]">
              <span className="text-white font-semibold text-lg tracking-wider block text-center">
                RESET YOUR PASSWORD SECURELY
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1 flex flex-col justify-center px-10 py-8 bg-white">
            <div className="flex items-center mb-8">
              <Image
                src="/generic/logo.png"
                alt="HITT CENTER"
                width={150}
                height={50}
                priority
              />
            </div>

            {/* Success Message */}
            {success ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle2 className="text-green-500" size={60} />
                <h2 className="text-2xl font-semibold">
                  Password Reset Successful
                </h2>
                <p className="text-gray-600">
                  Your password has been updated. Redirecting to login in{" "}
                  <span className="font-semibold">{countdown}</span> seconds...
                </p>
                <button
                  onClick={() => router.push("/login")}
                  className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-hover)] transition"
                >
                  Go to Login Now
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">Set New Password</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Resetting password for{" "}
                  <span className="font-medium">{email}</span>
                </p>

                {error && (
                  <div className="mb-4 text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm flex items-center gap-2">
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 16a1.25 1.25 0 111.25-1.25A1.25 1.25 0 0112 18zm1-4.5a1 1 0 01-2 0V8a1 1 0 012 0z"
                      ></path>
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleReset}>
                  {/* New Password */}
                  <label htmlFor="password" className="text-[15px] font-medium">
                    New Password
                  </label>
                  <div className="relative mt-1 mb-4">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Confirm Password */}
                  <label
                    htmlFor="confirmPassword"
                    className="text-[15px] font-medium"
                  >
                    Confirm Password
                  </label>
                  <div className="relative mt-1 mb-6">
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        showConfirm ? "Hide password" : "Show password"
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                      onClick={() => setShowConfirm((v) => !v)}
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-hover)] transition text-lg flex items-center justify-center ${
                      loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading && (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    )}
                    Reset Password
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
