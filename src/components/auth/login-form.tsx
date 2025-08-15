"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/auth-context';
import { loginSchema, LoginFormData } from '@/lib/validations';

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

// UI Component styles matching landing page
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => 
  <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ${className}`}>{children}</div>;

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => 
  <div className={`p-8 ${className}`}>{children}</div>;

const Label = ({ children, htmlFor, className = '' }: { children: React.ReactNode, htmlFor?: string, className?: string }) => 
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-700 mb-2 ${className}`}>{children}</label>;

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { className?: string }>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`appearance-none block w-full px-4 py-3 bg-white/60 border border-gray-200 rounded-lg shadow-sm placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const Button = ({ children, className = '', disabled, ...props }: { children: React.ReactNode, className?: string, disabled?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    disabled={disabled}
    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Ensure we only render random elements on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.push('/'); // Redirect to dashboard
    } catch (error) {
      // Error is handled by the auth context
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
          background: linear-gradient(-45deg, #0f0f23, #1a1a3e, #2d1b69, #3730a3, #4338ca, #6366f1);
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
          border-color: rgba(99, 102, 241, 0.8) !important;
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3) !important;
        }
      `}</style>
      
      <div className="auth-container animate-gradient-flow flex items-center justify-center">
        {/* Animated particles background */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Main content container */}
                <div className="relative z-10 w-full max-w-sm mx-auto px-4">
          {/* Logo and Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-block mb-4">
              <MailTantraLogo className="h-16 w-16 mx-auto float" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-white/80">
              Sign in to your Mail Tantra account
            </p>
          </div>

          {/* Login Card */}
          {/* Login Form */}
          <div className="glass-card rounded-lg p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white/90">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    {...register('email')}
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="glass-input w-full pl-10 pr-4 py-3 rounded-lg text-sm focus:outline-none transition-all duration-300"
                    disabled={isSubmitting || loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-white/90">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="glass-input w-full pl-10 pr-12 py-3 rounded-lg text-sm focus:outline-none transition-all duration-300"
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
                  <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

                            <div className="flex items-center justify-end">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-white/80 hover:text-white transition-colors font-medium underline"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg text-sm shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              <div className="text-center mt-4">
                <span className="text-sm text-white/70">
                  Don't have an account?{' '}
                  <Link
                    href="/auth/register"
                    className="text-white font-medium hover:text-white/90 transition-colors underline"
                  >
                    Create one here
                  </Link>
                </span>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-white/50 text-sm">
              By signing in, you agree to our{' '}
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
