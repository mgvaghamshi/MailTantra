// Demo template data for development
export const demoTemplates = [
  {
    id: 'template-1',
    name: 'Welcome Email',
    subject: 'Welcome to our platform!',
    description: 'A warm welcome email for new users',
    type: 'welcome' as const,
    status: 'published' as const,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Welcome to our platform!</h1>
        <p>We're excited to have you on board. Here's what you can expect:</p>
        <ul>
          <li>Access to premium features</li>
          <li>24/7 customer support</li>
          <li>Regular updates and improvements</li>
        </ul>
        <p>Get started by exploring your dashboard.</p>
        <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Started</a>
      </div>
    `,
    text_content: 'Welcome to our platform! We\'re excited to have you on board.',
    api_key_id: '',
    usage_count: 12,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: 'template-2',
    name: 'Newsletter Template',
    subject: 'Your monthly newsletter',
    description: 'Professional newsletter template with sections for news and updates',
    type: 'newsletter' as const,
    status: 'published' as const,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <header style="background: #f8fafc; padding: 20px; text-align: center;">
          <h1 style="color: #1e293b;">Monthly Newsletter</h1>
          <p style="color: #64748b;">Stay updated with our latest news</p>
        </header>
        <div style="padding: 20px;">
          <h2 style="color: #2563eb;">This Month's Highlights</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          
          <h3>Product Updates</h3>
          <p>We've added several new features to improve your experience.</p>
          
          <h3>Company News</h3>
          <p>Read about our latest achievements and milestones.</p>
        </div>
      </div>
    `,
    text_content: 'Monthly Newsletter - Stay updated with our latest news and product updates.',
    api_key_id: '',
    usage_count: 8,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z'
  },
  {
    id: 'template-3',
    name: 'Product Announcement',
    subject: 'Introducing our new product!',
    description: 'Template for announcing new products or features',
    type: 'promotional' as const,
    status: 'published' as const,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1>🚀 New Product Launch!</h1>
          <p style="font-size: 18px;">We're excited to introduce our latest innovation</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #2563eb;">What's New?</h2>
          <p>Our new product brings cutting-edge features to help you achieve more.</p>
          
          <div style="background: #f1f5f9; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Key Features:</h3>
            <ul>
              <li>Advanced analytics</li>
              <li>Real-time collaboration</li>
              <li>Enhanced security</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Learn More</a>
          </div>
        </div>
      </div>
    `,
    text_content: 'New Product Launch! We\'re excited to introduce our latest innovation with advanced features.',
    api_key_id: '',
    usage_count: 15,
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z'
  },
  {
    id: 'template-4',
    name: 'Event Invitation',
    subject: 'You\'re invited to our exclusive event',
    description: 'Professional event invitation template',
    type: 'transactional' as const,
    status: 'published' as const,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e293b; color: white; padding: 30px; text-align: center;">
          <h1>🎉 You're Invited!</h1>
          <p style="font-size: 18px;">Join us for an exclusive event</p>
        </div>
        <div style="padding: 20px;">
          <h2 style="color: #2563eb;">Event Details</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <p><strong>Date:</strong> March 15, 2024</p>
            <p><strong>Time:</strong> 6:00 PM - 9:00 PM</p>
            <p><strong>Location:</strong> Downtown Conference Center</p>
            <p><strong>Dress Code:</strong> Business Casual</p>
          </div>
          
          <p>This exclusive event will feature networking opportunities, product demonstrations, and insights from industry leaders.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">RSVP Now</a>
          </div>
        </div>
      </div>
    `,
    text_content: 'You\'re invited to our exclusive event on March 15, 2024. RSVP now to secure your spot.',
    api_key_id: '',
    usage_count: 6,
    created_at: '2024-01-30T10:00:00Z',
    updated_at: '2024-01-30T10:00:00Z'
  }
];

export const shouldUseDemoTemplates = (templates: any[] | null | undefined): boolean => {
  return !templates || templates.length === 0;
};
