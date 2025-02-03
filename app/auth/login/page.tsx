'use client'
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';

const SignUpPage = () => {
    const router = useRouter();
  return (
    <div className="flex flex-col-reverse md:flex-row relative w-full min-h-screen ">
      {/* Left Section - Image */}
      <div className="absolute inset-0 bg-[url('/auth_bg.svg')] bg-no-repeat bg-cover bg-center "></div>

      <div className="w-full md:w-1/2 p-6 md:p-8 flex items-center justify-center">
        <div className="relative w-full md:max-w-lg max-w-md">
          <img 
            src="/signup_logo.jpg" 
            alt="Education platform illustration" 
            className="rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/30 to-transparent rounded-3xl" />
        </div>
      </div>

      {/* Right Section - Sign Up Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-white backdrop-blur-md shadow-xl rounded-3xl border-2 border-white/50">
          <CardContent className="space-y-8">
            {/* Header */}
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back!!
              </h1>
              <p className="text-lg text-gray-600">
                Your Gateway to Collaborative Learning
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div>
                <Input
                  type="text"
                  placeholder="Full Name"
                  className="h-12 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-purple-50/50"
                />
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Email Address"
                  className="h-12 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-purple-50/50"
                />
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="h-12 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-purple-50/50"
                />
              </div>

              <Button className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                Login
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-white text-gray-500">
                  or
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <Button 
              variant="outline" 
              className="w-full h-12 text-lg border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 rounded-xl flex items-center justify-center gap-3 transition-all duration-200"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              Continue with Google
            </Button>

            <p className="text-center text-base text-gray-600">
              Don't have an account?{' '}
              <a className="font-semibold cursor-pointer text-purple-600 hover:text-purple-500" onClick={() => router.push('/auth/signup')}>
                Sign up
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;