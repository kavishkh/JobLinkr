import { randomBytes, pbkdf2Sync, timingSafeEqual } from 'crypto'

const ITERATIONS = 100_000
const KEYLEN = 32
const DIGEST = 'sha256'

export function hashPassword(password: string): string {
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const salt = Buffer.from(saltHex, 'hex')
  const expected = Buffer.from(hashHex, 'hex')
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
  if (hash.length !== expected.length) return false
  return timingSafeEqual(hash, expected)
}
