export type UserRole = "seeker" | "employer";

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  title: string;
  company?: string;
  avatar: string;
  bio: string;
  skills: string[];
  location: string;
  experience: { title: string; company: string; period: string; description: string }[];
  education: { degree: string; school: string; year: string }[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorTitle: string;
  authorRole: UserRole;
  authorAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  companyAvatar: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  salary: string;
  description: string;
  skills: string[];
  postedAt: Date;
  applicants: number;
  matchPercent?: number;
}

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000);
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000);

export const mockUsers: User[] = [
  {
    id: "u1", name: "Sarah Chen", username: "sarahchen", role: "seeker",
    title: "Senior Frontend Engineer", avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Passionate about building delightful UIs with React & TypeScript. 6+ years in SaaS products.",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Node.js"],
    location: "San Francisco, CA",
    experience: [
      { title: "Senior Frontend Engineer", company: "TechCorp", period: "2022 – Present", description: "Leading UI architecture for the design system." },
      { title: "Frontend Developer", company: "StartupXYZ", period: "2019 – 2022", description: "Built customer-facing dashboards from scratch." },
    ],
    education: [{ degree: "B.S. Computer Science", school: "UC Berkeley", year: "2019" }],
  },
  {
    id: "u2", name: "Marcus Rivera", username: "marcusr", role: "seeker",
    title: "Full-Stack Developer", avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Full-stack dev who loves Rust and distributed systems. Open-source contributor.",
    skills: ["Rust", "Go", "React", "PostgreSQL", "Docker", "AWS"],
    location: "Austin, TX",
    experience: [
      { title: "Full-Stack Developer", company: "DataFlow Inc.", period: "2021 – Present", description: "Building real-time data pipelines." },
    ],
    education: [{ degree: "M.S. Software Engineering", school: "Georgia Tech", year: "2021" }],
  },
  {
    id: "u3", name: "Aisha Patel", username: "aishap", role: "seeker",
    title: "UX Designer & Researcher", avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Designing intuitive experiences backed by research. Figma wizard.",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "A/B Testing"],
    location: "New York, NY",
    experience: [
      { title: "Senior UX Designer", company: "DesignLab", period: "2020 – Present", description: "Led redesign increasing user retention 34%." },
    ],
    education: [{ degree: "B.F.A. Interaction Design", school: "SVA", year: "2018" }],
  },
  {
    id: "u4", name: "TechNova Inc.", username: "technova", role: "employer",
    title: "AI-Powered SaaS Company", company: "TechNova Inc.",
    avatar: "https://i.pravatar.cc/150?img=12",
    bio: "Building the future of work with AI. Series B, 200+ employees, fully remote.",
    skills: [], location: "Remote", experience: [], education: [],
  },
  {
    id: "u5", name: "GreenScale Labs", username: "greenscale", role: "employer",
    title: "Climate Tech Startup", company: "GreenScale Labs",
    avatar: "https://i.pravatar.cc/150?img=15",
    bio: "Using technology to fight climate change. Seed stage, growing fast.",
    skills: [], location: "Berlin, Germany", experience: [], education: [],
  },
  {
    id: "u6", name: "Priya Sharma", username: "priyas", role: "seeker",
    title: "Data Scientist", avatar: "https://i.pravatar.cc/150?img=9",
    bio: "ML engineer focused on NLP and recommendation systems.",
    skills: ["Python", "PyTorch", "TensorFlow", "SQL", "MLOps"],
    location: "Seattle, WA",
    experience: [
      { title: "Data Scientist", company: "MLWorks", period: "2023 – Present", description: "Building NLP pipelines for content moderation." },
    ],
    education: [{ degree: "Ph.D. Machine Learning", school: "Stanford", year: "2023" }],
  },
];

