'use client'
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner";
import { Check, X } from 'lucide-react';
import { login, signup } from '@/actions/auth';


const PasswordRequirement = ({ isValid, text }: { isValid: boolean; text: string }) => (
  <div className="flex items-center gap-2 text-sm">
    {isValid ? (
      <Check className="w-4 h-4 text-green-500" />
    ) : (
      <X className="w-4 h-4 text-red-500" />
    )}
    <span className={isValid ? "text-green-700" : "text-red-700"}>{text}</span>
  </div>
);



export default function SignUpPage () {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
  const [password, setPassword] = useState('');

  const hasLength = password.length >= 8;
  const hasDigit = /\d/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const passwordStrength = 
    hasLength && hasDigit && hasLower && hasUpper && hasSymbol ? "Strong" :
    hasLength && hasDigit && (hasLower || hasUpper) ? "Moderate" :
    hasLength && hasDigit ? "Weak" : "Very Weak";

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "Strong": return "bg-green-500";
      case "Moderate": return "bg-yellow-500";
      case "Weak": return "bg-orange-500";
      default: return "bg-red-500";
    }
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      
      const response = await signup(formData);

      if (!response.success) {
        toast.error(response.error);
        return;
      }
      console.log(response)

      return;
      setVerificationEmail(email);
      toast.success('Account created successfully! Please check your email.');
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      setVerificationEmail(null);
    } finally {
      setIsLoading(false);
    }
  };


  if (verificationEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
        <Toaster position='top-center'/>
        <Card className="w-full max-w-md p-8 text-center">
          <CardContent className="space-y-6">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Verify your email</h2>
            
            <div className="space-y-4 text-gray-600">
              <p>We've sent a verification link to:</p>
              <p className="font-medium text-purple-600">{verificationEmail}</p>
              <p>Click the link in the email to verify your account.</p>
            </div>

            <div className="pt-4 space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or
              </p>
              <Button
                variant="outline"
                onClick={() => setVerificationEmail(null)}
                className="text-purple-600 hover:text-purple-700"
              >
                Try another email address
              </Button>
            </div>

            <Button
              variant="link"
              onClick={() => router.push('/auth/login')}
              className="text-gray-600 hover:text-gray-800"
            >
              I'll verify later, take me to login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse md:flex-row relative w-full min-h-screen">
      <div className="absolute inset-0 bg-[url('/auth_bg.svg')] bg-no-repeat bg-cover bg-center"></div>

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

      <div className="w-full md:w-1/2 p-6 md:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md p-8 bg-white backdrop-blur-md shadow-xl rounded-3xl border-2 border-white/50">
          <CardContent className="space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Join EduShare
              </h1>
              <p className="text-lg text-gray-600">
                Your Gateway to Collaborative Learning
              </p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="h-12 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-purple-50/50"
                />
              </div>

              <div className="space-y-2">
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg rounded-xl border-2 border-purple-100 focus:border-purple-300 bg-purple-50/50"
                />
                
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">Password Strength: {passwordStrength}</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                        style={{ 
                          width: `${
                            passwordStrength === "Strong" ? "100%" :
                            passwordStrength === "Moderate" ? "66%" :
                            passwordStrength === "Weak" ? "33%" : "10%"
                          }`
                        }}
                      />
                    </div>
                  </div>
                  
                  <PasswordRequirement isValid={hasLength} text="Minimum 8 characters" />
                  <PasswordRequirement isValid={hasDigit} text="At least one number" />
                  <PasswordRequirement isValid={hasLower} text="At least one lowercase letter" />
                  <PasswordRequirement isValid={hasUpper} text="At least one uppercase letter" />
                  <PasswordRequirement isValid={hasSymbol} text="At least one special character" />
                </div>
              </div>

              <Button 
                type="submit"
                disabled={isLoading || !hasLength || !hasDigit || !hasLower || !hasUpper || !hasSymbol}
                className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200" />
              </div>
              <div className="relative flex justify-center text-base">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>

            <p className="text-center text-base text-gray-600">
              Already have an account?{' '}
              <a 
                className="font-semibold cursor-pointer text-purple-600 hover:text-purple-500" 
                onClick={() => router.push('/auth/login')}
              >
                Sign in
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

