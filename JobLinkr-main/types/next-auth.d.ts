import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: 'Seeker' | 'Employer'
    }
  }

  interface User {
    role: 'Seeker' | 'Employer'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    role?: 'Seeker' | 'Employer'
  }
}
