import { hashPassword, verifyPassword } from './lib/password.js'

const pass = 'password123'
const hashed = hashPassword(pass)
console.log('Hashed:', hashed)
const isValid = verifyPassword(pass, hashed)
console.log('Is valid:', isValid)

const isInvalid = verifyPassword('wrongpass', hashed)
console.log('Is invalid (should be false):', isInvalid)
