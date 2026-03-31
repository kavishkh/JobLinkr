import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail } from '@/lib/user-store'
import { verifyPassword } from '@/lib/password'

export const authOptions: NextAuthOptions = {
  trustHost: true,
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

        const user = await findUserByEmail(email)
        if (!user || !verifyPassword(password, user.passwordHash)) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && 'role' in user) {
        token.id = user.id
        token.role = (user as { role: 'Seeker' | 'Employer' }).role
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
