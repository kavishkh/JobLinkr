import mongoose from 'mongoose'
import fs from 'fs/promises'

// Load URI from env or .env.local
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
    console.log('Connecting to MongoDB...')
    await mongoose.connect(uri)
    const client = mongoose.connection.client

    const srcDb = client.db('test')
    const dstDb = client.db('joblinkr')

    console.log('Reading documents from test.users...')
    const srcColl = srcDb.collection('users')
    const docs = await srcColl.find().toArray()
    console.log(`Found ${docs.length} documents in test.users`)

    if (!docs.length) {
      console.log('No documents to migrate.')
      await mongoose.disconnect()
      return
    }

    const dstColl = dstDb.collection('users')

    let inserted = 0
    for (const doc of docs) {
      try {
        // Check by email if present
        const email = doc.email
        if (email) {
          const exists = await dstColl.findOne({ email })
          if (exists) {
            console.log(`Skipping existing email: ${email}`)
            continue
          }
        }

        // Remove _id to avoid conflicts if you prefer new ids
        const toInsert = { ...doc }
        // Option: keep original _id; if you want new ids uncomment next line
        // delete toInsert._id

        await dstColl.insertOne(toInsert)
        inserted++
      } catch (err) {
        console.error('Failed to insert doc:', err.message || err)
      }
    }

    console.log(`Migration complete. Inserted ${inserted} documents into joblinkr.users`)

    // Show counts
    const srcCount = await srcColl.countDocuments()
    const dstCount = await dstColl.countDocuments()
    console.log(`Counts — test.users: ${srcCount}, joblinkr.users: ${dstCount}`)

    await mongoose.disconnect()
  } catch (err) {
    console.error('Migration error:', err)
    process.exit(1)
  }
}

run()
