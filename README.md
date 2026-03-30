# JobLinkr - AI-Powered Job Matching Platform

## Features

### 🎯 Resume Analyzer
- **AI-Powered Analysis**: Upload your resume (PDF) and get instant AI-powered insights
- **Job Description Matching**: Paste a job description to get tailored optimization suggestions
- **Skills Extraction**: Automatically identifies your key skills and competencies
- **Match Scoring**: Get a match score when comparing against specific job descriptions
- **Personalized Recommendations**: Receive actionable tips to improve your resume

### 🤖 AI Matcher
- **Smart Job Matching**: Swipe-based interface to find jobs that match your profile
- **Real-time Market Search**: Searches live job market using the Arbeitnow API
- **AI Scoring**: Each job is scored against your resume using Google's Gemini AI
- **Hireability Insights**: Get specific advice on how to increase your chances

### 📋 Browse Jobs
- **Advanced Filtering**: Filter by experience level, job type, and location
- **Live Updates**: Auto-refreshes every 2 minutes with new opportunities
- **Detailed Job Views**: Comprehensive job descriptions with application links

## Setup & Configuration

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Google Gemini API Key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kavishkh/JobLinkr.git
cd JobLinkr
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
JobLinkr/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── analyze-resume/  # Resume analysis endpoint
│   │   ├── applications/    # Application tracking
│   │   └── jobs/           # Job search and scoring
│   ├── jobs/              # Jobs browsing page
│   ├── matcher/           # AI Matcher page
│   ├── profile/           # User profile pages
│   │   └── analyzer/      # Resume analyzer page
│   └── employer/          # Employer dashboard
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── job-card.tsx      # Job card component
│   ├── navbar.tsx        # Navigation bar
│   └── sidebar.tsx       # Sidebar navigation
├── lib/                   # Utility functions
│   ├── gemini.ts         # Google Gemini AI integration
│   ├── resume-parser.ts  # PDF parsing utilities
│   └── matcher.ts        # Job matching logic
└── hooks/                # Custom React hooks
```

## API Integration

### External APIs
- **Arbeitnow API**: Real-time job market data
- **Google Gemini AI**: Resume analysis and job scoring

### Rate Limiting
The application respects API rate limits:
- Arbeitnow: 15 requests per minute (free tier)
- Gemini: Automatic fallback if primary model unavailable

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean build cache (Windows PowerShell)

## Tech Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **AI**: Google Generative AI (Gemini)
- **PDF Parsing**: pdf-parse
- **State Management**: React Hooks
- **Toast Notifications**: Sonner

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |

Get your API key from: https://makersuite.google.com/app/apikey

## Key Features Implementation

### Resume Analyzer
Located at `/profile/analyzer`, this feature:
1. Parses uploaded PDF resumes
2. Extracts skills and keywords using AI
3. Compares against job descriptions (if provided)
4. Provides match scores and improvement recommendations

### AI Matcher
Located at `/matcher`, this feature:
1. Analyzes your resume to understand your profile
2. Searches the live job market
3. Scores each job against your resume
4. Presents matches in a swipeable interface
5. Provides hireability insights for each position

### Job Search
Located at `/jobs`, this feature:
1. Fetches real-time job listings
2. Supports filtering by multiple criteria
3. Auto-refreshes every 2 minutes
4. Integrates with external job boards

## Troubleshooting

### AI Features Not Working
1. Ensure you have set `GOOGLE_GEMINI_API_KEY` in `.env.local`
2. Check that your API key has access to Gemini models
3. Verify network connectivity to Google's API endpoints

### PDF Parsing Issues
- Ensure PDF files are under 5MB
- Only PDF format is fully supported (DOCX has limited support)
- Some complex PDF layouts may not parse correctly

### API Rate Limits
If you hit rate limits:
- Wait a few minutes before making more requests
- The app automatically handles retries for transient errors
- Consider upgrading API tiers for production use

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC

## Acknowledgments

- Inspired by [Interview AI Frontend](https://github.com/Hazel-Singla/Interview-Ai-Frontend)
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Google Gemini](https://ai.google.dev/)
