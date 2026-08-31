import fs from 'fs'
import path from 'path'
import { connectDatabase } from '../config/database'
import { uploadsDir } from '../config/uploads'
import { Coffee } from '../models/Coffee'

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const

function copyMainImageIfNeeded(sourceDir: string, imagePath: string): void {
  if (path.resolve(sourceDir) === path.resolve(uploadsDir)) {
    return
  }

  const filename = path.basename(imagePath)
  const sourcePath = path.join(sourceDir, filename)
  const targetPath = path.join(uploadsDir, filename)

  if (!fs.existsSync(sourcePath) || fs.existsSync(targetPath)) {
    return
  }

  fs.mkdirSync(uploadsDir, { recursive: true })
  fs.copyFileSync(sourcePath, targetPath)
  console.log(`[migrate-images] copied file ${filename} -> ${uploadsDir}`)
}

function resolveFrontendImagesDir(): string {
  const candidates = [
    uploadsDir,
    path.resolve(process.cwd(), '../frontend/public/images'),
    path.resolve(process.cwd(), 'frontend/public/images'),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'bloom.jpg'))) {
      return candidate
    }
  }

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate
    }
  }

  return uploadsDir
}

function findMainImagePath(imagesDir: string, slug: string): string | null {
  for (const extension of IMAGE_EXTENSIONS) {
    const filename = `${slug}${extension}`
    const filePath = path.join(imagesDir, filename)

    if (fs.existsSync(filePath)) {
      return `/images/${filename}`
    }
  }

  return null
}

async function migrateImages(): Promise<void> {
  await connectDatabase()

  const imagesDir = resolveFrontendImagesDir()
  const coffees = await Coffee.find().select('slug image gallery').lean().exec()

  let updated = 0
  let skipped = 0

  for (const coffee of coffees) {
    const imagePath = findMainImagePath(imagesDir, coffee.slug)

    if (!imagePath) {
      console.log(`[migrate-images] skip ${coffee.slug}: main image not found`)
      skipped += 1
      continue
    }

    copyMainImageIfNeeded(imagesDir, imagePath)

    if (
      coffee.image === imagePath &&
      coffee.gallery?.length === 1 &&
      coffee.gallery[0] === imagePath
    ) {
      console.log(`[migrate-images] up to date: ${coffee.slug} -> ${imagePath}`)
      skipped += 1
      continue
    }

    await Coffee.updateOne(
      { slug: coffee.slug },
      {
        $set: {
          image: imagePath,
          gallery: [imagePath],
        },
      },
    )

    updated += 1
    console.log(`[migrate-images] updated ${coffee.slug} -> ${imagePath}`)
  }

  console.log(`[migrate-images] done — updated: ${updated}, skipped: ${skipped}`)
  process.exit(0)
}

migrateImages().catch((error) => {
  console.error('[migrate-images] failed', error)
  process.exit(1)
})
