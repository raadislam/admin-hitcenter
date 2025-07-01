// src/app/login/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen w-full">
      {/* Left Side Image Section (hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 bg-[#F55600] justify-center items-center p-8">
        <div className="text-white max-w-md">
          <Image
            src="/man_reading.png" // make sure this PNG exists in /public
            alt="Login visual"
            width={400}
            height={400}
            className="mx-auto"
          />
          <h2 className="mt-6 text-2xl font-semibold text-center">
            Access An Affordable Education <br /> & Pursue Your Passion.
          </h2>
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12">
        <div className="max-w-sm w-full">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={120}
            height={40}
            className="mb-6"
          />
          <h1 className="text-xl font-bold mb-2">Login</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your credentials to login to your account
          </p>

          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="text"
                id="email"
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                required
                className="pr-10"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon size={18} />
                ) : (
                  <EyeIcon size={18} />
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Link
                href="#"
                className="text-sm text-orange-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#F55600] hover:bg-[#dd4700]"
            >
              Log In
            </Button>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Sign in with Google
            </Button>
          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link href="#" className="text-orange-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
