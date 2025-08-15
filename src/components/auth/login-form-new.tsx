"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';

import { useAuth } from '@/contexts/auth-context';
import { loginSchema, LoginFormData } from '@/lib/validations';

// SVG Logo Component for Mail Tantra
const MailTantraLogo = ({ className, style }: { className?: string, style?: React.CSSProperties }) => {
    const angles1 = [0, 45, 90, 135, 180, 225, 270, 315];
    const angles2 = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
            <defs>
                <linearGradient id="gradLogo" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6' }} />
                    <stop offset="100%" style={{ stopColor: '#8B5CF6' }} />
                </linearGradient>
            </defs>
            <g fill="none" stroke="url(#gradLogo)" strokeWidth="3" strokeLinecap="round">
                {/* Static envelope - this won't spin */}
                <path d="M35 40 L50 50 L65 40" strokeWidth="4"/>
                <rect x="35" y="40" width="30" height="20" rx="2" strokeWidth="4"/>
                
                {/* Animated border elements - these will spin */}
                <g transform="translate(50,50)" className="animate-spin" style={{animationDuration: '8s'}}>
                    <circle cx="0" cy="0" r="35" strokeWidth="2" strokeOpacity="0.5"/>
                    <circle cx="0" cy="0" r="45" strokeWidth="2" strokeOpacity="0.3"/>
                    {angles1.map(angle => (
                        <path key={angle} d="M0 25 L0 40" transform={`rotate(${angle})`} />
                    ))}
                    {angles2.map(angle => (
                         <circle key={angle} cx="0" cy="40" r="3" transform={`rotate(${angle})`} strokeWidth="2"/>
                    ))}
                </g>
            </g>
        </svg>
    );
};

// UI Component styles matching landing page
const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => 
  <div className={`bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20 ${className}`}>{children}</div>;

const CardContent = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => 
  <div className={`p-8 ${className}`}>{children}</div>;

const Label = ({ children, htmlFor, className = '' }: { children: React.ReactNode, htmlFor?: string, className?: string }) => 
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-200 mb-2 ${className}`}>{children}</label>;

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { className?: string }>(
  ({ className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`appearance-none block w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg shadow-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const Button = ({ children, className = '', disabled, ...props }: { children: React.ReactNode, className?: string, disabled?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    disabled={disabled}
    className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-blue-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    {...props}
  >
    {children}
  </button>
);

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

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
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 flex items-center justify-center relative overflow-hidden">
            {/* Background animations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 animate-pulse"></div>
                <div className="absolute top-0 left-0 w-full h-full">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>
            </div>

            <Card className="w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-lg border-white/20 shadow-2xl shadow-blue-500/10">
                <CardContent className="p-6">
                    <div className="text-center mb-8">
                        <MailTantraLogo className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 mt-2">Sign in to your Mail Tantra account</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    {...register('email')}
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="pl-10 bg-white/50 text-gray-900 placeholder-gray-500"
                                    disabled={isSubmitting || loading}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    {...register('password')}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="pl-10 pr-10 bg-white/50 text-gray-900 placeholder-gray-500"
                                    disabled={isSubmitting || loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || loading}
                        >
                            {isSubmitting || loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>

                        <div className="text-center">
                            <span className="text-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link
                                    href="/auth/register"
                                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    Create account
                                </Link>
                            </span>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Footer */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center">
                <p className="text-xs text-gray-500">
                    By signing in, you agree to our{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
                </p>
            </div>
        </div>
    </>
  );
}
