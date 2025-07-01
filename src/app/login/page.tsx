"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f1] p-4">
      <div className="flex bg-white rounded-2xl shadow-md min-w-[320px] w-full max-w-4xl overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex w-1/2 bg-[var(--color-primary)] text-white flex-col justify-center items-center p-8">
          <Image
            src="/login-guy.png"
            width={300}
            height={300}
            alt="Login Illustration"
            className="mb-4"
          />
          <h2 className="text-lg font-semibold text-center">
            Access An Affordable Education
            <br />& Pursue Your Passion.
          </h2>
        </div>

        {/* Right Side */}
        <div className="flex flex-col w-full md:w-1/2 p-6 gap-4 justify-center">
          <div className="mb-4">
            <Image src="/logo.svg" alt="Logo" width={140} height={40} />
            <h2 className="text-xl font-semibold mt-4">Login</h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to login to your account
            </p>
          </div>

          <div>
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="example123"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="text-[var(--color-primary)]">
              Forgot Password?
            </a>
          </div>

          <Button className="bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white rounded-full">
            Sign In
          </Button>

          <p className="text-sm text-center">
            Don’t have an account?{" "}
            <a href="#" className="text-[var(--color-primary)]">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
