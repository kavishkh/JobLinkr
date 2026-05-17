import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  passwordHash?: string
  name: string
  role: 'Seeker' | 'Employer'
  avatar?: string
  gender?: 'male' | 'female'
  age?: number
  headline?: string
  location?: string
  bio?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
  }
  skills?: Array<{ name: string; level: string }>
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
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: String,
    name: { type: String, required: true },
    role: { type: String, enum: ['Seeker', 'Employer'], required: true },
    avatar: String,
    gender: { type: String, enum: ['male', 'female'] },
    age: Number,
    headline: String,
    location: String,
    bio: String,
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
      twitter: String,
    },
    skills: [
      {
        name: String,
        level: String,
      },
    ],
    experience: [
      {
        company: String,
        title: String,
        period: String,
        description: String,
      },
    ],
    education: [
      {
        school: String,
        degree: String,
        year: String,
      },
    ],
  },
  { timestamps: true }
)

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
