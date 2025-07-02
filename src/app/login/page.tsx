"use client";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import api from "@/lib/axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  useAuthRedirect();
  useRequireAuth();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/login", {
        user_id: userId,
        password: password,
        remember: remember,
      });
      // Assume the API returns token/user info on success:
      // Store JWT in localStorage/sessionStorage (or cookies if using httpOnly)
      localStorage.setItem("hitcenter_token", res.data.token);
      localStorage.setItem("hitcenter_user", JSON.stringify(res.data.user));

      // Optionally: redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed. Please check your User ID and Password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
      <div className="flex rounded-2xl shadow-xl bg-white overflow-hidden min-h-[480px] min-w-[850px] max-w-3xl w-full">
        {/* Left Side Image (hidden on mobile) */}
        <div className="relative w-[420px] bg-gray-200 hidden md:block">
          <Image
            src="/generic/login-image.jpg"
            alt="Login Visual"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute left-0 right-0 bottom-0 bg-black/50 px-8 py-6 rounded-bl-2xl rounded-tr-[90px]">
            <span className="text-white font-semibold text-lg tracking-wider block text-center">
              ACCESS AN AFFORDABLE EDUCATION
              <br />
              AND PURSUE YOUR DREAM
            </span>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="flex-1 flex flex-col justify-center px-10 py-8 bg-white">
          {/* Logo & Title */}
          <div className="flex items-center mb-8">
            <Image
              src="/generic/logo.png"
              alt="HITT CENTER"
              width={150}
              height={50}
              className="mr-3"
              priority
            />
          </div>

          <h2 className="text-xl font-semibold mb-2">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to login to your account
          </p>

          {/* Error message */}
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

          <form onSubmit={handleLogin} autoComplete="on">
            {/* User ID */}
            <label htmlFor="userid" className="text-[15px] font-medium">
              User ID
            </label>
            <input
              id="userid"
              type="text"
              placeholder="User ID"
              autoComplete="username"
              className="mt-1 mb-4 px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              required
            />

            {/* Password */}
            <label htmlFor="password" className="text-[15px] font-medium">
              Password
            </label>
            <div className="relative mt-1 mb-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="px-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={() => setRemember((v) => !v)}
                className="accent-[var(--color-primary)]"
                disabled={loading}
              />
              <label htmlFor="remember" className="ml-2 text-sm">
                Remember me
              </label>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-xl font-semibold text-white bg-[var(--color-primary)] hover:bg-orange-600 transition text-lg flex items-center justify-center ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              style={{ background: "var(--color-primary)" }}
            >
              {loading && <Loader2 className="animate-spin mr-2" size={20} />}
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
