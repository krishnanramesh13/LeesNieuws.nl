require('dotenv').config()
const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: '6idcxy5u',
  dataset: 'production',
  apiVersion: '2026-05-13',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function deleteAll() {
  console.log('🔍 Finding all articles...')
  
  // Get published articles
  const published = await client.fetch('*[_type == "artikel"]{ _id, kop }')
  console.log(`Found ${published.length} published articles`)

  // Get drafts
  const drafts = await client.fetch('*[_id in path("drafts.**") && _type == "artikel"]{ _id, kop }')
  console.log(`Found ${drafts.length} draft articles`)

  const all = [...published, ...drafts]
  
  if (all.length === 0) {
    console.log('✅ Nothing to delete!')
    return
  }

  console.log(`\nDeleting ${all.length} articles...`)
  for (const doc of all) {
    await client.delete(doc._id)
    console.log(`  🗑️ Deleted: ${doc.kop || doc._id}`)
  }

  console.log('\n✅ All articles deleted!')
}

deleteAll().catch(console.error)