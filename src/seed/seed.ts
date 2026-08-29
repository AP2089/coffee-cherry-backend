import { connectDatabase } from '../config/database'
import { Coffee } from '../models/Coffee'
import { coffeesSeed } from './data'

async function seed(): Promise<void> {
  await connectDatabase()

  let upserted = 0

  for (const coffee of coffeesSeed) {
    await Coffee.findOneAndUpdate(
      { slug: coffee.slug },
      { $set: coffee },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    upserted += 1
    console.log(`[seed] upserted: ${coffee.slug}`)
  }

  console.log(`[seed] done — ${upserted} coffees`)
  process.exit(0)
}

seed().catch((error) => {
  console.error('[seed] failed', error)
  process.exit(1)
})
