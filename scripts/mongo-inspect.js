const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error('MONGODB_URI not set in environment')
  process.exit(1)
}

async function run() {
  try {
    await mongoose.connect(uri, { dbName: undefined })
    const admin = mongoose.connection.db.admin()
    const dbs = await admin.listDatabases()
    console.log('Databases:')
    dbs.databases.forEach(d => console.log(` - ${d.name} (${d.sizeOnDisk} bytes)`))

    // Use joblinkr DB (from URI or default)
    const targetDbName = (uri.includes('/') && uri.split('/').pop().split('?')[0]) || 'joblinkr'
    const targetDb = mongoose.connection.client.db(targetDbName)
    console.log(`\nInspecting database: ${targetDbName}`)
    const cols = await targetDb.listCollections().toArray()
    if (!cols.length) {
      console.log(' No collections found')
    } else {
      for (const c of cols) {
        const count = await targetDb.collection(c.name).countDocuments()
        console.log(` - ${c.name}: ${count} documents`)
      }
    }

    await mongoose.disconnect()
  } catch (err) {
    console.error('Error inspecting MongoDB:', err)
    process.exit(1)
  }
}

run()
