import mongoose from 'mongoose'

export interface ISavedJob extends mongoose.Document {
  userId: string
  jobId: string
  jobTitle?: string
  company?: string
  location?: string
  salary?: string
  description?: string
  savedAt?: Date
}

const SavedJobSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String },
    company: { type: String },
    location: { type: String },
    salary: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

// Create a compound index to prevent duplicates
SavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true })

export const SavedJob = mongoose.models.SavedJob || mongoose.model<ISavedJob>('SavedJob', SavedJobSchema)
