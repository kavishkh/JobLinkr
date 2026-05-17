import mongoose from 'mongoose'

import fs from 'fs/promises'

let uri = process.env.MONGODB_URI
if (!uri) {
  try {
    const env = await fs.readFile(new URL('../.env.local', import.meta.url), 'utf8')
    const match = env.split(/\r?\n/).map(l => l.trim()).find(l => l.startsWith('MONGODB_URI='))
    if (match) {
      uri = match.slice('MONGODB_URI='.length).trim()
    }
  } catch (e) {
    // ignore
  }

  if (!uri) {
    console.error('MONGODB_URI not set in environment or .env.local')
    process.exit(1)
  }
}

async function run() {
  try {
    await mongoose.connect(uri)
    const admin = mongoose.connection.db.admin()
    const dbs = await admin.listDatabases()
    console.log('Databases:')
    dbs.databases.forEach(d => console.log(` - ${d.name} (${d.sizeOnDisk} bytes)`))

    console.log('\nInspecting collections for each database:')
    for (const d of dbs.databases) {
      try {
        const dbName = d.name
        const currDb = mongoose.connection.client.db(dbName)
        const cols = await currDb.listCollections().toArray()
        if (!cols.length) {
          console.log(` - ${dbName}: no collections`)
          continue
        }
        console.log(` - ${dbName}:`)
        for (const c of cols) {
          const count = await currDb.collection(c.name).countDocuments()
          console.log(`    - ${c.name}: ${count} documents`)
        }
      } catch (e) {
        console.log(` - ${d.name}: (error reading collections)`)        
      }
    }

    await mongoose.disconnect()
  } catch (err) {
    console.error('Error inspecting MongoDB:', err)
    process.exit(1)
  }
}

run()
