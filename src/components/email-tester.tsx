'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useSendEmail } from '@/hooks/use-emailtracker';

export default function EmailTester() {
  const [formData, setFormData] = useState({
    to_email: '',
    from_email: 'mgtechno0001@gmail.com',
    from_name: 'EmailTracker Dashboard',
    subject: 'Test Email from Dashboard',
    html_content: '<h1>Hello from EmailTracker!</h1><p>This is a test email sent from the dashboard.</p>',
    text_content: 'Hello from EmailTracker! This is a test email sent from the dashboard.',
  });
  
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const { sendEmail, sending, error } = useSendEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendEmail(formData);
      setResult(response);
    } catch (err) {
      console.error('Send failed:', err);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Email Tester</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="to_email">To Email</Label>
              <Input
                id="to_email"
                type="email"
                value={formData.to_email}
                onChange={(e) => handleInputChange('to_email', e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="from_email">From Email</Label>
              <Input
                id="from_email"
                type="email"
                value={formData.from_email}
                onChange={(e) => handleInputChange('from_email', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="html_content">HTML Content</Label>
            <Textarea
              id="html_content"
              value={formData.html_content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('html_content', e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="text_content">Text Content</Label>
            <Textarea
              id="text_content"
              value={formData.text_content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('text_content', e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={sending} className="w-full">
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Test Email
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {result && (
            <div className="flex items-start space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium">Email sent successfully!</div>
                <div className="mt-1 space-y-1">
                  <div>Tracker ID: <Badge variant="outline">{String(result.tracker_id || 'N/A')}</Badge></div>
                  <div>Campaign ID: <Badge variant="outline">{String(result.campaign_id || 'N/A')}</Badge></div>
                  <div>Status: <Badge variant="outline">{String(result.status || 'N/A')}</Badge></div>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
