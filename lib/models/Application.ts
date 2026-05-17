import mongoose from 'mongoose'

export interface IApplication extends mongoose.Document {
  jobId: string
  userId: string
  userEmail: string
  fullName: string
  phone: string
  role: string
  expectedPay: string
  linkedIn: string
  coverNote: string
  resumePath: string
  status: 'Applied' | 'Under Review' | 'Rejected' | 'Accepted'
  appliedAt: Date
  updatedAt: Date
}

const ApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    fullName: { type: String },
    phone: { type: String },
    role: { type: String },
    expectedPay: { type: String },
    linkedIn: { type: String },
    coverNote: { type: String },
    resumePath: { type: String },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Rejected', 'Accepted'],
      default: 'Applied',
    },
  },
  { timestamps: true }
)

export const Application = mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema)
