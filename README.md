# 🚀 JobLinkr - AI-Powered Job Matching Platform

JobLinkr is a state-of-the-art job matching platform that leverages Artificial Intelligence to connect talent with the right opportunities. Featuring a "Tinder-style" matching interface, it analyzes your resume in real-time to provide hireability scores and tailored application advice.

![JobLinkr Preview](https://github.com/user-attachments/assets/your-placeholder-image) <!-- Add a real screenshot link here if you have one -->

## ✨ Key Features

- **🧠 AI Market Matcher**: A premium swipe-to-match interface that ranks job opportunities based on your profile's strength.
- **📄 Deep Resume Analysis**: Powered by Google Gemini, JobLinkr extracts skills and provides hireability tactics to help you stand out.
- **⚡ Real-time Job Search**: High-performance job searching powered by MongoDB, ensuring you see the latest market opportunities.
- **📈 Hireability Scoring**: Get an instant percentage match for every job, along with specific tips on how to get hired.
- **📱 Premium Responsive Design**: A stunning, high-contrast UI built with Tailwind CSS and Shadcn UI, optimized for all screen sizes.
- **💾 Match Tracking**: Save interesting roles and manage your application pipeline with ease.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js API Routes (Edge-ready)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **AI Engine**: [Google Gemini AI](https://ai.google.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/kavishkh/JobLinkr.git
   cd JobLinkr
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
├── app/              # Next.js App Router (Pages & API)
├── components/       # Reusable UI components
│   └── ui/           # Shadcn base components
├── lib/              # Utilities, DB connection, and AI logic
│   ├── models/       # Mongoose Schemas
│   └── db.ts         # MongoDB connection management
├── public/           # Static assets
└── styles/           # Global styles and Tailwind config
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the ISC License. See `LICENSE` for more information.

---
Built with ❤️ by [Kavish](https://github.com/kavishkh)
