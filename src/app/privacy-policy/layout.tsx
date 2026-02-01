import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy | EmailTracker - Data Protection & Security",
  description: "Learn how EmailTracker protects your privacy and personal data. Comprehensive privacy policy covering data collection, usage, security, and your rights under GDPR and CCPA.",
  keywords: "privacy policy, data protection, GDPR, CCPA, email privacy, data security, EmailTracker privacy",
  openGraph: {
    title: "Privacy Policy | EmailTracker",
    description: "Learn how EmailTracker protects your privacy and personal data.",
    type: "website",
    url: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
