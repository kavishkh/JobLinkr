import mongoose from 'mongoose'

export interface IUser {
  email: string
  name: string
  password: string
  image?: string
  role?: string
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
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
