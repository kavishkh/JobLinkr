import mongoose from 'mongoose'

export interface IEmployerProfile extends mongoose.Document {
  userId: string
  companyName: string
  industry: string
  companySize: string
  website?: string
  description?: string
  logo?: string
  createdAt: Date
  updatedAt: Date
}

const EmployerProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    industry: { type: String, required: true },
    companySize: { type: String, required: true },
    website: String,
    description: String,
    logo: String,
  },
  { timestamps: true }
)

export const EmployerProfile = mongoose.models.EmployerProfile || mongoose.model<IEmployerProfile>('EmployerProfile', EmployerProfileSchema)
