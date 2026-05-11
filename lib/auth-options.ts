import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { auth } from './firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === 'development' ? 'joblinkr-dev-secret-change-me' : undefined),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: 'Seeker', // Default role for Google Sign-In
        }
      },
    }),
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
          const userCredential = await signInWithEmailAndPassword(auth, email.toLowerCase(), password)
          const firebaseUser = userCredential.user

          let displayName = firebaseUser.displayName || email.split('@')[0]
          let role: 'Seeker' | 'Employer' = 'Seeker'

          if (displayName.includes('|')) {
            const parts = displayName.split('|')
            const possibleRole = parts[parts.length - 1]
            if (possibleRole === 'Seeker' || possibleRole === 'Employer') {
              role = possibleRole
              displayName = parts.slice(0, -1).join('|')
            }
          }

          return {
            id: firebaseUser.uid,
            email: firebaseUser.email || email,
            name: displayName,
            role,
          }
        } catch (error: any) {
          console.error('Auth error during authorization:', error)
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
        const user = session.user as { id?: string; role?: 'Seeker' | 'Employer' }
        user.id = token.id as string
        user.role = token.role as 'Seeker' | 'Employer'
      }
      return session
    },
  },
}
