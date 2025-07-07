"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Auth check runs after first render
    const token = localStorage.getItem("hitcenter_token");
    if (!token) {
      setLoggedIn(false);
      setChecking(false);
      // REDIRECT ONLY INSIDE EFFECT!
      router.replace("/login");
    } else {
      setLoggedIn(true);
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {/* Spinner (can be a separate component) */}
        <svg
          className="animate-spin h-12 w-12 text-primary"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    );
  }

  // After check, if not logged in, render nothing (effect will redirect)
  if (!loggedIn) return null;

  // Otherwise, render the protected content!
  return <>{children}</>;
}
