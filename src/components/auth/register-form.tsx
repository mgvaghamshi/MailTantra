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

export function RegisterForm() {
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
      {/* CSS for the animation and full-screen layout */}
      <style jsx global>{`
        /* Reset body and html for true full screen */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        /* Full screen container override */
        .auth-container {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
            animation: spin 20s linear infinite;
        }
        
        .animate-gradient-flow {
          background: linear-gradient(-45deg, #1a1a3e, #2d1b69, #3730a3, #4338ca, #6366f1, #7c3aed, #a855f7, #c026d3);
          background-size: 400% 400%;
          animation: gradientFlow 15s ease infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .float {
          animation: float 6s ease-in-out infinite;
        }
        
        /* Glassmorphism enhancements */
        .glass-card {
          background: rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        
        .glass-input {
          background: rgba(255, 255, 255, 0.15) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: white !important;
        }
        
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(147, 51, 234, 0.8) !important;
          box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.3) !important;
        }
        
        .glass-checkbox {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
        
        .glass-checkbox[data-state="checked"] {
          background: rgba(147, 51, 234, 0.8) !important;
          border-color: rgba(147, 51, 234, 1) !important;
        }
      `}</style>
      
      <div className="auth-container animate-gradient-flow flex items-center justify-center">
        {/* Main content container with scroll for mobile */}
                <div className="relative z-10 w-full max-w-md mx-auto px-4 py-6">
          {/* Logo Section */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block">
              <MailTantraLogo className="h-16 w-16 mx-auto" />
            </Link>
            <h1 className="text-2xl font-bold text-white mt-4 mb-2">
              Create Your Account
            </h1>
            <p className="text-sm text-white/80">
              Join Mail Tantra and start sending emails
            </p>
          </div>

          {/* Register Form */}
          <div className="glass-card rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="first_name" className="block text-xs font-medium text-white/90">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <input
                      {...register('first_name')}
                      id="first_name"
                      type="text"
                      placeholder="John"
                      className="glass-input w-full pl-8 pr-3 py-2 rounded-md text-sm focus:outline-none transition-all duration-300"
                      disabled={isSubmitting || loading}
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-xs text-red-400 mt-1">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label htmlFor="last_name" className="block text-xs font-medium text-white/90">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                    <input
                      {...register('last_name')}
                      id="last_name"
                      type="text"
                      placeholder="Doe"
                      className="glass-input w-full pl-8 pr-3 py-2 rounded-md text-sm focus:outline-none transition-all duration-300"
                      disabled={isSubmitting || loading}
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-xs text-red-400 mt-1">{errors.last_name.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="glass-input w-full pl-8 pr-3 py-2 rounded-md text-sm focus:outline-none transition-all duration-300"
                    disabled={isSubmitting || loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="block text-xs font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    className="glass-input w-full pl-8 pr-10 py-2 rounded-md text-sm focus:outline-none transition-all duration-300"
                    disabled={isSubmitting || loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={isSubmitting || loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="password_confirm" className="block text-xs font-medium text-white/90">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/60 h-4 w-4" />
                  <input
                    {...register('password_confirm')}
                    id="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="glass-input w-full pl-8 pr-10 py-2 rounded-md text-sm focus:outline-none transition-all duration-300"
                    disabled={isSubmitting || loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    disabled={isSubmitting || loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password_confirm && (
                  <p className="text-xs text-red-400 mt-1">{errors.password_confirm.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                  disabled={isSubmitting || loading}
                  className="glass-checkbox mt-0.5"
                />
                <label htmlFor="terms" className="text-xs leading-4 mb-0 text-white/90">
                  I agree to the{' '}
                  <Link href="/terms" className="text-white font-medium hover:text-purple-300 transition-colors underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-white font-medium hover:text-purple-300 transition-colors underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {!acceptedTerms && isSubmitting && (
                <p className="text-xs text-red-400">You must accept the terms and conditions</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="text-center pt-3">
                <span className="text-white/70 text-xs">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="text-white font-medium hover:text-purple-300 transition-colors underline"
                  >
                    Sign in
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-white/50">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-white/70 hover:text-white transition-colors underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-white/70 hover:text-white transition-colors underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
