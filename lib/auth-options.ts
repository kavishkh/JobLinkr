import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { verifyPassword } from '@/lib/password'

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
          const usersRef = collection(db, "users")
          const q = query(usersRef, where("email", "==", email.toLowerCase()), limit(1))
          const querySnapshot = await getDocs(q)
          
          if (querySnapshot.empty) return null
          
          const userDoc = querySnapshot.docs[0]
          const user = userDoc.data()

          if (!verifyPassword(password, user.password)) return null

          return {
            id: userDoc.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Auth error:", error)
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
