"use client";
import AuthWrapper from "@/components/AuthWrapper";
import Image from "next/image";

export default function Home() {
  return (
    <AuthWrapper>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex justify-center flex-col gap-[32px] row-start-2 items-center">
          <Image
            src="/generic/logo.png"
            alt="HITT CENTER"
            width={300}
            height={100}
            className="mr-3"
            priority
          />

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <div className="flex items-center justify-center h-full">
              {/* Use your best spinner */}
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
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
