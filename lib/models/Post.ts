import mongoose from 'mongoose'

export interface IPost extends mongoose.Document {
  userId: string
  author: {
    id: string
    name: string
    avatar?: string
    role: string
  }
  content: string
  likes: number
  comments: number
  shares: number
  liked: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    author: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      avatar: String,
      role: String,
    },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)
