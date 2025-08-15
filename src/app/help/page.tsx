import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Search, 
  Book, 
  MessageCircle, 
  Mail,
  Video,
  FileText,
  ExternalLink,
  Phone,
  Clock
} from "lucide-react";

interface HelpArticle {
  id: string;
  title: string;
  category: "getting-started" | "api" | "troubleshooting" | "billing";
  readTime: string;
  popular: boolean;
}

const helpArticles: HelpArticle[] = [
  {
    id: "1",
    title: "Getting Started with EmailTracker",
    category: "getting-started",
    readTime: "5 min",
    popular: true
  },
  {
    id: "2",
    title: "Setting Up SMTP Configuration",
    category: "getting-started",
    readTime: "8 min",
    popular: true
  },
  {
    id: "3",
    title: "API Authentication & Keys",
    category: "api",
    readTime: "10 min",
    popular: true
  },
  {
    id: "4",
    title: "Creating Your First Campaign",
    category: "getting-started",
    readTime: "12 min",
    popular: false
  },
  {
    id: "5",
    title: "Troubleshooting Email Delivery",
    category: "troubleshooting",
    readTime: "15 min",
    popular: true
  },
  {
    id: "6",
    title: "Understanding Analytics & Metrics",
    category: "getting-started",
    readTime: "7 min",
    popular: false
  }
];

function getCategoryColor(category: string) {
  switch (category) {
    case "getting-started":
      return "bg-green-100 text-green-800";
    case "api":
      return "bg-blue-100 text-blue-800";
    case "troubleshooting":
      return "bg-red-100 text-red-800";
    case "billing":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default function HelpPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <HelpCircle className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help you?</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions, explore our documentation, or get in touch with our support team.
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search help articles, guides, and documentation..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Complete guides and API reference
              </p>
              <Button variant="outline" className="w-full">
                Browse Docs
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600 mb-4">
                Step-by-step video guides
              </p>
              <Button variant="outline" className="w-full">
                Watch Videos
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Live Support</h3>
              <p className="text-sm text-gray-600 mb-4">
                Chat with our support team
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>
              Most frequently accessed help topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {helpArticles.filter(article => article.popular).map((article) => (
                <div key={article.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{article.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className={getCategoryColor(article.category)}>
                          {article.category.replace("-", " ")}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Need personalized help? Get in touch with our team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-medium">Live Chat</h4>
                  <p className="text-sm text-gray-600">Available 24/7</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Start Chat
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium">Email Support</h4>
                  <p className="text-sm text-gray-600">Response within 4 hours</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <h4 className="font-medium">Phone Support</h4>
                  <p className="text-sm text-gray-600">Enterprise customers only</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                question: "How do I set up my first email campaign?",
                answer: "Navigate to the Campaigns page and click 'New Campaign'. Follow the step-by-step wizard to configure your email content, recipients, and delivery settings."
              },
              {
                question: "What SMTP settings should I use?",
                answer: "You can use any SMTP provider like Gmail, SendGrid, or Mailgun. Check our SMTP configuration guide for detailed setup instructions for popular providers."
              },
              {
                question: "How do I track email opens and clicks?",
                answer: "Email tracking is automatically enabled for all campaigns. View real-time analytics in the Analytics dashboard to see open rates, click rates, and other engagement metrics."
              },
              {
                question: "Can I import my existing contact list?",
                answer: "Yes! Go to the Contacts page and use the Import feature to upload your contacts via CSV file. We support standard contact formats and will validate email addresses during import."
              },
              {
                question: "What are the API rate limits?",
                answer: "Free plans include 1,000 requests per hour. Paid plans offer higher limits starting at 10,000 requests per hour. Check the API Keys page for your current usage and limits."
              }
            ].map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
