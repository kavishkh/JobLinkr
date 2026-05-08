export interface User {
  id: string
  name: string
  role: 'Seeker' | 'Employer'
  avatar: string
  headline: string
  location?: string
}

export interface Post {
  id: string
  author: User
  content: string
  image?: string
  timestamp: Date
  likes: number
  comments: number
  shares: number
  liked?: boolean
}

export interface Job {
  id: string
  title: string
  company: string
  companyLogo: string
  location: string
  level: 'Entry' | 'Mid' | 'Senior'
  type: 'Full-time' | 'Contract' | 'Freelance'
  salary?: { min: number; max: number; currency: string }
  description: string
  skills: string[]
  posted: Date
  applicants?: number
}

export interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  endorsed?: number
}

export interface UserProfile extends User {
  about: string
  experience: Array<{
    id: string
    company: string
    title: string
    startDate: Date
    endDate?: Date
    description: string
  }>
  education: Array<{
    id: string
    school: string
    degree: string
    field: string
    year: number
  }>
  skills: Skill[]
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Seeker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    headline: 'Full-Stack Developer | React & Node.js',
    location: 'San Francisco, CA'
  },
  {
    id: '2',
    name: 'Sarah Chen',
    role: 'Employer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    headline: 'CTO at TechStart Inc.',
    location: 'San Francisco, CA'
  },
  {
    id: '3',
    name: 'Marcus Smith',
    role: 'Seeker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
    headline: 'Product Designer | UI/UX Specialist',
    location: 'New York, NY'
  },
  {
    id: '4',
    name: 'Emma Wilson',
    role: 'Employer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    headline: 'Hiring Manager at DesignHub',
    location: 'Austin, TX'
  },
  {
    id: '5',
    name: 'David Kumar',
    role: 'Seeker',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    headline: 'Data Scientist | ML Engineer',
    location: 'Boston, MA'
  }
]

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    author: mockUsers[0],
    content: 'Excited to announce that I just completed a challenging freelance project building a real-time collaboration platform with React and WebSockets! The performance optimizations we implemented reduced load time by 40%. Open to connecting with other developers interested in scaling web applications.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 5,
    shares: 3,
    liked: false
  },
  {
    id: '2',
    author: mockUsers[1],
    content: 'We\'re hiring! 🚀 TechStart Inc. is looking for 3 Senior Full-Stack Engineers to join our product team. You\'ll work on our core platform serving 50K+ users. Check out our careers page for details. #Hiring #Engineering #TechJobs',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    likes: 67,
    comments: 12,
    shares: 8,
    liked: false
  },
  {
    id: '3',
    author: mockUsers[2],
    content: 'Just published an article on "Modern UI Design Trends in 2026". Diving into accessibility-first design, dark mode implementations, and the rise of AI-assisted design tools. Would love to hear your thoughts on what\'s working in your projects!',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    likes: 142,
    comments: 23,
    shares: 45,
    liked: false
  },
  {
    id: '4',
    author: mockUsers[3],
    content: 'Our design team is growing! We\'re looking for Mid-level Product Designers who are passionate about creating beautiful, functional interfaces. If you\'ve shipped features used by thousands, let\'s talk. DM or apply on our careers page.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    likes: 89,
    comments: 18,
    shares: 12,
    liked: false
  },
  {
    id: '5',
    author: mockUsers[4],
    content: 'After 18 months of intense learning, I\'ve completed my transition from traditional analytics to machine learning. Just landed my first ML Engineer role! Special thanks to the JobLinkr community for the support and opportunities. Let\'s connect if you\'re on a similar journey.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    likes: 203,
    comments: 34,
    shares: 56,
    liked: false
  },
  {
    id: '6',
    author: mockUsers[0],
    content: 'Pro tip: When building TypeScript applications, always leverage strict mode and discriminated unions for type safety. It saves hours of debugging and makes onboarding new team members much easier. What are your favorite TS patterns?',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    likes: 156,
    comments: 28,
    shares: 22,
    liked: false
  }
]

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full-Stack Engineer',
    company: 'TechStart Inc.',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=TS',
    location: 'San Francisco, CA',
    level: 'Senior',
    type: 'Full-time',
    salary: { min: 180000, max: 240000, currency: 'USD' },
    description: 'Join our platform team building scalable infrastructure for millions of users. You\'ll own features from concept to production.',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    posted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    applicants: 24
  },
  {
    id: 'job-2',
    title: 'Product Designer',
    company: 'DesignHub',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=DH',
    location: 'Austin, TX',
    level: 'Mid',
    type: 'Full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    description: 'We\'re looking for a talented designer to lead the redesign of our core product. Collaborate with product and engineering teams.',
    skills: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Design Systems'],
    posted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    applicants: 18
  },
  {
    id: 'job-3',
    title: 'Frontend Developer (Contract)',
    company: 'Startup Labs',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=SL',
    location: 'Remote',
    level: 'Mid',
    type: 'Contract',
    salary: { min: 65, max: 95, currency: 'USD/hour' },
    description: 'Help us build the next generation of our web application. 6-month contract with potential for extension.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
    posted: new Date(Date.now() - 3 * 60 * 60 * 1000),
    applicants: 12
  },
  {
    id: 'job-4',
    title: 'Data Scientist',
    company: 'AI Innovations',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=AI',
    location: 'Boston, MA',
    level: 'Senior',
    type: 'Full-time',
    salary: { min: 160000, max: 220000, currency: 'USD' },
    description: 'Lead our ML initiatives and work on cutting-edge models. You\'ll mentor junior scientists and shape our technical direction.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Statistics', 'SQL'],
    posted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    applicants: 31
  },
  {
    id: 'job-5',
    title: 'UI/UX Designer (Freelance)',
    company: 'Creative Agency Co.',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=CA',
    location: 'Remote',
    level: 'Entry',
    type: 'Freelance',
    description: 'Design web and mobile interfaces for our client projects. Multiple projects available year-round.',
    skills: ['Figma', 'Prototyping', 'Web Design', 'Mobile Design'],
    posted: new Date(Date.now() - 7 * 60 * 60 * 1000),
    applicants: 8
  },
  {
    id: 'job-6',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    companyLogo: 'https://api.dicebear.com/7.x/initials/svg?seed=CS',
    location: 'Seattle, WA',
    level: 'Mid',
    type: 'Full-time',
    salary: { min: 140000, max: 190000, currency: 'USD' },
    description: 'Architect and maintain our infrastructure serving 100K+ requests per second. Work with Kubernetes, Docker, and modern cloud platforms.',
    skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Linux'],
    posted: new Date(Date.now() - 10 * 60 * 60 * 1000),
    applicants: 15
  }
]

