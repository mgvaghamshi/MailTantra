// "use client";

// import React, { useState, useEffect } from 'react';
// import { 
//   Mail, 
//   BarChart3, 
//   Key, 
//   Users, 
//   FileText, 
//   Zap, 
//   CheckCircle, 
//   Star,
//   ArrowRight,
//   Play,
//   Copy,
//   Check,
//   Menu,
//   X,
//   Rocket,
//   Shield,
//   Clock,
//   Globe,
//   TrendingUp,
//   Code,
//   Database,
//   Activity,
//   MousePointer,
//   Eye,
//   Send,
//   Settings,
//   Smartphone,
//   Monitor,
//   Tablet
// } from 'lucide-react';

// const LandingPage = () => {
//   const [copied, setCopied] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState('curl');
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     setIsVisible(true);
//   }, []);

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const codeExamples = {
//     curl: `curl -X POST "https://api.emailtracker.com/v1/send" \\
//   -H "Authorization: Bearer et_live_abc123..." \\
//   -H "Content-Type: application/json" \\
//   -d '{
//     "to": "user@example.com",
//     "from": "hello@yourapp.com", 
//     "subject": "Welcome aboard!",
//     "html": "<h1>Welcome to our platform!</h1>",
//     "track_opens": true,
//     "track_clicks": true
//   }'`,
//     javascript: `import EmailTracker from 'emailtracker';

// const et = new EmailTracker('et_live_abc123...');

// await et.send({
//   to: 'user@example.com',
//   from: 'hello@yourapp.com',
//   subject: 'Welcome aboard!',
//   html: '<h1>Welcome to our platform!</h1>',
//   trackOpens: true,
//   trackClicks: true
// });`,
//     python: `import emailtracker

// et = emailtracker.EmailTracker('et_live_abc123...')

// et.send(
//   to='user@example.com',
//   from_email='hello@yourapp.com',
//   subject='Welcome aboard!',
//   html='<h1>Welcome to our platform!</h1>',
//   track_opens=True,
//   track_clicks=True
// )`
//   };

//   const stats = [
//     { value: "99.9%", label: "Uptime", change: "+0.1%" },
//     { value: "2.3ms", label: "Avg Response", change: "-15%" },
//     { value: "150M+", label: "Emails Sent", change: "+45%" },
//     { value: "500+", label: "Happy Customers", change: "+25%" }
//   ];

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Floating CTA Button */}
//       <div className="fixed bottom-6 right-6 z-50 md:hidden">
//         <a href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2">
//           <Rocket className="w-4 h-4" />
//           Start Free
//         </a>
//       </div>

//       {/* Navigation */}
//       <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 z-40 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
//                 <Mail className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-gray-900">EmailTracker</span>
//             </div>
            
//             <div className="hidden md:flex items-center space-x-8">
//               <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
//               <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
//               <a href="#docs" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Docs</a>
//               <a href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sign In</a>
//               <a href="/auth/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium shadow-lg">
//                 Start Free
//               </a>
//             </div>

//             <button 
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
//             <div className="px-4 py-4 space-y-4">
//               <a href="#features" className="block text-gray-600 font-medium py-2">Features</a>
//               <a href="#pricing" className="block text-gray-600 font-medium py-2">Pricing</a>
//               <a href="#docs" className="block text-gray-600 font-medium py-2">Docs</a>
//               <div className="pt-2 border-t border-gray-100">
//                 <a href="/auth/login" className="block text-gray-700 font-medium py-2">Sign In</a>
//                 <a href="/auth/register" className="block bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium mt-2">
//                   Start Free
//                 </a>
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>

//       {/* Hero Section */}
//       <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
//             {/* Trust Badge */}
//             <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Shield className="w-4 h-4" />
//               Trusted by 500+ companies worldwide
//             </div>

//             <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
//               Email delivery that
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> tracks everything</span>
//             </h1>
            
//             <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
//               Send, track, and analyze every email with developer-first APIs and an intuitive dashboard. 
//               The reliable Mailgun alternative built for modern teams.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
//               <a href="/auth/register" className="group bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl hover:shadow-2xl">
//                 <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
//                 Start Free Trial
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </a>
//               <a href="#demo" className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-3">
//                 <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
//                 View Live Demo
//               </a>
//             </div>

//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
//               {stats.map((stat, index) => (
//                 <div key={index} className="text-center">
//                   <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
//                   <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
//                   <div className="text-green-600 text-xs font-medium">{stat.change}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Dashboard Preview */}
//           <div className={`relative max-w-6xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
//             <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
//               <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
//                 <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//                 <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                 <span className="text-gray-600 text-sm ml-4 font-mono">app.emailtracker.com</span>
//               </div>
//               <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-[500px] flex items-center justify-center">
//                 <div className="text-center max-w-md">
//                   <div className="mb-6 relative">
//                     <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <BarChart3 className="w-10 h-10 text-white" />
//                     </div>
//                     <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
//                       <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                     </div>
//                   </div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Analytics Dashboard</h3>
//                   <p className="text-gray-600 mb-6">Real-time email tracking and performance metrics</p>
//                   <a href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
//                     <Play className="w-4 h-4" />
//                     View Live Dashboard
//                     <ArrowRight className="w-4 h-4" />
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Trusted By Section */}
//       <section className="py-16 bg-white border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <p className="text-center text-gray-600 mb-12 font-medium">Trusted by innovative companies worldwide</p>
//           <div className="flex justify-center items-center space-x-12 lg:space-x-16 opacity-60 flex-wrap gap-8">
//             {[
//               { name: 'TechFlow', icon: '⚡' },
//               { name: 'DataSync', icon: '🔄' },
//               { name: 'CloudVault', icon: '☁️' },
//               { name: 'NextGen AI', icon: '🤖' },
//               { name: 'DevForge', icon: '🔨' },
//               { name: 'ScaleUp', icon: '📈' }
//             ].map((company, index) => (
//               <div key={index} className="flex items-center gap-2 text-gray-500 font-semibold text-lg">
//                 <span className="text-2xl">{company.icon}</span>
//                 <span>{company.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Core Features */}
//       <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-20">
//             <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Zap className="w-4 h-4" />
//               Powerful Features
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//               Everything you need to scale email delivery
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               From transactional emails to marketing campaigns, our platform handles it all with enterprise-grade reliability and developer-first experience.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: <Send className="w-8 h-8 text-blue-600" />,
//                 title: "Email API",
//                 description: "Send emails via REST API or SMTP. High deliverability rates with real-time status updates and automatic retry logic.",
//                 features: ["REST & SMTP support", "Delivery guarantees", "Automatic retries"]
//               },
//               {
//                 icon: <Activity className="w-8 h-8 text-green-600" />,
//                 title: "Real-Time Tracking",
//                 description: "Track opens, clicks, bounces, and complaints in real-time. Get detailed analytics for every email sent.",
//                 features: ["Open tracking", "Click tracking", "Bounce detection"]
//               },
//               {
//                 icon: <Key className="w-8 h-8 text-purple-600" />,
//                 title: "API Key Management",
//                 description: "Create and manage multiple API keys with custom rate limits, permissions, and usage monitoring per project.",
//                 features: ["Multiple keys", "Rate limiting", "Usage analytics"]
//               },
//               {
//                 icon: <Code className="w-8 h-8 text-orange-600" />,
//                 title: "Developer Docs",
//                 description: "Comprehensive documentation with live examples, SDKs for popular languages, and interactive API explorer.",
//                 features: ["Live examples", "Multiple SDKs", "API explorer"]
//               },
//               {
//                 icon: <BarChart3 className="w-8 h-8 text-red-600" />,
//                 title: "Analytics Dashboard",
//                 description: "Beautiful dashboard with campaign metrics, delivery rates, and performance insights with exportable reports.",
//                 features: ["Campaign metrics", "Performance insights", "Export reports"]
//               },
//               {
//                 icon: <Users className="w-8 h-8 text-indigo-600" />,
//                 title: "Campaign Builder",
//                 description: "Create, schedule, and automate email campaigns with our visual builder and template system.",
//                 features: ["Visual builder", "Automation", "Template system"]
//               }
//             ].map((feature, index) => (
//               <div key={index} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1">
//                 <div className="mb-6 p-3 bg-gray-50 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
//                 <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
//                 <ul className="space-y-2">
//                   {feature.features.map((feat, featIndex) => (
//                     <li key={featIndex} className="flex items-center gap-3 text-sm text-gray-600">
//                       <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
//                       <span>{feat}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>

