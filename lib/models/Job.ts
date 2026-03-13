import mongoose, { Schema, Document } from 'mongoose'

export interface IJob extends Document {
  slug: string
  title: string
  company_name: string
  location: string
  description: string
  url: string
  tags: string[]
  published_at?: Date
}

const JobSchema: Schema = new Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  company_name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  tags: { type: [String], default: [] },
  published_at: { type: Date, default: Date.now }
})

export default mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema)
