# EmailTracker Dashboard

A professional Next.js dashboard frontend for the EmailTracker microservice. This dashboard provides a comprehensive interface for managing email campaigns, analytics, API keys, and other EmailTracker features.

## 🚀 Features

- **Dashboard Overview** - Real-time metrics and analytics
- **API Key Management** - Create, view, and manage API keys
- **Email Campaign Management** - Create, send, and track email campaigns
- **Analytics Dashboard** - Detailed email performance analytics
- **Contact Management** - Manage contact lists and segments
- **Settings Panel** - Configure SMTP and other settings

## 🏗️ Tech Stack

- **Frontend**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Icons**: Lucide React
- **Backend Integration**: EmailTracker API (localhost:8001)

## 📋 Prerequisites

- Node.js 18.x or higher
- EmailTracker backend service running on localhost:8001
- Valid EmailTracker API key

## 🔧 Installation

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env.local` file with:
```bash
NEXT_PUBLIC_EMAILTRACKER_API_URL=http://localhost:8001
NEXT_PUBLIC_EMAILTRACKER_API_KEY=your_api_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Integration

The dashboard connects to your EmailTracker backend service running on port 8001. Make sure you have:

1. **EmailTracker service running** on `localhost:8001`
2. **Valid API key** configured in environment variables
3. **CORS properly configured** in EmailTracker for localhost:3000

## 🎨 UI Components

This project uses Shadcn/ui component library built on top of:
- Radix UI primitives
- Tailwind CSS
- Class Variance Authority (CVA)

## 📊 Dashboard Sections

### Overview Dashboard
- Email sending statistics
- Open and click rates
- Contact metrics
- API key status

### Quick Actions
- Send new email campaigns
- Manage API keys
- Import contacts
- View detailed analytics

### Recent Activity
- Latest campaign activities
- API key usage
- Contact imports

## 🚀 Building for Production

```bash
npm run build
npm start
```

## 🧪 Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   └── ui/             # Shadcn/ui components
├── lib/                # Utility functions
└── styles/             # Global styles
```

## 🔗 Backend Integration

The dashboard integrates with EmailTracker API endpoints:

- `GET /api/v1/emails/trackers` - Email tracking data
- `POST /api/v1/emails/send` - Send emails
- `GET /api/v1/analytics/*` - Analytics data
- `POST /api/v1/auth/api-keys` - API key management

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_EMAILTRACKER_API_URL` | EmailTracker API base URL | `http://localhost:8001` |
| `NEXT_PUBLIC_EMAILTRACKER_API_KEY` | API key for authentication | - |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

This project is part of the EmailTracker ecosystem.

---

**Note**: This dashboard is designed to work with the EmailTracker backend service. Make sure you have the EmailTracker service running and properly configured before using this dashboard.