//           {/* Integration Preview */}
//           <div className="mt-20 text-center">
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to integrate?</h3>
//             <p className="text-gray-600 mb-8">Get started in minutes with our simple API</p>
//             <a href="/auth/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
//               <Rocket className="w-5 h-5" />
//               Start Building Now
//               <ArrowRight className="w-5 h-5" />
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Developer Focused Section */}
//       <section id="docs" className="py-24 bg-gray-900 text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Code className="w-4 h-4" />
//               Developer First
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold mb-6">
//               Built for developers, by developers
//             </h2>
//             <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
//               Simple, well-documented API that gets you sending emails in minutes. 
//               Comprehensive SDKs for all major programming languages with detailed examples.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-12 items-start">
//             <div>
//               <div className="space-y-6 mb-8">
//                 {[
//                   {
//                     icon: <Globe className="w-6 h-6 text-blue-400" />,
//                     title: "RESTful API",
//                     description: "Clean, consistent API design with detailed documentation"
//                   },
//                   {
//                     icon: <Database className="w-6 h-6 text-green-400" />,
//                     title: "Multiple SDKs", 
//                     description: "Native libraries for Python, Node.js, PHP, Go, and more"
//                   },
//                   {
//                     icon: <Activity className="w-6 h-6 text-purple-400" />,
//                     title: "Webhook Support",
//                     description: "Real-time events for deliveries, opens, clicks, and bounces"
//                   },
//                   {
//                     icon: <Shield className="w-6 h-6 text-orange-400" />,
//                     title: "Enterprise Security",
//                     description: "OAuth, rate limiting, and comprehensive error handling"
//                   }
//                 ].map((feature, index) => (
//                   <div key={index} className="flex items-start gap-4">
//                     <div className="p-2 bg-gray-800 rounded-lg">
//                       {feature.icon}
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
//                       <p className="text-gray-300">{feature.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <a href="/auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 justify-center">
//                   <Rocket className="w-4 h-4" />
//                   Start Building
//                 </a>
//                 <a href="/help" className="border border-gray-600 text-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-gray-500 hover:text-white transition-all flex items-center gap-2 justify-center">
//                   <FileText className="w-4 h-4" />
//                   View Docs
//                 </a>
//               </div>
//             </div>

//             <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
//               {/* Code Tabs */}
//               <div className="flex border-b border-gray-700 bg-gray-750">
//                 {Object.keys(codeExamples).map((lang) => (
//                   <button
//                     key={lang}
//                     onClick={() => setActiveTab(lang)}
//                     className={`px-6 py-3 text-sm font-medium transition-colors ${
//                       activeTab === lang 
//                         ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800' 
//                         : 'text-gray-400 hover:text-gray-300'
//                     }`}
//                   >
//                     {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'JavaScript' : 'Python'}
//                   </button>
//                 ))}
//               </div>

//               <div className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-green-400 text-sm font-mono">
//                     {activeTab === 'curl' ? '$ API Request' : `// ${activeTab} example`}
//                   </span>
//                   <button
//                     onClick={() => copyToClipboard(codeExamples[activeTab as keyof typeof codeExamples])}
//                     className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
//                   >
//                     {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
//                     {copied ? 'Copied!' : 'Copy'}
//                   </button>
//                 </div>
//                 <pre className="text-sm text-gray-300 overflow-x-auto leading-relaxed">
//                   <code>{codeExamples[activeTab as keyof typeof codeExamples]}</code>
//                 </pre>
//               </div>
//             </div>
//           </div>

//           <div className="mt-16 text-center">
//             <p className="text-gray-400 mb-6">Get started with just a few lines of code</p>
//             <div className="inline-flex items-center gap-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
//               <div className="text-sm">
//                 <span className="text-gray-400">1. Get API Key </span>
//                 <span className="text-blue-400">→</span>
//                 <span className="text-gray-400"> 2. Make Request </span>
//                 <span className="text-blue-400">→</span>
//                 <span className="text-gray-400"> 3. Track Results</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Live UI Preview */}
//       <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Activity className="w-4 h-4" />
//               Live Analytics
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//               Real-time analytics that matter
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               Get actionable insights into your email performance with our comprehensive analytics dashboard. 
//               See opens, clicks, and engagement data as it happens.
//             </p>
//           </div>

//           {/* Live Stats Grid */}
//           <div className="grid md:grid-cols-3 gap-8 mb-16">
//             {[
//               { 
//                 metric: "99.2%", 
//                 label: "Delivery Rate", 
//                 color: "text-green-600",
//                 icon: <CheckCircle className="w-6 h-6" />,
//                 trend: "+0.3%"
//               },
//               { 
//                 metric: "28.4%", 
//                 label: "Open Rate", 
//                 color: "text-blue-600",
//                 icon: <Eye className="w-6 h-6" />,
//                 trend: "+5.2%"
//               },
//               { 
//                 metric: "6.8%", 
//                 label: "Click Rate", 
//                 color: "text-purple-600",
//                 icon: <MousePointer className="w-6 h-6" />,
//                 trend: "+12.1%"
//               }
//             ].map((stat, index) => (
//               <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
//                 <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} mb-4 group-hover:scale-110 transition-transform`}>
//                   <div className={stat.color}>
//                     {stat.icon}
//                   </div>
//                 </div>
//                 <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.metric}</div>
//                 <div className="text-gray-600 font-medium mb-2">{stat.label}</div>
//                 <div className="text-green-600 text-sm font-medium">{stat.trend} this month</div>
//               </div>
//             ))}
//           </div>

