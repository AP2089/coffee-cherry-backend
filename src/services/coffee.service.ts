import { Coffee } from '../models/Coffee'
import { AppError } from '../middleware/errorHandler'
import type { ICoffee } from '../types'

export type CoffeeDTO = ICoffee & { _id: string }

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
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function getAllCoffees(): Promise<CoffeeDTO[]> {
  const coffees = await Coffee.find().sort({ createdAt: 1 }).lean().exec()
  return coffees.map((coffee) => toCoffeeDTO(coffee))
}

export async function getCoffeeBySlug(slug: string): Promise<CoffeeDTO> {
  const coffee = await Coffee.findOne({ slug: slug.toLowerCase() }).lean().exec()

  if (!coffee) {
    throw new AppError(`Coffee "${slug}" not found`, 404)
  }

  return toCoffeeDTO(coffee)
}

export async function getCoffeeById(id: string): Promise<CoffeeDTO> {
  const coffee = await Coffee.findById(id).lean().exec()

  if (!coffee) {
    throw new AppError('Coffee not found', 404)
  }

  return toCoffeeDTO(coffee)
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
