import { ContactMessage } from '../models/ContactMessage'
import { AppError } from '../middleware/errorHandler'
import type { CreateContactMessagePayload, IContactMessage, PaginatedList } from '../types'

export type ContactMessageDTO = IContactMessage & { _id: string }

const PAGE_SIZE_DEFAULT = 20
const PAGE_SIZE_MAX = 100

function clampPageSize(limit?: number): number {
  const value = limit ?? PAGE_SIZE_DEFAULT
  return Math.min(Math.max(value, 1), PAGE_SIZE_MAX)
}

function toContactMessageDTO(doc: unknown): ContactMessageDTO {
  const raw = doc as IContactMessage & { _id: unknown }
  return {
    _id: String(raw._id),
    name: raw.name,
    email: raw.email,
    message: raw.message,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function createContactMessage(
  payload: CreateContactMessagePayload,
): Promise<ContactMessageDTO> {
  const name = payload.name?.trim()
  const email = payload.email?.trim().toLowerCase()
  const message = payload.message?.trim()

  if (!name || name.length < 2) {
    throw new AppError('Name must be at least 2 characters', 400)
  }

  if (!email) {
    throw new AppError('Email is required', 400)
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!emailOk) {
    throw new AppError('Invalid email address', 400)
  }

  if (!message || message.length < 10) {
    throw new AppError('Message must be at least 10 characters', 400)
  }

  const contactMessage = await ContactMessage.create({
    name,
    email,
    message,
    status: 'new',
  })

  return toContactMessageDTO(contactMessage.toObject())
}

export async function listContactMessages(options?: {
  limit?: number
  offset?: number
}): Promise<PaginatedList<ContactMessageDTO>> {
  const limit = clampPageSize(options?.limit)
  const offset = Math.max(options?.offset ?? 0, 0)

  const [items, total] = await Promise.all([
    ContactMessage.find().sort({ createdAt: -1 }).skip(offset).limit(limit).lean().exec(),
    ContactMessage.countDocuments().exec(),
  ])

  return {
    items: items.map((item) => toContactMessageDTO(item)),
    total,
    hasMore: offset + items.length < total,
  }
}
