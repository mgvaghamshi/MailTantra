"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/auth-context';
import { registerSchema, RegisterFormData } from '@/lib/validations';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// --- SVG Logo Component with Animation ---
// The outer mandala elements are wrapped in a <g> tag with a CSS class 
// to handle the spinning animation, while the inner envelope remains static.

const MailTantraLogo = ({ className }: { className?: string }) => {
    // Arrays to generate the mandala pattern programmatically
    const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
    const angles2 = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient id="gradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                    <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
                </linearGradient>
            </defs>
            
            {/* Animated Group: This group contains the spinning mandala elements */}
            <g className="animate-spin-slow" style={{ transformOrigin: '50% 50%' }}>
                <g transform="translate(50,50)">
                    <circle cx="0" cy="0" r="35" stroke="url(#gradLogo)" strokeWidth="2" strokeOpacity="0.5" fill="none"/>
                    <circle cx="0" cy="0" r="45" stroke="url(#gradLogo)" strokeWidth="2" strokeOpacity="0.3" fill="none"/>
                    {angles1.map(angle => (
                        <path key={angle} d="M0 25 L0 40" transform={`rotate(${angle})`} stroke="url(#gradLogo)" strokeWidth="3" fill="none"/>
                    ))}
                    {angles2.map(angle => (
                         <circle key={angle} cx="0" cy="40" r="3" transform={`rotate(${angle})`} stroke="url(#gradLogo)" strokeWidth="2" fill="none"/>
                    ))}
                </g>
            </g>
            
            {/* Static Group: This group contains the stationary envelope icon */}
            <g fill="none" stroke="url(#gradLogo)" strokeWidth="3" strokeLinecap="round">
                <path d="M35 40 L50 50 L65 40" strokeWidth="4"/>
                <rect x="35" y="40" width="30" height="20" rx="2" strokeWidth="4"/>
            </g>
        </svg>
    );
};

export default function RegisterForm() {
  const router = useRouter();
  const { register: registerUser, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptedTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    try {
      await registerUser(data);
      toast.success("Account created successfully!");
      router.push("/"); // Redirect to main dashboard page
    } catch (error) {
      // Error is handled in the auth context with toast
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      {/* CSS for the animation */}
      <style jsx global>{`
        @keyframes gradient-animation {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin 20s linear infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-animation 15s ease infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 animate-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-block">
                <MailTantraLogo className="h-20 w-20 mx-auto" />
              </Link>
              <h1 className="text-3xl font-bold text-white mt-4 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-300">
                Join Mail Tantra and start sending emails
              </p>
            </div>

            {/* Register Form */}
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-white/90 font-medium">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                        <Input
                          {...register('first_name')}
                          id="first_name"
                          type="text"
                          placeholder="John"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                          disabled={isSubmitting || loading}
                        />
                      </div>
                      {errors.first_name && (
                        <p className="text-sm text-red-400 mt-1">{errors.first_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-white/90 font-medium">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                        <Input
                          {...register('last_name')}
                          id="last_name"
                          type="text"
                          placeholder="Doe"
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                          disabled={isSubmitting || loading}
                        />
                      </div>
                      {errors.last_name && (
                        <p className="text-sm text-red-400 mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <Input
                        {...register('email')}
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                        disabled={isSubmitting || loading}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <Input
                        {...register('password')}
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a strong password"
                        className="pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                        disabled={isSubmitting || loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        disabled={isSubmitting || loading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password_confirm" className="text-white/90 font-medium">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                      <Input
                        {...register('password_confirm')}
                        id="password_confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10 pr-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400 focus:ring-purple-400/20"
                        disabled={isSubmitting || loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                        disabled={isSubmitting || loading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password_confirm && (
                      <p className="text-sm text-red-400 mt-1">{errors.password_confirm.message}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      disabled={isSubmitting || loading}
                      className="mt-1 border-white/30 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                    />
                    <Label htmlFor="terms" className="text-sm leading-5 mb-0 text-white/90">
                      I agree to the{' '}
                      <Link href="/terms" className="text-purple-300 hover:text-purple-200 transition-colors underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-purple-300 hover:text-purple-200 transition-colors underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                  {!acceptedTerms && isSubmitting && (
                    <p className="text-sm text-red-400">You must accept the terms and conditions</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-center">
                    <span className="text-white/70 text-sm">
                      Already have an account?{' '}
                      <Link
                        href="/auth/login"
                        className="text-purple-300 hover:text-purple-200 font-medium transition-colors underline"
                      >
                        Sign in
                      </Link>
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-white/60">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-purple-300 hover:text-purple-200 underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-purple-300 hover:text-purple-200 underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