export const mockPosts: Post[] = [
  {
    id: "p1", authorId: "u1", authorName: "Sarah Chen", authorTitle: "Senior Frontend Engineer",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=1",
    content: "Just shipped a complete design system overhaul at TechCorp! 🎨\n\nWe migrated 200+ components to our new token-based architecture. The result? 40% faster development velocity and a much more consistent UI.\n\nKey takeaways:\n• Start with design tokens, not components\n• Invest in documentation early\n• Get buy-in from both design and engineering\n\nHappy to share more details if anyone's going through a similar journey!",
    timestamp: hoursAgo(2), likes: 47, comments: 12, shares: 8, liked: false,
  },
  {
    id: "p2", authorId: "u4", authorName: "TechNova Inc.", authorTitle: "AI-Powered SaaS Company",
    authorRole: "employer", authorAvatar: "https://i.pravatar.cc/150?img=12",
    content: "🚀 We're hiring! TechNova is looking for talented engineers to join our growing team.\n\nOpen roles:\n• Senior React Developer (Remote)\n• ML Engineer — NLP Focus\n• DevOps Engineer\n\nWe offer competitive salaries, equity, and a 4-day work week. Check our job listings for more details!",
    timestamp: hoursAgo(5), likes: 93, comments: 24, shares: 31, liked: false,
  },
  {
    id: "p3", authorId: "u3", authorName: "Aisha Patel", authorTitle: "UX Designer & Researcher",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Unpopular opinion: Most \"user-friendly\" interfaces are actually just familiar interfaces.\n\nTrue usability means designing for people who have never seen your product before — not just making it look like what they've used elsewhere.\n\nWe need to push past convention more often.",
    timestamp: hoursAgo(8), likes: 128, comments: 45, shares: 19, liked: false,
  },
  {
    id: "p4", authorId: "u2", authorName: "Marcus Rivera", authorTitle: "Full-Stack Developer",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Been exploring Rust for backend services and I'm blown away by the performance gains.\n\nOur latest microservice handles 3x the throughput with 50% less memory compared to the Node.js version. The learning curve is steep but absolutely worth it.",
    timestamp: hoursAgo(14), likes: 65, comments: 18, shares: 7, liked: false,
  },
  {
    id: "p5", authorId: "u5", authorName: "GreenScale Labs", authorTitle: "Climate Tech Startup",
    authorRole: "employer", authorAvatar: "https://i.pravatar.cc/150?img=15",
    content: "Excited to announce our seed round! 🌱\n\nGreenScale Labs raised $4.2M to build AI-powered carbon tracking for SMBs. We're on a mission to make sustainability accessible.\n\nLooking for passionate developers and data scientists who want to make a real impact. DM us!",
    timestamp: daysAgo(1), likes: 210, comments: 56, shares: 44, liked: false,
  },
  {
    id: "p6", authorId: "u6", authorName: "Priya Sharma", authorTitle: "Data Scientist",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=9",
    content: "Just completed a fascinating project using transformer models for multilingual content moderation.\n\nThe model handles 12 languages with 94% accuracy. Wrote a blog post about the architecture decisions — link in my profile!",
    timestamp: daysAgo(1), likes: 89, comments: 22, shares: 15, liked: false,
  },
  {
    id: "p7", authorId: "u1", authorName: "Sarah Chen", authorTitle: "Senior Frontend Engineer",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=1",
    content: "Pro tip for React devs: If your component tree re-renders are killing performance, before reaching for useMemo everywhere, try restructuring your state.\n\nOften the real issue is that state lives too high in the tree. Move it closer to where it's consumed.",
    timestamp: daysAgo(2), likes: 156, comments: 33, shares: 28, liked: false,
  },
  {
    id: "p8", authorId: "u4", authorName: "TechNova Inc.", authorTitle: "AI-Powered SaaS Company",
    authorRole: "employer", authorAvatar: "https://i.pravatar.cc/150?img=12",
    content: "Our team just hit a major milestone: 10,000 paying customers! 🎉\n\nFrom a garage startup to a 200-person team in 3 years. Grateful for every team member who made this possible.\n\n#startup #milestone #team",
    timestamp: daysAgo(3), likes: 342, comments: 67, shares: 52, liked: false,
  },
  {
    id: "p9", authorId: "u3", authorName: "Aisha Patel", authorTitle: "UX Designer & Researcher",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=5",
    content: "Just wrapped up user testing for a fintech app redesign. Key insight: users don't read labels — they follow visual hierarchy.\n\nIf your CTA isn't getting clicks, it's probably not a copy problem. It's a layout problem.",
    timestamp: daysAgo(4), likes: 74, comments: 19, shares: 11, liked: false,
  },
  {
    id: "p10", authorId: "u2", authorName: "Marcus Rivera", authorTitle: "Full-Stack Developer",
    authorRole: "seeker", authorAvatar: "https://i.pravatar.cc/150?img=3",
    content: "Open source contribution tip: Don't start with code. Start by improving documentation.\n\nMaintainers love it, you learn the codebase, and it's a much lower barrier to entry. My first PR to a major project was a README fix!",
    timestamp: daysAgo(5), likes: 201, comments: 41, shares: 36, liked: false,
  },
];

