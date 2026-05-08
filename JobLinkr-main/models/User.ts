import mongoose from 'mongoose'

export interface IUser {
  email: string
  name: string
  password: string
  image?: string
  role?: string
  bio?: string
  location?: string
  title?: string
  gender?: string
  age?: number
  socialLinks?: {
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
  }
  skills?: Array<{
    name: string
    level: string
  }>
  experience?: Array<{
    company: string
    title: string
    period: string
    description: string
  }>
  education?: Array<{
    school: string
    degree: string
    year: string
  }>
  savedJobs?: string[]
  applications?: string[]
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
    },
    image: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'seeker',
      enum: ['seeker', 'employer', 'admin'],
    },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    title: { type: String, default: '' },
    gender: { type: String, default: '' },
    age: { type: Number },
    socialLinks: {
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    skills: [
      {
        name: { type: String },
        level: { type: String },
      },
    ],
    experience: [
      {
        company: { type: String },
        title: { type: String },
        period: { type: String },
        description: { type: String },
      },
    ],
    education: [
      {
        school: { type: String },
        degree: { type: String },
        year: { type: String },
      },
    ],
    savedJobs: [{ type: String }],
    applications: [{ type: String }],
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
