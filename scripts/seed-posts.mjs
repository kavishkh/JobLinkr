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
    console.log('Connecting to MongoDB...')
    await mongoose.connect(uri)
    const client = mongoose.connection.client
    const db = client.db('joblinkr')

    const users = db.collection('users')
    const posts = db.collection('posts')

    // Delete existing posts
    console.log('Deleting existing posts...')
    const deleteResult = await posts.deleteMany({})
    console.log(`Deleted ${deleteResult.deletedCount} posts`)

    // Get or create seed users
    let seedUsers = await users.find({}).limit(5).toArray()
    if (seedUsers.length === 0) {
      console.log('No users found, creating seed users...')
      const now = new Date()
      const seedUsersData = [
        { email: 'alice@example.com', name: 'Alice Johnson', role: 'Seeker', avatar: null },
        { email: 'bob@example.com', name: 'Bob Smith', role: 'Employer', avatar: null },
        { email: 'carol@example.com', name: 'Carol Davis', role: 'Seeker', avatar: null },
        { email: 'dave@example.com', name: 'Dave Wilson', role: 'Seeker', avatar: null },
        { email: 'eve@example.com', name: 'Eve Brown', role: 'Employer', avatar: null },
      ]
      const res = await users.insertMany(
        seedUsersData.map(u => ({ ...u, createdAt: now, updatedAt: now }))
      )
      seedUsers = await users.find({ _id: { $in: res.insertedIds } }).toArray()
    }

    console.log(`Using ${seedUsers.length} seed users`)

    // Create realistic posts
    const now = new Date()
    const realPosts = [
      {
        userId: String(seedUsers[0]._id),
        author: { id: String(seedUsers[0]._id), name: seedUsers[0].name, avatar: seedUsers[0].avatar, role: seedUsers[0].role },
        content: 'Just landed my dream job as a Senior Software Engineer! 🎉 After 6 months of preparation and networking, it finally happened. Excited to start this new chapter and work with an amazing team.',
        likes: 12,
        comments: 3,
        shares: 2,
        liked: false,
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        userId: String(seedUsers[1]._id),
        author: { id: String(seedUsers[1]._id), name: seedUsers[1].name, avatar: seedUsers[1].avatar, role: seedUsers[1].role },
        content: 'We are hiring! Looking for passionate Full Stack Developers to join our growing tech team. Great culture, competitive salary, and remote-first environment. Apply now! 🚀',
        likes: 28,
        comments: 8,
        shares: 5,
        liked: false,
        createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        userId: String(seedUsers[2]._id),
        author: { id: String(seedUsers[2]._id), name: seedUsers[2].name, avatar: seedUsers[2].avatar, role: seedUsers[2].role },
        content: 'Just completed a challenging project using React and Node.js. Learned so much about system design and scalability. Grateful for the supportive team that helped me grow! 💪',
        likes: 18,
        comments: 5,
        shares: 1,
        liked: false,
        createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
      {
        userId: String(seedUsers[3]._id),
        author: { id: String(seedUsers[3]._id), name: seedUsers[3].name, avatar: seedUsers[3].avatar, role: seedUsers[3].role },
        content: 'Tips for preparing for technical interviews: 1) Practice coding problems daily, 2) Understand data structures deeply, 3) Mock interview with peers, 4) Study system design. You got this! 💻',
        likes: 45,
        comments: 12,
        shares: 8,
        liked: false,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      },
      {
        userId: String(seedUsers[4]._id),
        author: { id: String(seedUsers[4]._id), name: seedUsers[4].name, avatar: seedUsers[4].avatar, role: seedUsers[4].role },
        content: 'Excited to announce our new AI-powered job matching platform! We are revolutionizing how job seekers find their perfect role. Early beta access available now. Check it out! 🤖',
        likes: 34,
        comments: 9,
        shares: 6,
        liked: false,
        createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000),
      },
      {
        userId: String(seedUsers[0]._id),
        author: { id: String(seedUsers[0]._id), name: seedUsers[0].name, avatar: seedUsers[0].avatar, role: seedUsers[0].role },
        content: 'Reflecting on 5 years in tech: started as an intern, worked across 3 different companies, learned countless technologies, and built amazing products. If you are considering a career in tech, go for it! The journey is worth it. 🌟',
        likes: 22,
        comments: 7,
        shares: 3,
        liked: false,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
    ]

    console.log(`Inserting ${realPosts.length} realistic posts...`)
    const insertResult = await posts.insertMany(realPosts)
    console.log(`Successfully inserted ${insertResult.insertedIds.length} posts`)

    const seededPosts = await posts.find({}).toArray()
    console.log(`Total posts in database: ${seededPosts.length}`)

    await mongoose.disconnect()
    console.log('Done!')
  } catch (e) {
    console.error('Seed script failed:', e)
    process.exit(1)
  }
}

run()
