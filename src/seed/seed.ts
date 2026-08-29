import { connectDatabase } from '../config/database'
import { Coffee } from '../models/Coffee'
import { User, hashPassword } from '../models/User'
import { coffeesSeed } from './data'
import { usersSeed } from './users'

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
    console.log(`[seed] upserted coffee: ${coffee.slug}`)
  }

  console.log(`[seed] done — ${upserted} coffees`)

  let usersUpserted = 0

  for (const user of usersSeed) {
    await User.findOneAndUpdate(
      { username: user.username },
      {
        $set: {
          passwordHash: hashPassword(user.password),
          role: user.role,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    )
    usersUpserted += 1
    console.log(`[seed] upserted user: ${user.username} (${user.role})`)
  }

  console.log(`[seed] done — ${usersUpserted} users`)
  process.exit(0)
}

seed().catch((error) => {
  console.error('[seed] failed', error)
  process.exit(1)
})
