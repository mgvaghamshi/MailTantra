import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RateLimitProvider } from "@/contexts/rate-limit-context";
import { AuthProvider } from "@/contexts/auth-context";
import { AppLayout } from "@/components/app-layout";
import { ApiRateLimitInitializer } from "@/components/api-rate-limit-initializer";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Mail Tantra Dashboard | Professional Email Marketing",
  description: "Professional email marketing and tracking dashboard with enterprise-grade features",
  keywords: "email marketing, email tracking, campaign management, analytics, Mail Tantra",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="nimbus-theme">
      <body className={`${inter.variable} font-inter antialiased bg-gray-50 text-gray-900 leading-relaxed`}>
        <AuthProvider>
          <RateLimitProvider>
            <ApiRateLimitInitializer />
            <AppLayout>
              {children}
            </AppLayout>
            <Toaster 
              position="top-right" 
              richColors 
              toastOptions={{
                className: 'nimbus-toast',
                style: {
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-inter)',
                }
              }}
            />
          </RateLimitProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