export const mockJobs: Job[] = [
  {
    id: "j1", title: "Senior React Developer", company: "TechNova Inc.",
    companyAvatar: "https://i.pravatar.cc/150?img=12", location: "Remote",
    type: "Full-time", salary: "$140k – $180k",
    description: "Join our frontend team building next-gen AI-powered dashboards. You'll work with React 19, TypeScript, and our internal design system to create beautiful, performant UIs.\n\nRequirements:\n• 5+ years React experience\n• Strong TypeScript skills\n• Experience with design systems\n• Bonus: GraphQL, testing",
    skills: ["React", "TypeScript", "GraphQL", "Tailwind CSS"],
    postedAt: daysAgo(1), applicants: 47,
  },
  {
    id: "j2", title: "ML Engineer — NLP Focus", company: "TechNova Inc.",
    companyAvatar: "https://i.pravatar.cc/150?img=12", location: "Remote",
    type: "Full-time", salary: "$160k – $200k",
    description: "Build and deploy NLP models for our content intelligence platform. Work with state-of-the-art transformer architectures.\n\nRequirements:\n• M.S./Ph.D. in ML or related field\n• Experience with PyTorch/TensorFlow\n• Published research is a plus",
    skills: ["Python", "PyTorch", "NLP", "MLOps", "Docker"],
    postedAt: daysAgo(2), applicants: 31,
  },
  {
    id: "j3", title: "UX/UI Designer", company: "GreenScale Labs",
    companyAvatar: "https://i.pravatar.cc/150?img=15", location: "Berlin, Germany",
    type: "Full-time", salary: "€70k – €90k",
    description: "Design intuitive interfaces for our carbon tracking platform. You'll own the full design process from research to high-fidelity prototypes.\n\nRequirements:\n• 3+ years product design experience\n• Proficiency in Figma\n• Experience with data visualization",
    skills: ["Figma", "User Research", "Prototyping", "Data Viz"],
    postedAt: daysAgo(3), applicants: 22,
  },
  {
    id: "j4", title: "Full-Stack Developer", company: "GreenScale Labs",
    companyAvatar: "https://i.pravatar.cc/150?img=15", location: "Remote",
    type: "Contract", salary: "$80 – $120/hr",
    description: "Help us build our MVP carbon tracking dashboard. 3-month contract with potential to convert.\n\nRequirements:\n• React + Node.js\n• PostgreSQL\n• Experience with data pipelines a plus",
    skills: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    postedAt: daysAgo(4), applicants: 15,
  },
  {
    id: "j5", title: "DevOps Engineer", company: "TechNova Inc.",
    companyAvatar: "https://i.pravatar.cc/150?img=12", location: "Remote",
    type: "Full-time", salary: "$130k – $165k",
    description: "Scale our infrastructure to support 10x growth. You'll manage Kubernetes clusters, CI/CD pipelines, and monitoring.\n\nRequirements:\n• 4+ years DevOps/SRE\n• Kubernetes, Terraform\n• AWS or GCP",
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD"],
    postedAt: daysAgo(5), applicants: 28,
  },
  {
    id: "j6", title: "Frontend Developer (Freelance)", company: "GreenScale Labs",
    companyAvatar: "https://i.pravatar.cc/150?img=15", location: "Remote",
    type: "Freelance", salary: "$60 – $90/hr",
    description: "Build reusable React components for our design system. Flexible hours, fully remote.\n\nRequirements:\n• Strong React + CSS skills\n• Component library experience\n• Available 20+ hrs/week",
    skills: ["React", "CSS", "Storybook", "TypeScript"],
    postedAt: daysAgo(6), applicants: 19,
  },
  {
    id: "j7", title: "Data Scientist", company: "TechNova Inc.",
    companyAvatar: "https://i.pravatar.cc/150?img=12", location: "San Francisco, CA",
    type: "Full-time", salary: "$150k – $190k",
    description: "Analyze user behavior and build recommendation models. Work closely with product to drive data-informed decisions.",
    skills: ["Python", "SQL", "Machine Learning", "A/B Testing"],
    postedAt: daysAgo(7), applicants: 36,
  },
  {
    id: "j8", title: "Technical Writer", company: "GreenScale Labs",
    companyAvatar: "https://i.pravatar.cc/150?img=15", location: "Remote",
    type: "Part-time", salary: "$45 – $65/hr",
    description: "Create developer documentation and API guides for our platform. Part-time, flexible schedule.",
    skills: ["Technical Writing", "API Documentation", "Markdown"],
    postedAt: daysAgo(8), applicants: 8,
  },
];

export const allSkills = [
  "React", "TypeScript", "JavaScript", "Python", "Rust", "Go", "Node.js",
  "GraphQL", "PostgreSQL", "Docker", "AWS", "Kubernetes", "Figma",
  "Tailwind CSS", "Next.js", "Vue.js", "Machine Learning", "NLP",
  "PyTorch", "TensorFlow", "SQL", "MongoDB", "Redis", "CI/CD",
];
