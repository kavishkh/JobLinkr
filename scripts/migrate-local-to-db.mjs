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
    console.log('🔄 Migrating local data to MongoDB...')
    await mongoose.connect(uri)
    const client = mongoose.connection.client
    const db = client.db('joblinkr')

    const users = db.collection('users')
    const posts = db.collection('posts')
    const savedJobs = db.collection('saved_jobs')

    // Get or create a local user to represent "Your" local data
    let localUser = await users.findOne({ email: 'you@local.example' })
    const now = new Date()
    
    if (!localUser) {
      const res = await users.insertOne({
        email: 'you@local.example',
        name: 'You',
        role: 'Seeker',
        avatar: null,
        createdAt: now,
        updatedAt: now
      })
      localUser = await users.findOne({ _id: res.insertedId })
      console.log('✓ Created local user profile')
    } else {
      console.log('✓ Using existing local user profile')
    }

    // Local posts to migrate
    const localPosts = [
      {
        userId: String(localUser._id),
        author: { 
          id: String(localUser._id), 
          name: 'You', 
          avatar: null, 
          role: 'Seeker' 
        },
        content: 'Looking for a challenging role in a fast-paced environment. Open to remote opportunities!',
        likes: 5,
        comments: 2,
        shares: 1,
        liked: false,
        createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        userId: String(localUser._id),
        author: { 
          id: String(localUser._id), 
          name: 'You', 
          avatar: null, 
          role: 'Seeker' 
        },
        content: 'Just completed an online course on Machine Learning. Excited to apply these skills in my next project!',
        likes: 8,
        comments: 4,
        shares: 2,
        liked: false,
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        userId: String(localUser._id),
        author: { 
          id: String(localUser._id), 
          name: 'You', 
          avatar: null, 
          role: 'Seeker' 
        },
        content: 'Grateful for the opportunity to work on microservices architecture. Great learning experience!',
        likes: 12,
        comments: 5,
        shares: 3,
        liked: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
      }
    ]

    // Insert posts
    console.log(`📝 Inserting ${localPosts.length} local posts...`)
    await posts.insertMany(localPosts)
    console.log(`✓ Successfully inserted ${localPosts.length} posts`)

    // Local saved jobs to migrate
    const localSavedJobs = [
      {
        userId: String(localUser._id),
        jobTitle: 'Senior Full Stack Developer',
        company: 'TechCorp Inc',
        location: 'San Francisco, CA',
        salary: '$150k - $200k',
        description: 'We are looking for experienced developers',
        savedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        userId: String(localUser._id),
        jobTitle: 'Product Manager',
        company: 'InnovateLabs',
        location: 'New York, NY',
        salary: '$120k - $180k',
        description: 'Shape the future of our product',
        savedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
      }
    ]

    // Insert saved jobs
    console.log(`💾 Inserting ${localSavedJobs.length} saved jobs...`)
    await savedJobs.insertMany(localSavedJobs)
    console.log(`✓ Successfully inserted ${localSavedJobs.length} saved jobs`)

    const totalPosts = await posts.countDocuments()
    const totalJobs = await savedJobs.countDocuments()
    console.log(`\n✓ Migration complete!`)
    console.log(`  Total posts in DB: ${totalPosts}`)
    console.log(`  Total saved jobs in DB: ${totalJobs}`)

    await mongoose.disconnect()
  } catch (e) {
    console.error('❌ Migration failed:', e)
    process.exit(1)
  }
}

run()