//           {/* Interactive Dashboard Preview */}
//           <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
//             <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-gray-900">Email Campaign Analytics</h3>
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                 <span className="text-sm text-gray-600">Live</span>
//               </div>
//             </div>
//             <div className="p-8">
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaign Performance</h4>
//                   <div className="space-y-4">
//                     {[
//                       { name: "Welcome Series", sent: "1,247", opens: "356", clicks: "89", rate: "28.6%" },
//                       { name: "Product Launch", sent: "2,891", opens: "867", clicks: "234", rate: "30.0%" },
//                       { name: "Newsletter #47", sent: "5,432", opens: "1,234", clicks: "287", rate: "22.7%" }
//                     ].map((campaign, index) => (
//                       <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                         <div>
//                           <div className="font-medium text-gray-900">{campaign.name}</div>
//                           <div className="text-sm text-gray-600">{campaign.sent} sent • {campaign.opens} opens • {campaign.clicks} clicks</div>
//                         </div>
//                         <div className="text-lg font-bold text-blue-600">{campaign.rate}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="flex items-center justify-center">
//                   <div className="text-center">
//                     <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//                     <p className="text-gray-600 mb-4">Interactive Charts & Visualizations</p>
//                     <a href="/dashboard" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
//                       <Play className="w-4 h-4" />
//                       Explore Full Dashboard
//                       <ArrowRight className="w-4 h-4" />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="text-center mt-12">
//             <a href="/auth/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
//               <BarChart3 className="w-5 h-5" />
//               See Your Analytics
//               <ArrowRight className="w-5 h-5" />
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Pricing Section */}
//       <section id="pricing" className="py-24 bg-white px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Zap className="w-4 h-4" />
//               Simple Pricing
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//               Pay as you grow
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//               Start free and scale seamlessly. No hidden fees, no surprise charges. 
//               Transparent pricing that grows with your business.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
//             {[
//               {
//                 name: "Free",
//                 price: "$0",
//                 period: "forever",
//                 description: "Perfect for testing and small projects",
//                 features: [
//                   "1,000 emails/month",
//                   "Basic analytics & tracking",
//                   "REST API access",
//                   "Email support",
//                   "1 API key",
//                   "Basic templates"
//                 ],
//                 cta: "Start Free",
//                 popular: false,
//                 link: "/auth/register",
//                 highlight: "Always free"
//               },
//               {
//                 name: "Pro",
//                 price: "$29",
//                 period: "per month",
//                 description: "For growing businesses and startups",
//                 features: [
//                   "50,000 emails/month",
//                   "Advanced analytics & insights",
//                   "Priority support (24h response)",
//                   "Custom domains & DKIM",
//                   "Unlimited API keys",
//                   "Webhook notifications",
//                   "Advanced templates",
//                   "Campaign automation"
//                 ],
//                 cta: "Start 14-Day Trial",
//                 popular: true,
//                 link: "/auth/register",
//                 highlight: "Most popular"
//               },
//               {
//                 name: "Scale",
//                 price: "$99",
//                 period: "per month",
//                 description: "For high-volume senders and enterprises",
//                 features: [
//                   "500,000 emails/month",
//                   "Enterprise analytics & reporting",
//                   "24/7 phone support",
//                   "Dedicated IP address",
//                   "Advanced automation workflows",
//                   "Custom integrations",
//                   "White-label options",
//                   "SLA guarantee (99.9%)"
//                 ],
//                 cta: "Contact Sales",
//                 popular: false,
//                 link: "/contact",
//                 highlight: "Enterprise ready"
//               }
//             ].map((plan, index) => (
//               <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 border-2 ${plan.popular ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'} transition-all duration-300 hover:shadow-xl ${plan.popular ? 'transform scale-105' : 'hover:border-blue-300'}`}>
//                 {plan.popular && (
//                   <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                     <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
//                       {plan.highlight}
//                     </span>
//                   </div>
//                 )}
//                 {!plan.popular && plan.highlight && (
//                   <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//                     <span className="bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-xs font-medium">
//                       {plan.highlight}
//                     </span>
//                   </div>
//                 )}
                
//                 <div className="text-center mb-8">
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
//                   <div className="mb-4">
//                     <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
//                     {plan.price !== "$0" && <span className="text-gray-600 text-lg">/{plan.period.split(' ')[0]}</span>}
//                   </div>
//                   <p className="text-gray-600">{plan.description}</p>
//                 </div>

//                 <ul className="space-y-4 mb-8">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="flex items-start gap-3">
//                       <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
//                       <span className="text-gray-700">{feature}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 <a 
//                   href={plan.link}
//                   className={`block w-full py-4 rounded-xl font-semibold transition-all text-center transform hover:scale-105 ${
//                     plan.popular 
//                       ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
//                       : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
//                   }`}
//                 >
//                   {plan.cta}
//                 </a>

//                 {plan.name === "Pro" && (
//                   <p className="text-center text-sm text-gray-500 mt-3">
//                     No credit card required for trial
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>

