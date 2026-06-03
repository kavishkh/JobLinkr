// This file is emptied to resolve the 'mongoose' module not found error.
// The project is migrating to Firestore.
export interface IPost {
  id?: string;
  userId: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const Post = {} as any;
