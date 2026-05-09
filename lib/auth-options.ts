import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db, auth } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore/lite'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === 'development' ? 'joblinkr-dev-secret-change-me' : undefined),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim()
        const password = credentials?.password
        if (!email || !password) return null

        try {
          // 1. Authenticate with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password);
          const firebaseUser = userCredential.user;

          // NOTE: Firestore lookup disabled per user request
          /*
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
             const userData = userDoc.data();
             return {
              id: firebaseUser.uid,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              image: userData.image,
            }
          }
          */

          return {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name: firebaseUser.displayName || email.split('@')[0],
            role: 'Seeker', // Default role since we aren't storing it
          }
        } catch (error: any) {
          console.error("Auth error during authorization:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'Seeker' | 'Employer'
      }
      return session
    },
  },
}