//           {/* Pricing FAQ */}
//           <div className="mt-20 text-center">
//             <h3 className="text-2xl font-bold text-gray-900 mb-8">Need more emails?</h3>
//             <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//               <div className="p-6 bg-gray-50 rounded-xl">
//                 <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
//                 <h4 className="font-semibold text-gray-900 mb-2">No Contracts</h4>
//                 <p className="text-gray-600 text-sm">Change plans anytime. Cancel with one click.</p>
//               </div>
//               <div className="p-6 bg-gray-50 rounded-xl">
//                 <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
//                 <h4 className="font-semibold text-gray-900 mb-2">Volume Discounts</h4>
//                 <p className="text-gray-600 text-sm">Contact us for custom pricing on 1M+ emails.</p>
//               </div>
//               <div className="p-6 bg-gray-50 rounded-xl">
//                 <Shield className="w-8 h-8 text-purple-600 mx-auto mb-3" />
//                 <h4 className="font-semibold text-gray-900 mb-2">99.9% SLA</h4>
//                 <p className="text-gray-600 text-sm">Enterprise-grade reliability and uptime.</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-7xl mx-auto">
//           <div className="text-center mb-16">
//             <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
//               <Star className="w-4 h-4" />
//               Customer Love
//             </div>
//             <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
//               Loved by developers and marketers
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Join thousands of teams who trust EmailTracker for their email delivery needs.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {[
//               {
//                 quote: "EmailTracker's API integration was seamless. We migrated from Mailgun in under 2 hours and our delivery rates actually improved. The real-time tracking is a game-changer.",
//                 author: "Sarah Chen",
//                 role: "Lead Developer",
//                 company: "TechFlow",
//                 avatar: "SC",
//                 rating: 5,
//                 stats: "99.3% delivery rate"
//               },
//               {
//                 quote: "The analytics dashboard gives us insights we never had before. Our email performance has improved 40% since switching. Customer support is incredibly responsive too.",
//                 author: "Mike Rodriguez", 
//                 role: "Marketing Director",
//                 company: "GrowthLabs",
//                 avatar: "MR",
//                 rating: 5,
//                 stats: "40% improvement"
//               },
//               {
//                 quote: "Best email API we've used. Simple integration, excellent documentation, and the webhook system is reliable. Our entire team loves the developer experience.",
//                 author: "Lisa Wang",
//                 role: "CTO",
//                 company: "DataSync",
//                 avatar: "LW",
//                 rating: 5,
//                 stats: "2 hour migration"
//               }
//             ].map((testimonial, index) => (
//               <div key={index} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
//                 <div className="flex mb-4">
//                   {[...Array(testimonial.rating)].map((_, i) => (
//                     <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
//                   ))}
//                 </div>
//                 <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
//                     {testimonial.avatar}
//                   </div>
//                   <div>
//                     <div className="font-semibold text-gray-900">{testimonial.author}</div>
//                     <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
//                     <div className="text-blue-600 text-sm font-medium">{testimonial.stats}</div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="text-center mt-16">
//             <p className="text-gray-600 mb-6">Join 500+ companies already using EmailTracker</p>
//             <a href="/auth/register" className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg">
//               <Users className="w-5 h-5" />
//               Start Your Success Story
//               <ArrowRight className="w-5 h-5" />
//             </a>
//           </div>
//         </div>
//       </section>

//       {/* Final CTA */}
//       <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6">
//             Start sending emails in minutes
//           </h2>
//           <p className="text-xl mb-10 opacity-90 leading-relaxed">
//             Join thousands of developers who trust EmailTracker for reliable email delivery. 
//             Get started with our free plan and scale as you grow.
//           </p>
          
//           <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
//             <div className="relative flex-1 w-full">
//               <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="email"
//                 placeholder="Enter your work email"
//                 className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg placeholder-gray-500 border-0 focus:ring-4 focus:ring-blue-300 outline-none"
//               />
//             </div>
//             <a href="/auth/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap">
//               Start Free Trial
//             </a>
//           </div>
          
//           <div className="flex items-center justify-center gap-8 mt-8 text-sm opacity-75">
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4" />
//               <span>No credit card required</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4" />
//               <span>Free forever plan</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4" />
//               <span>Setup in 5 minutes</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           <div className="grid md:grid-cols-5 gap-8">
//             <div className="md:col-span-2">
//               <div className="flex items-center space-x-3 mb-6">
//                 <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
//                   <Mail className="w-6 h-6 text-white" />
//                 </div>
//                 <span className="text-2xl font-bold">EmailTracker</span>
//               </div>
//               <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
//                 The developer-friendly email API that actually works. Send, track, and analyze emails with ease.
//               </p>
//               <div className="flex items-center gap-4">
//                 <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
//                   <span className="text-sm font-bold">𝕏</span>
//                 </a>
//                 <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
//                   <span className="text-sm font-bold">GH</span>
//                 </a>
//                 <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors">
//                   <span className="text-sm font-bold">LI</span>
//                 </a>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Product</h4>
//               <ul className="space-y-3 text-gray-400">
//                 <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
//                 <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
//                 <li><a href="/help" className="hover:text-white transition-colors">API Docs</a></li>
//                 <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
//                 <li><a href="/integrations" className="hover:text-white transition-colors">Integrations</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Company</h4>
//               <ul className="space-y-3 text-gray-400">
//                 <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
//                 <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
//                 <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
//                 <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
//                 <li><a href="/press" className="hover:text-white transition-colors">Press Kit</a></li>
//               </ul>
//             </div>
            
//             <div>
//               <h4 className="font-semibold mb-4 text-lg">Resources</h4>
//               <ul className="space-y-3 text-gray-400">
//                 <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
//                 <li><a href="/status" className="hover:text-white transition-colors">Status Page</a></li>
//                 <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
//                 <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
//                 <li><a href="/security" className="hover:text-white transition-colors">Security</a></li>
//               </ul>
//             </div>
//           </div>
          
//           <div className="border-t border-gray-800 mt-12 pt-8">
//             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//               <p className="text-gray-400 text-sm">
//                 &copy; 2025 EmailTracker. All rights reserved.
//               </p>
//               <div className="flex items-center gap-6 text-sm text-gray-400">
//                 <span className="flex items-center gap-2">
//                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                   All systems operational
//                 </span>
//                 <span>SOC 2 Compliant</span>
//                 <span>GDPR Ready</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, Key, Users, FileText, Zap, CheckCircle, Star,
  ArrowRight, Play, Copy, Check, Menu, X, Rocket, Shield, Clock,
  Globe, TrendingUp, Code, Database, Activity, MousePointer, Eye, Send, Mail,
  Target, Briefcase, BookOpen, Monitor, Inbox
} from 'lucide-react';

// Custom Hook to detect when an element is in the viewport
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Unobserve after it's visible once to prevent re-triggering
        observer.unobserve(entry.target);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isVisible];
};


// Component for animated number count-up
const CountUp = ({ end, duration = 2, className, isVisible }) => {
  const [count, setCount] = useState(0);
  const animationFrameRef = useRef();

  const endValue = typeof end === 'string' ? parseFloat(end.replace(/[^0-9.]/g, '')) : end;
  const suffix = typeof end === 'string' ? end.replace(/[0-9.,]/g, '') : '';
  const isFloat = endValue % 1 !== 0;

  useEffect(() => {
    if (isVisible) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const currentVal = progress * endValue;
        
        if (isFloat) {
            setCount(parseFloat(currentVal.toFixed(1)));
        } else {
            setCount(Math.floor(currentVal));
        }

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(step);
        }
      };
      animationFrameRef.current = requestAnimationFrame(step);
    }
    return () => {
      if(animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVisible, endValue, duration, isFloat]);
  
  const formattedCount = count.toLocaleString('en-US', {
    minimumFractionDigits: isFloat ? 1 : 0,
    maximumFractionDigits: isFloat ? 1 : 0,
  });

  return <span className={className}>{formattedCount}{suffix}</span>;
};


