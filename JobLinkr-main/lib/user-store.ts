import { promises as fs } from 'fs'
import path from 'path'

export interface StoredUser {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'Seeker' | 'Employer'
  avatar: string
  gender: 'male' | 'female'
  age: number
}

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json')

async function ensureFile(): Promise<void> {
  try {
    await fs.access(DATA_PATH)
  } catch {
    await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
    await fs.writeFile(DATA_PATH, '[]', 'utf-8')
  }
}

export async function getUsers(): Promise<StoredUser[]> {
  await ensureFile()
  const raw = await fs.readFile(DATA_PATH, 'utf-8')
  try {
    return JSON.parse(raw) as StoredUser[]
  } catch {
    return []
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const normalized = email.trim().toLowerCase()
  const users = await getUsers()
  return users.find((u) => u.email.toLowerCase() === normalized)
}

export async function createUser(
  data: Omit<StoredUser, 'id'>,
): Promise<StoredUser> {
  const users = await getUsers()
  if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    throw new Error('EMAIL_TAKEN')
  }
  const user: StoredUser = { ...data, id: crypto.randomUUID() }
  users.push(user)
  await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), 'utf-8')
  return user
}
