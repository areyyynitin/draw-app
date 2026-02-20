"use client"
import React from 'react'
import { Card } from "@repo/ui/card"
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'

export default function Authpage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
        <div className="p-8 bg-white rounded-2xl">

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-black">
              {isSignin ? "Welcome Back" : "Create Account "}
            </h1>
            <p className="text-sm text-black mt-1">
              {isSignin
                ? "Sign in to continue to your account"
                : "Sign up to get started"}
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              className="h-11 rounded-lg"
            />

            {!isSignin && (
              <Input
                type="text"
                placeholder="Full Name"
                className="h-11 rounded-lg"
              />
            )}

            <Input
              type="password"
              placeholder="Password"
              className="h-11 rounded-lg"
            />

            <Button className="w-full h-11 rounded-lg text-base font-semibold transition-all duration-200 hover:scale-[1.02]">
              {isSignin ? "Sign In" : "Sign Up"}
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isSignin ? "Don't have an account?" : "Already have an account?"}
            <span className="ml-1 font-medium text-black cursor-pointer hover:underline">
              {isSignin ? "Sign Up" : "Sign In"}
            </span>
          </div>

        </div>
      </Card>
    </div>
  )
}