"use client";

import React from 'react';
import { Shield, Mail, Lock, Eye, FileText, Users, Clock, Globe, ChevronRight, ArrowLeft } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const lastUpdated = "January 15, 2025";

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      icon: <FileText className="w-5 h-5 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Welcome to EmailTracker ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our email tracking and analytics service.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By using EmailTracker, you agree to the collection and use of information in accordance with this policy. We will not use or share your information with anyone except as described in this Privacy Policy.
          </p>
        </div>
      )
    },
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: <Eye className="w-5 h-5 text-purple-600" />,
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Personal Information</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Account information (name, email address, password)</li>
              <li>Billing information (credit card details, billing address)</li>
              <li>Contact information for support and communication</li>
              <li>Company information (business name, industry, size)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Email and Campaign Data</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Email content and metadata you send through our service</li>
              <li>Recipient email addresses and engagement data</li>
              <li>Tracking data (opens, clicks, bounces, unsubscribes)</li>
              <li>Campaign performance metrics and analytics</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Technical Information</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>IP addresses and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and feature interactions</li>
              <li>API usage logs and error reports</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "information-use",
      title: "How We Use Your Information",
      icon: <Users className="w-5 h-5 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To provide, operate, and maintain our email tracking service</li>
            <li>To process your transactions and manage your account</li>
            <li>To improve, personalize, and expand our service offerings</li>
            <li>To understand and analyze how you use our service</li>
            <li>To develop new products, services, features, and functionality</li>
            <li>To communicate with you about updates, security alerts, and support</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To find and prevent fraud and enhance security</li>
            <li>To comply with legal obligations and enforce our terms</li>
          </ul>
        </div>
      )
    },
    {
      id: "information-sharing",
      title: "Information Sharing and Disclosure",
      icon: <Globe className="w-5 h-5 text-orange-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
          </p>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Service Providers</h4>
            <p className="text-gray-700 mb-2">
              We may share your information with trusted third-party service providers who assist us in:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Cloud hosting and infrastructure services</li>
              <li>Payment processing and billing</li>
              <li>Customer support and communication</li>
              <li>Analytics and performance monitoring</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Legal Requirements</h4>
            <p className="text-gray-700">
              We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Business Transfers</h4>
            <p className="text-gray-700">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: <Lock className="w-5 h-5 text-red-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Our Security Measures Include:</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>End-to-end encryption for data transmission</li>
              <li>Encrypted data storage with AES-256 encryption</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Multi-factor authentication for account access</li>
              <li>Role-based access controls for our team</li>
              <li>Regular backup and disaster recovery procedures</li>
            </ul>
          </div>
          <p className="text-gray-700 leading-relaxed">
            While we strive to protect your personal information, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security but are committed to maintaining the highest standards of data protection.
          </p>
        </div>
      )
    },
    {
      id: "data-retention",
      title: "Data Retention",
      icon: <Clock className="w-5 h-5 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Account Data</h4>
              <p className="text-gray-700 text-sm">Retained while your account is active and for 90 days after account deletion.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Email Campaign Data</h4>
              <p className="text-gray-700 text-sm">Retained for up to 2 years for analytics and compliance purposes.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Billing Information</h4>
              <p className="text-gray-700 text-sm">Retained for 7 years as required by tax and accounting regulations.</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Support Tickets</h4>
              <p className="text-gray-700 text-sm">Retained for 3 years to improve our service quality.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "your-rights",
      title: "Your Rights and Choices",
      icon: <Shield className="w-5 h-5 text-emerald-600" />,
      content: (
        <div className="space-y-6">
          <p className="text-gray-700 leading-relaxed">
            Depending on your location, you may have certain rights regarding your personal information:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">GDPR Rights (EU Users)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">CCPA Rights (California Users)</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising rights</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">How to Exercise Your Rights</h4>
            <p className="text-green-800 text-sm">
              To exercise any of these rights, please contact us at <a href="mailto:privacy@emailtracker.com" className="underline">privacy@emailtracker.com</a> or through your account settings. We will respond to your request within 30 days.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "cookies",
      title: "Cookies and Tracking Technologies",
      icon: <Eye className="w-5 h-5 text-yellow-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and improve our service.
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Essential Cookies</h4>
              <p className="text-gray-700 text-sm">Required for the service to function properly, including authentication and security.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
              <p className="text-gray-700 text-sm">Help us understand how users interact with our service to improve functionality.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
              <p className="text-gray-700 text-sm">Used to personalize content and ads (with your consent).</p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            You can control cookie preferences through your browser settings or our cookie consent manager. Disabling certain cookies may limit some functionality.
          </p>
        </div>
      )
    },
    {
      id: "international-transfers",
      title: "International Data Transfers",
      icon: <Globe className="w-5 h-5 text-cyan-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            EmailTracker operates globally, and your personal information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Transfer Safeguards</h4>
            <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
              <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
              <li>Adequacy decisions for transfers to approved countries</li>
              <li>Binding Corporate Rules for intra-group transfers</li>
              <li>Data Processing Agreements with all service providers</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      icon: <Users className="w-5 h-5 text-pink-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            EmailTracker is not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If we become aware that we have collected personal information from a child under 16 without verification of parental consent, we will take steps to remove that information from our servers.
          </p>
        </div>
      )
    },
    {
      id: "policy-updates",
      title: "Changes to This Privacy Policy",
      icon: <Clock className="w-5 h-5 text-gray-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Posting the updated policy on our website</li>
            <li>Sending an email notification to your registered email address</li>
            <li>Displaying a prominent notice in your account dashboard</li>
          </ul>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              <strong>Important:</strong> Your continued use of EmailTracker after any changes to this Privacy Policy constitutes your acceptance of the updated policy.
            </p>
          </div>
        </div>
      )
    }
  ];

  const scrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </a>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">EmailTracker</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="flex items-center w-full text-left text-sm text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                    >
                      {section.icon}
                      <span className="ml-2">{section.title}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Header */}
              <div className="px-8 py-8 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                    <p className="text-gray-600 mt-1">Last updated: {lastUpdated}</p>
                  </div>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  This Privacy Policy describes how EmailTracker collects, uses, and protects your personal information when you use our email tracking and analytics service.
                </p>
              </div>

              {/* Content Sections */}
              <div className="px-8 py-8 space-y-12">
                {sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                        {section.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">Section {index + 1}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-14">
                      {section.content}
                    </div>
                  </section>
                ))}
              </div>

              {/* Contact Information */}
              <div className="px-8 py-8 border-t border-gray-200 bg-gray-50">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Questions About This Privacy Policy?</h3>
                  <p className="text-gray-600 mb-6">
                    If you have any questions about this Privacy Policy or our data practices, please don't hesitate to contact us.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="mailto:privacy@emailtracker.com"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Mail className="w-5 h-5 mr-2" />
                      privacy@emailtracker.com
                    </a>
                    <a 
                      href="/help"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Help Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