// Wrapper for scroll-triggered animations
const AnimateOnScroll = ({ children, className = '', delay = 0 }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div 
            ref={ref} 
            className={`${className} transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

// SVG Logo Component for Mail Tantra
const MailTantraLogo = ({ className }) => {
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
            <g fill="none" stroke="url(#gradLogo)" strokeWidth="3" strokeLinecap="round">
                {/* Central envelope */}
                <path d="M35 40 L50 50 L65 40" strokeWidth="4"/>
                <rect x="35" y="40" width="30" height="20" rx="2" strokeWidth="4"/>

                {/* Mandala pattern */}
                <g transform="translate(50,50)">
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

// Animated version of the logo for the preloader
const AnimatedMailTantraLogo = ({ className }) => {
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
            <g fill="none" stroke="url(#gradLogo)" strokeWidth="3" strokeLinecap="round">
                <path className="draw-path" style={{animationDelay: '0s'}} d="M35 40 L50 50 L65 40" strokeWidth="4"/>
                <rect className="draw-path" style={{animationDelay: '0.2s'}} x="35" y="40" width="30" height="20" rx="2" strokeWidth="4"/>
                <g transform="translate(50,50)">
                    <circle className="draw-path" style={{animationDelay: '0.4s'}} cx="0" cy="0" r="35" strokeWidth="2" strokeOpacity="0.5"/>
                    <circle className="draw-path" style={{animationDelay: '0.6s'}} cx="0" cy="0" r="45" strokeWidth="2" strokeOpacity="0.3"/>
                    {angles1.map((angle, i) => (
                        <path key={angle} className="draw-path" style={{animationDelay: `${0.8 + i * 0.05}s`}} d="M0 25 L0 40" transform={`rotate(${angle})`} />
                    ))}
                    {angles2.map((angle, i) => (
                         <circle key={angle} className="draw-path" style={{animationDelay: `${1.2 + i * 0.05}s`}} cx="0" cy="40" r="3" transform={`rotate(${angle})`} strokeWidth="2"/>
                    ))}
                </g>
            </g>
        </svg>
    );
};


const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('curl');
  const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
  const [activeUseCaseTab, setActiveUseCaseTab] = useState('Developers');
  
  const [statsRef, areStatsVisible] = useOnScreen({ threshold: 0.5 });
  const [liveAnalyticsRef, areLiveAnalyticsVisible] = useOnScreen({ threshold: 0.5 });
  const [howItWorksRef, isHowItWorksVisible] = useOnScreen({ threshold: 0.5 });

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 2500); // Adjust time as needed
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    if (mobileMenuOpen) {
        setMobileMenuOpen(false);
    }
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const codeExamples = {
    curl: `curl -X POST "https://api.mailtantra.com/v1/send" \\
  -H "Authorization: Bearer mt_live_abc123..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "from": "hello@yourapp.com", 
    "subject": "Welcome aboard!",
    "html": "<h1>Welcome to our platform!</h1>",
    "track_opens": true,
    "track_clicks": true
  }'`,
    javascript: `import MailTantra from 'mailtantra';

const mt = new MailTantra('mt_live_abc123...');

await mt.send({
  to: 'user@example.com',
  from: 'hello@yourapp.com',
  subject: 'Welcome aboard!',
  html: '<h1>Welcome to our platform!</h1>',
  trackOpens: true,
  trackClicks: true
});`,
    python: `import mailtantra

mt = mailtantra.MailTantra('mt_live_abc123...')

mt.send(
  to='user@example.com',
  from_email='hello@yourapp.com',
  subject='Welcome aboard!',
  html='<h1>Welcome to our platform!</h1>',
  track_opens=True,
  track_clicks=True
)`
  };
  
  const stats = [
    { value: "99.9%", label: "Uptime", change: "+0.1%" },
    { value: "2.3ms", label: "Avg Response", change: "-15%" },
    { value: "150M+", label: "Emails Sent", change: "+45%" },
    { value: "500+", label: "Happy Customers", change: "+25%" }
  ];

  const companyLogos = [
    { name: 'TechFlow', svg: <path d="M13 3L4 14h9l-1 8 9-11h-9z" /> },
    { name: 'DataSync', svg: <><path d="M20.9 10.1a9 9 0 1 0-8.9 9.8" /><path d="M12 2v4" /><path d="m4.9 4.9 2.8 2.8" /></> },
    { name: 'CloudVault', svg: <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" /> },
    { name: 'NextGen AI', svg: <><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></> },
    { name: 'DevForge', svg: <><path d="m15 12-8.373 8.373a1 1 0 1 1-1.414-1.414L13.586 10.586" /><path d="m18 9-1.414-1.414A2 2 0 0 0 15.172 7l-1.95 1.95a2 2 0 0 0 0 2.828l2.828 2.828a2 2 0 0 0 2.828 0l1.95-1.95a2 2 0 0 0 .586-1.414Z" /></> },
    { name: 'ScaleUp', svg: <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /> },
  ];
  
  const useCases = {
    'Developers': {
        icon: <Code className="w-8 h-8 text-blue-600" />,
        title: "Build reliable email functionality, fast.",
        description: "Focus on your product, not on email infrastructure. Our robust API, clear documentation, and detailed webhooks make integrating transactional and notification emails a breeze.",
        features: [
            "REST API & SMTP",
            "Comprehensive SDKs",
            "Real-time Webhooks",
            "Sandbox for testing"
        ]
    },
    'Marketers': {
        icon: <Target className="w-8 h-8 text-pink-600" />,
        title: "Engage your audience and drive growth.",
        description: "Create, automate, and analyze your email campaigns with powerful tools. Get deep insights into your audience engagement and optimize for performance.",
        features: [
            "Visual Campaign Builder",
            "Advanced Segmentation",
            "A/B Testing",
            "Performance Analytics"
        ]
    },
    'Product Managers': {
        icon: <Briefcase className="w-8 h-8 text-purple-600" />,
        title: "Enhance user experience with timely communication.",
        description: "Ensure critical in-app notifications, password resets, and onboarding emails are delivered reliably. Monitor user engagement to understand and improve your product.",
        features: [
            "High Deliverability Rates",
            "User Engagement Tracking",
            "Template Management",
            "Scalable Infrastructure"
        ]
    }
  };


  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .draw-path {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: draw 1.5s ease-in-out forwards;
        }
        @keyframes draw {
            to {
                stroke-dashoffset: 0;
            }
        }
        .how-it-works-line {
            width: 100%;
            height: 2px;
            background-color: #e5e7eb; /* gray-200 */
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            z-index: 0;
        }
        .how-it-works-line::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 0;
            background: linear-gradient(to right, #3B82F6, #8B5CF6);
            transition: width 2s ease-out;
        }
        .is-visible .how-it-works-line::before {
            width: 100%;
        }
        .how-it-works-step {
            opacity: 0.5;
            transform: scale(0.9);
            transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .is-visible .how-it-works-step {
            opacity: 1;
            transform: scale(1);
        }
      `}</style>
      
      {/* Preloader */}
      <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <AnimatedMailTantraLogo className="w-24 h-24" />
      </div>

      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <a href="auth/register" className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2">
          <Rocket className="w-4 h-4" />
          Start Free
        </a>
      </div>

      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#" className="flex items-center space-x-3">
              <MailTantraLogo className="w-9 h-9" />
              <span className="text-xl font-bold text-gray-900">Mail Tantra</span>
            </a>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#solutions" onClick={(e) => handleNavClick(e, 'solutions')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Solutions</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Pricing</a>
              <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Blog</a>
              <a href="auth/login" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Sign In</a>
              <a href="auth/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 font-medium shadow-lg">
                Start Free
              </a>
            </div>

            <button 
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="block text-gray-600 font-medium py-2">Features</a>
              <a href="#solutions" onClick={(e) => handleNavClick(e, 'solutions')} className="block text-gray-600 font-medium py-2">Solutions</a>
              <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="block text-gray-600 font-medium py-2">Pricing</a>
              <a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="block text-gray-600 font-medium py-2">Blog</a>
              <div className="pt-2 border-t border-gray-100">
                <a href="auth/login" className="block text-gray-700 font-medium py-2">Sign In</a>
                <a href="auth/register" className="block bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium mt-2">
                  Start Free
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main>
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Trusted by 500+ companies worldwide
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Master Your Email Universe
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
                Unlock powerful sending, real-time tracking, and deep analytics with our developer-first API. The definitive email platform for modern applications.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <a href="auth/register" className="group bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-3 shadow-xl hover:shadow-2xl">
                  <Rocket className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#demo" onClick={(e) => handleNavClick(e, 'demo')} className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition-all flex items-center gap-3">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  View Live Demo
                </a>
              </div>

              <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      <CountUp end={stat.value} isVisible={areStatsVisible} />
                    </div>
                    <div className="text-gray-600 text-sm md:text-base">{stat.label}</div>
                    <div className="text-green-600 text-xs font-medium">{stat.change}</div>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={300}>
              <div className="relative max-w-6xl mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="flex items-center gap-2 p-4 bg-gray-50 border-b border-gray-200">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600 text-sm ml-4 font-mono">app.mailtantra.com</span>
                  </div>
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-[500px] flex items-center justify-center">
                      <div className="text-center max-w-md">
                      <div className="mb-6 relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                          <BarChart3 className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Live Analytics Dashboard</h3>
                      <p className="text-gray-600 mb-6">Real-time email tracking and performance metrics</p>
                      <a href="#demo" onClick={(e) => handleNavClick(e, 'demo')} className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                          <Play className="w-4 h-4" />
                          View Live Dashboard
                          <ArrowRight className="w-4 h-4" />
                      </a>
                      </div>
                  </div>
                  </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <section className="py-16 bg-white border-t border-gray-100 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-600 mb-12 font-medium">Trusted by the world's most innovative companies</p>
            <div className="relative flex overflow-hidden group">
              <div className="flex animate-scroll group-hover:[animation-play-state:paused] whitespace-nowrap">
                {[...companyLogos, ...companyLogos].map((company, index) => (
                  <div key={index} className="flex items-center justify-center w-64 mx-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-gray-400 mr-3">
                      {company.svg}
                    </svg>
                    <span className="text-xl font-semibold text-gray-500">{company.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <AnimateOnScroll className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">A simple, reliable flow</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        From your application to your user's inbox in milliseconds, with every step tracked.
                    </p>
                </AnimateOnScroll>
                <div ref={howItWorksRef} className={`relative ${isHowItWorksVisible ? 'is-visible' : ''}`}>
                    <div className="hidden md:block how-it-works-line"></div>
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0">
                        {[
                            { icon: <Monitor className="w-10 h-10 text-blue-600"/>, title: "Your App", description: "An event triggers an email send request." },
                            { icon: <Send className="w-10 h-10 text-purple-600"/>, title: "API Call", description: "A single, simple API call to Mail Tantra." },
                            { icon: <MailTantraLogo className="w-12 h-12"/>, title: "Mail Tantra", description: "We process, optimize, and deliver the email." },
                            { icon: <Inbox className="w-10 h-10 text-green-600"/>, title: "User's Inbox", description: "The email lands reliably in the inbox." },
                            { icon: <BarChart3 className="w-10 h-10 text-pink-600"/>, title: "Analytics", description: "Track opens, clicks, and more in real-time." },
                        ].map((step, index) => (
                            <div key={index} className="how-it-works-step flex-1 text-center flex flex-col items-center" style={{transitionDelay: `${index * 300}ms`}}>
                                <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100 mb-4 z-10">
                                    {step.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                                <p className="text-sm text-gray-600 max-w-xs px-2">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Powerful Features
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Everything you need to scale email delivery
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                From transactional emails to marketing campaigns, our platform handles it all with enterprise-grade reliability and a developer-first experience.
              </p>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Send className="w-8 h-8 text-blue-600" />, title: "Email API", description: "Send emails via REST API or SMTP. High deliverability rates with real-time status updates and automatic retry logic.", features: ["REST & SMTP support", "Delivery guarantees", "Automatic retries"] },
                { icon: <Activity className="w-8 h-8 text-green-600" />, title: "Real-Time Tracking", description: "Track opens, clicks, bounces, and complaints in real-time. Get detailed analytics for every email sent.", features: ["Open tracking", "Click tracking", "Bounce detection"] },
                { icon: <Key className="w-8 h-8 text-purple-600" />, title: "API Key Management", description: "Create and manage multiple API keys with custom rate limits, permissions, and usage monitoring per project.", features: ["Multiple keys", "Rate limiting", "Usage analytics"] },
                { icon: <Code className="w-8 h-8 text-orange-600" />, title: "Developer Docs", description: "Comprehensive documentation with live examples, SDKs for popular languages, and interactive API explorer.", features: ["Live examples", "Multiple SDKs", "API explorer"] },
                { icon: <BarChart3 className="w-8 h-8 text-red-600" />, title: "Analytics Dashboard", description: "Beautiful dashboard with campaign metrics, delivery rates, and performance insights with exportable reports.", features: ["Campaign metrics", "Performance insights", "Export reports"] },
                { icon: <Users className="w-8 h-8 text-indigo-600" />, title: "Campaign Builder", description: "Create, schedule, and automate email campaigns with our visual builder and template system.", features: ["Visual builder", "Automation", "Template system"] }
              ].map((feature, index) => (
                  <AnimateOnScroll key={index} delay={index * 100}>
                      <div className="group h-full bg-gray-50/50 p-8 rounded-2xl hover:bg-white transition-all duration-300 border border-gray-100 hover:shadow-xl transform hover:-translate-y-1">
                          <div className="mb-6 p-3 bg-white rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          {feature.icon}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                          <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                          <ul className="space-y-2">
                          {feature.features.map((feat, featIndex) => (
                              <li key={featIndex} className="flex items-center gap-3 text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feat}</span>
                              </li>
                          ))}
                          </ul>
                      </div>
                  </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section id="solutions" className="py-24 bg-gray-50 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
              <AnimateOnScroll className="text-center mb-16">
                  <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Briefcase className="w-4 h-4" />
                      Solutions for Your Role
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                      Built for every member of your team
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                      Mail Tantra provides the tools and insights needed for developers, marketers, and product managers to succeed.
                  </p>
              </AnimateOnScroll>

              <div className="max-w-4xl mx-auto">
                  <div className="flex justify-center border-b border-gray-200 mb-8">
                      {Object.keys(useCases).map(role => (
                          <button 
                              key={role}
                              onClick={() => setActiveUseCaseTab(role)}
                              className={`px-4 sm:px-6 py-3 text-base font-semibold transition-all duration-300 border-b-2 ${activeUseCaseTab === role ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                          >
                              {role}
                          </button>
                      ))}
                  </div>

                  <AnimateOnScroll>
                      <div className="bg-white p-8 sm:p-12 rounded-2xl border border-gray-100 shadow-lg">
                          <div className="flex flex-col md:flex-row items-center gap-8">
                              <div className="flex-shrink-0 p-4 bg-gray-50 rounded-xl shadow-inner">
                                  {useCases[activeUseCaseTab].icon}
                              </div>
                              <div className="text-center md:text-left">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{useCases[activeUseCaseTab].title}</h3>
                                  <p className="text-gray-600 leading-relaxed mb-6">{useCases[activeUseCaseTab].description}</p>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                      {useCases[activeUseCaseTab].features.map(feature => (
                                          <li key={feature} className="flex items-center gap-3 text-gray-700">
                                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                              <span>{feature}</span>
                                          </li>
                                      ))}
                                  </ul>
                              </div>
                          </div>
                      </div>
                  </AnimateOnScroll>
              </div>
          </div>
        </section>

        <section id="docs" className="py-24 bg-gray-900 text-white overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateOnScroll className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Code className="w-4 h-4" />
                Developer First
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for developers, by developers
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Simple, well-documented API that gets you sending emails in minutes. 
                Comprehensive SDKs for all major programming languages.
              </p>
            </AnimateOnScroll>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <AnimateOnScroll>
                  <div className="space-y-6 mb-8">
                      {[
                      { icon: <Globe className="w-6 h-6 text-blue-400" />, title: "RESTful API", description: "Clean, consistent API design with detailed documentation" },
                      { icon: <Database className="w-6 h-6 text-green-400" />, title: "Multiple SDKs", description: "Native libraries for Python, Node.js, PHP, Go, and more" },
                      { icon: <Activity className="w-6 h-6 text-purple-400" />, title: "Webhook Support", description: "Real-time events for deliveries, opens, clicks, and bounces" },
                      { icon: <Shield className="w-6 h-6 text-orange-400" />, title: "Enterprise Security", description: "OAuth, rate limiting, and comprehensive error handling" }
                      ].map((feature, index) => (
                      <div key={index} className="flex items-start gap-4">
                          <div className="p-2 bg-gray-800 rounded-lg">
                          {feature.icon}
                          </div>
                          <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                          <p className="text-gray-300">{feature.description}</p>
                          </div>
                      </div>
                      ))}
                  </div>
              </AnimateOnScroll>

              <AnimateOnScroll delay={200}>
                  <div className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                      <div className="flex border-b border-gray-700 bg-gray-750">
                          {Object.keys(codeExamples).map((lang) => (
                          <button
                              key={lang}
                              onClick={() => setActiveTab(lang)}
                              className={`px-6 py-3 text-sm font-medium transition-colors ${
                              activeTab === lang 
                                  ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800' 
                                  : 'text-gray-400 hover:text-gray-300'
                              }`}
                          >
                              {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </button>
                          ))}
                      </div>

                      <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                          <span className="text-green-400 text-sm font-mono">
                              {activeTab === 'curl' ? '$ API Request' : `// ${activeTab} example`}
                          </span>
                          <button
                              onClick={() => copyToClipboard(codeExamples[activeTab])}
                              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                          >
                              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                              {copied ? 'Copied!' : 'Copy'}
                          </button>
                          </div>
                          <pre className="text-sm text-gray-300 overflow-x-auto leading-relaxed">
                          <code>{codeExamples[activeTab]}</code>
                          </pre>
                      </div>
                  </div>
              </AnimateOnScroll>
            </div>
          </div>
        </section>

        <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-purple-50 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Activity className="w-4 h-4" />
                Live Analytics
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Real-time analytics that matter
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Get actionable insights into your email performance. See opens, clicks, and engagement data as it happens.
              </p>
            </AnimateOnScroll>

            <div ref={liveAnalyticsRef} className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { metric: "99.2%", label: "Delivery Rate", color: "text-green-600", icon: <CheckCircle className="w-6 h-6" />, trend: "+0.3%" },
                { metric: "28.4%", label: "Open Rate", color: "text-blue-600", icon: <Eye className="w-6 h-6" />, trend: "+5.2%" },
                { metric: "6.8%", label: "Click Rate", color: "text-purple-600", icon: <MousePointer className="w-6 h-6" />, trend: "+12.1%" }
              ].map((stat, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color.replace('text-', 'bg-').replace('-600', '-100')} mb-4 group-hover:scale-110 transition-transform`}>
                      <div className={stat.color}>{stat.icon}</div>
                      </div>
                      <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                          <CountUp end={stat.metric} isVisible={areLiveAnalyticsVisible} />
                      </div>
                      <div className="text-gray-600 font-medium mb-2">{stat.label}</div>
                      <div className="text-green-600 text-sm font-medium">{stat.trend} this month</div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>

            <AnimateOnScroll>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold text-gray-900">Campaign Performance</h3>
                  <div className="flex items-center gap-1 bg-gray-200 p-1 rounded-lg">
                      <button onClick={() => setAnalyticsPeriod('7d')} className={`px-3 py-1 text-sm rounded-md transition-colors ${analyticsPeriod === '7d' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>7 days</button>
                      <button onClick={() => setAnalyticsPeriod('30d')} className={`px-3 py-1 text-sm rounded-md transition-colors ${analyticsPeriod === '30d' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>30 days</button>
                      <button onClick={() => setAnalyticsPeriod('90d')} className={`px-3 py-1 text-sm rounded-md transition-colors ${analyticsPeriod === '90d' ? 'bg-white shadow' : 'hover:bg-gray-300'}`}>90 days</button>
                  </div>
                  </div>
                  <div className="p-8">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                          <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaign Performance</h4>
                              <div className="space-y-4">
                                  {[
                                  { name: "Welcome Series", sent: "1,247", opens: "356", clicks: "89", rate: "28.6%" },
                                  { name: "Product Launch", sent: "2,891", opens: "867", clicks: "234", rate: "30.0%" },
                                  { name: "Newsletter #47", sent: "5,432", opens: "1,234", clicks: "287", rate: "22.7%" }
                                  ].map((campaign, index) => (
                                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                      <div>
                                      <div className="font-medium text-gray-900">{campaign.name}</div>
                                      <div className="text-sm text-gray-600">{campaign.sent} sent • {campaign.opens} opens • {campaign.clicks} clicks</div>
                                      </div>
                                      <div className="text-lg font-bold text-blue-600">{campaign.rate}</div>
                                  </div>
                                  ))}
                              </div>
                          </div>
                          <div className="flex items-end justify-around h-64 p-4 bg-gray-50 rounded-xl">
                              {[
                                  {day: 'Mon', value: analyticsPeriod === '7d' ? 65 : 75},
                                  {day: 'Tue', value: analyticsPeriod === '7d' ? 59 : 65},
                                  {day: 'Wed', value: analyticsPeriod === '7d' ? 80 : 90},
                                  {day: 'Thu', value: analyticsPeriod === '7d' ? 81 : 70},
                                  {day: 'Fri', value: analyticsPeriod === '7d' ? 56 : 85},
                                  {day: 'Sat', value: analyticsPeriod === '7d' ? 55 : 60},
                                  {day: 'Sun', value: analyticsPeriod === '7d' ? 40 : 50},
                              ].map(item => (
                                  <div key={item.day} className="flex flex-col items-center gap-2">
                                      <div className="w-8 bg-blue-200 rounded-t-lg hover:bg-blue-400 transition-all" style={{height: `${item.value}%`}}></div>
                                      <span className="text-xs font-medium text-gray-600">{item.day}</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
            </AnimateOnScroll>
          </div>
        </section>

        <section id="pricing" className="py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Simple Pricing
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pay as you grow
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Start free and scale seamlessly. No hidden fees, no surprise charges. 
                Transparent pricing that grows with your business.
              </p>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { name: "Free", price: "$0", period: "forever", description: "Perfect for testing and small projects", features: ["1,000 emails/month", "Basic analytics & tracking", "REST API access", "Email support", "1 API key"], cta: "Start Free", popular: false },
                { name: "Pro", price: "$29", period: "per month", description: "For growing businesses and startups", features: ["50,000 emails/month", "Advanced analytics & insights", "Priority support (24h response)", "Custom domains & DKIM", "Unlimited API keys", "Webhook notifications"], cta: "Start 14-Day Trial", popular: true },
                { name: "Scale", price: "$99", period: "per month", description: "For high-volume senders and enterprises", features: ["500,000 emails/month", "Enterprise analytics & reporting", "24/7 phone support", "Dedicated IP address", "Advanced automation workflows", "SLA guarantee (99.9%)"], cta: "Contact Sales", popular: false }
              ].map((plan, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className={`relative h-full flex flex-col bg-white rounded-2xl shadow-lg p-8 border-2 ${plan.popular ? 'border-blue-500 shadow-blue-100' : 'border-gray-200'} transition-all duration-300 hover:shadow-xl ${plan.popular ? 'transform md:scale-105' : 'hover:border-blue-300'}`}>
                      {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                          Most Popular
                          </span>
                      </div>
                      )}
                      
                      <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <div className="mb-4">
                          <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                          {plan.price !== "$0" && <span className="text-gray-600 text-lg">/mo</span>}
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                          </li>
                      ))}
                      </ul>

                      <a 
                      href={plan.cta === 'Start Free' || plan.cta === 'Start 14-Day Trial' ? 'auth/register' : '/contact'}
                      className={`block w-full mt-auto py-4 rounded-xl font-semibold transition-all text-center transform hover:scale-105 ${
                          plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl' 
                          : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                      }`}
                      >
                      {plan.cta}
                      </a>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <AnimateOnScroll className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4" />
                Customer Love
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Loved by developers and marketers
              </h2>
            </AnimateOnScroll>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "Mail Tantra's API integration was seamless. We were sending emails in under an hour, and our delivery rates have never been better. The real-time tracking is a game-changer.", author: "Sarah Chen", role: "Lead Developer, TechFlow", avatar: "https://i.pravatar.cc/100?u=a042581f4e29026704d" },
                { quote: "The analytics dashboard gives us insights we never had before. Our email performance has improved 40% since switching. Customer support is incredibly responsive too.", author: "Mike Rodriguez", role: "Marketing Director, GrowthLabs", avatar: "https://i.pravatar.cc/100?u=a042581f4e29026705d" },
                { quote: "Best email API we've used. Simple integration, excellent documentation, and the webhook system is reliable. Our entire team loves the developer experience.", author: "Lisa Wang", role: "CTO, DataSync", avatar: "https://i.pravatar.cc/100?u=a042581f4e29026706d" }
              ].map((testimonial, index) => (
                <AnimateOnScroll key={index} delay={index * 100}>
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                      </div>
                      <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                      <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800 mb-6">Read Case Study →</a>
                      <div className="flex items-center gap-4 mt-auto">
                      <img src={testimonial.avatar} alt={testimonial.author} className="w-12 h-12 rounded-full" />
                      <div>
                          <div className="font-semibold text-gray-900">{testimonial.author}</div>
                          <div className="text-gray-600 text-sm">{testimonial.role}</div>
                      </div>
                      </div>
                  </div>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="py-24 bg-white px-4 sm:px-6 lg:px-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
                <AnimateOnScroll className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        From Our Blog
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Insights on email and growth
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Explore our latest articles on email deliverability, marketing best practices, and product development.
                    </p>
                </AnimateOnScroll>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: "5 Ways to Improve Your Email Deliverability Today", category: "Deliverability", image: "https://placehold.co/600x400/DBEAFE/1E3A8A?text=Insights", excerpt: "Don't let your emails land in spam. Here are five actionable tips to boost your inbox placement rate." },
                        { title: "The Ultimate Guide to Transactional Email Design", category: "Design", image: "https://placehold.co/600x400/E0E7FF/312E81?text=Guides", excerpt: "Learn how to design beautiful and effective transactional emails that your users will love." },
                        { title: "How to Use Webhooks for Real-Time Email Tracking", category: "Developers", image: "https://placehold.co/600x400/D1FAE5/064E3B?text=Code", excerpt: "A technical deep-dive into setting up webhooks to get instant notifications for email events." },
                    ].map((post, index) => (
                        <AnimateOnScroll key={index} delay={index * 100}>
                            <div className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                                <div className="p-6">
                                    <span className="text-sm font-semibold text-blue-600 mb-2 inline-block">{post.category}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
                                    <a href="#" className="font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">Read More <ArrowRight className="inline w-4 h-4 group-hover:translate-x-1 transition-transform"/></a>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    ))}
                </div>
            </div>
        </section>

        <section id="cta" className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start sending emails in minutes
            </h2>
            <p className="text-xl mb-10 opacity-90 leading-relaxed">
              Join thousands of developers who trust Mail Tantra for reliable email delivery. 
              Get started with our free plan and scale as you grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your work email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 text-lg placeholder-gray-500 border-0 focus:ring-4 focus:ring-blue-300 outline-none"
                />
              </div>
              <a href="auth/register" className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap w-full sm:w-auto">
                Start Free Trial
              </a>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                 <MailTantraLogo className="w-10 h-10" />
                <span className="text-2xl font-bold">Mail Tantra</span>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-sm">
                The definitive email API for modern applications. Send, track, and analyze with unparalleled reliability and insight.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#solutions" onClick={(e) => handleNavClick(e, 'solutions')} className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#docs" onClick={(e) => handleNavClick(e, 'docs')} className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#demo" onClick={(e) => handleNavClick(e, 'demo')} className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#blog" onClick={(e) => handleNavClick(e, 'blog')} className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-lg">Resources</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Page</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                &copy; 2025 Mail Tantra. All rights reserved.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  All systems operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;



