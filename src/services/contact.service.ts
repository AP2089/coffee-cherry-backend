import { ContactMessage } from '../models/ContactMessage'
import { AppError } from '../middleware/errorHandler'
import type { CreateContactMessagePayload, IContactMessage } from '../types'

export type ContactMessageDTO = IContactMessage & { _id: string }

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