// Current user (for demo purposes)
export const currentUser: UserProfile = {
  id: 'current-user',
  name: 'You',
  role: 'Seeker',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser',
  headline: 'Full-Stack Developer | Open to Opportunities',
  location: 'San Francisco, CA',
  about: 'Passionate about building scalable web applications and solving complex problems. 5+ years of experience with modern JavaScript frameworks.',
  experience: [
    {
      id: 'exp-1',
      company: 'Tech Company A',
      title: 'Senior Developer',
      startDate: new Date(2021, 0, 1),
      description: 'Led development of core platform features, mentored junior developers'
    },
    {
      id: 'exp-2',
      company: 'Startup B',
      title: 'Full-Stack Engineer',
      startDate: new Date(2018, 0, 1),
      endDate: new Date(2020, 11, 31),
      description: 'Built and scaled web application from 0 to 50K users'
    }
  ],
  education: [
    {
      id: 'edu-1',
      school: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      year: 2018
    }
  ],
  skills: [
    { name: 'React', level: 'Expert', endorsed: 45 },
    { name: 'Node.js', level: 'Expert', endorsed: 38 },
    { name: 'TypeScript', level: 'Advanced', endorsed: 32 },
    { name: 'SQL', level: 'Advanced', endorsed: 28 },
    { name: 'AWS', level: 'Intermediate', endorsed: 15 }
  ]
}

export const employerUser: UserProfile = {
  id: 'employer-user',
  name: 'Tech Company Recruiter',
  role: 'Employer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Employer',
  headline: 'Hiring Manager at TechStart Inc.',
  location: 'San Francisco, CA',
  about: 'Building the best team in tech. Always looking for talented engineers and designers.',
  experience: [],
  education: [],
  skills: []
}

export const mockApplications = [
  {
    id: 'app-1',
    jobId: 'job-1',
    userId: 'current-user',
    status: 'Applied',
    appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  }
]

