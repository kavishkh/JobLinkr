import fs from 'fs/promises'
import fetch from 'node-fetch'

// Simulate local data that would be stored in localStorage
const localData = {
  posts: [
    {
      id: 'local-post-1',
      author: {
        id: 'local-user',
        name: 'You',
        avatar: null,
        role: 'Seeker'
      },
      content: 'Looking for a challenging role in a fast-paced environment. Open to remote opportunities!',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      likes: 5,
      comments: 2,
      shares: 1,
      liked: false
    },
    {
      id: 'local-post-2',
      author: {
        id: 'local-user',
        name: 'You',
        avatar: null,
        role: 'Seeker'
      },
      content: 'Just completed an online course on Machine Learning. Excited to apply these skills in my next project!',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      likes: 8,
      comments: 4,
      shares: 2,
      liked: false
    },
    {
      id: 'local-post-3',
      author: {
        id: 'local-user',
        name: 'You',
        avatar: null,
        role: 'Seeker'
      },
      content: 'Grateful for the opportunity to work on microservices architecture. Great learning experience!',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likes: 12,
      comments: 5,
      shares: 3,
      liked: false
    }
  ],
  savedJobs: [
    {
      id: 'saved-job-1',
      title: 'Senior Full Stack Developer',
      company: 'TechCorp Inc',
      location: 'San Francisco, CA',
      salary: '$150k - $200k',
      savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'saved-job-2',
      title: 'Product Manager',
      company: 'InnovateLabs',
      location: 'New York, NY',
      salary: '$120k - $180k',
      savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ]
}

async function migrateLocalData() {
  try {
    console.log('🔄 Migrating local data to MongoDB...')
    console.log(`📝 Posts to migrate: ${localData.posts.length}`)
    console.log(`💾 Jobs to migrate: ${localData.savedJobs.length}`)

    const baseUrl = 'http://localhost:3000'
    
    // Note: This endpoint requires authentication
    console.log('\n⚠️  Note: The migrate/local endpoint requires user authentication.')
    console.log('To use this data, you need to:')
    console.log('1. Sign in to your account')
    console.log('2. Open browser DevTools Console')
    console.log('3. Paste the following code:\n')

    const code = `
// Simulate local storage data
localStorage.setItem('jobLinkrPosts', JSON.stringify(${JSON.stringify(localData.posts)}));
localStorage.setItem('saved_jobs_v2', JSON.stringify(${JSON.stringify(localData.savedJobs)}));

// Trigger migration by refreshing the page
window.location.reload();
    `.trim()

    console.log(code)
    console.log('\n📌 This will set the local data and automatically migrate it when you refresh.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateLocalData()
