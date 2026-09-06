import { Coffee } from '../models/Coffee'
import { AppError } from '../middleware/errorHandler'
import type { ICoffee, PaginatedList } from '../types'

export type CoffeeDTO = ICoffee & { _id: string }

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 100

function clampPageSize(limit?: number): number {
  const value = limit ?? PAGE_SIZE_DEFAULT
  return Math.min(Math.max(value, 1), PAGE_SIZE_MAX)
}

function toCoffeeDTO(doc: unknown): CoffeeDTO {
  const raw = doc as ICoffee & { _id: unknown; __v?: unknown }
  return {
    _id: String(raw._id),
    name: raw.name,
    slug: raw.slug,
    country: raw.country,
    region: raw.region,
    variety: raw.variety,
    process: raw.process,
    altitude: raw.altitude,
    description: raw.description,
    story: raw.story,
    flavorNotes: [...raw.flavorNotes],
    price: raw.price,
    weights: [...raw.weights],
    image: raw.image,
    gallery: [...raw.gallery],
    stock: raw.stock,
    translations: raw.translations?.en
      ? {
          en: {
            name: raw.translations.en.name || '',
            country: raw.translations.en.country,
            region: raw.translations.en.region,
            variety: raw.translations.en.variety || '',
            process: raw.translations.en.process,
            altitude: raw.translations.en.altitude || '',
            description: raw.translations.en.description,
            story: raw.translations.en.story,
            flavorNotes: [...raw.translations.en.flavorNotes],
          },
        }
      : undefined,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

function applyTranslation(coffee: CoffeeDTO, locale?: string): CoffeeDTO {
  if (!locale || locale === 'ru') return coffee

  const translation = coffee.translations?.en
  if (!translation?.description) return coffee

  return {
    ...coffee,
    name: translation.name || coffee.name,
    country: translation.country,
    region: translation.region,
    variety: translation.variety || coffee.variety,
    process: translation.process,
    altitude: translation.altitude || coffee.altitude,
    description: translation.description,
    story: translation.story,
    flavorNotes: [...translation.flavorNotes],
  }
}

export async function getAllCoffees(locale?: string): Promise<CoffeeDTO[]> {
  const coffees = await Coffee.find().sort({ createdAt: 1 }).lean().exec()
  return coffees.map((coffee) => applyTranslation(toCoffeeDTO(coffee), locale))
}

export async function listCoffees(options?: {
  locale?: string
  limit?: number
  offset?: number
}): Promise<PaginatedList<CoffeeDTO>> {
  const limit = clampPageSize(options?.limit)
  const offset = Math.max(options?.offset ?? 0, 0)

  const [items, total] = await Promise.all([
    Coffee.find().sort({ createdAt: 1 }).skip(offset).limit(limit).lean().exec(),
    Coffee.countDocuments().exec(),
  ])

  const dtos = items.map((coffee) => applyTranslation(toCoffeeDTO(coffee), options?.locale))

  return {
    items: dtos,
    total,
    hasMore: offset + items.length < total,
  }
}

export async function getCoffeeBySlug(slug: string, locale?: string): Promise<CoffeeDTO> {
  const coffee = await Coffee.findOne({ slug: slug.toLowerCase() }).lean().exec()

  if (!coffee) {
    throw new AppError(`Coffee "${slug}" not found`, 404)
  }

  return applyTranslation(toCoffeeDTO(coffee), locale)
}

export async function decreaseStock(id: string, quantity: number): Promise<CoffeeDTO> {
  const coffee = await Coffee.findOneAndUpdate(
    { _id: id, stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true },
  )
    .lean()
    .exec()

  if (!coffee) {
    throw new AppError('Insufficient stock', 400)
  }

  return toCoffeeDTO(coffee)
}
