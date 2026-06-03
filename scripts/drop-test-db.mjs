import mongoose from 'mongoose'
import fs from 'fs/promises'

let uri = process.env.MONGODB_URI
if (!uri) {
  try {
    const env = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
    const match = env.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith('MONGODB_URI='))
    if (match) uri = match.slice('MONGODB_URI='.length).trim()
  } catch (e) {}
}

if (!uri) {
  console.error('MONGODB_URI not set')
  process.exit(1)
}

async function run() {
  try {
    await mongoose.connect(uri)
    const client = mongoose.connection.client
    const db = client.db('test')
    console.log('Dropping `test` database...')
    await db.dropDatabase()
    console.log('Dropped `test` database')
    await mongoose.disconnect()
  } catch (e) {
    console.error('Failed to drop test DB:', e)
    process.exit(1)
  }
}

run()
