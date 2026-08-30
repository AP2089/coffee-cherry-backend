import type { NextFunction, Request, Response } from 'express'
import { isDatabaseConnected } from '../config/database'
import * as coffeeService from '../services/coffee.service'
import * as orderService from '../services/order.service'
import * as contactService from '../services/contact.service'
import type {
  ContactMessageStatus,
  CreateCoffeePayload,
  CreateContactMessagePayload,
  CreateOrderPayload,
  OrderStatus,
  UpdateCoffeePayload,
  UpdateContactMessagePayload,
  UpdateOrderPayload,
} from '../types'
import { AppError } from '../middleware/errorHandler'

function parseQueryNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseLocale(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  return value.trim().toLowerCase()
}

function parseContactStatus(value: unknown): ContactMessageStatus | undefined {
  if (value === 'new' || value === 'read' || value === 'archived') return value
  return undefined
}

function parseOrderStatus(value: unknown): OrderStatus | undefined {
  if (
    value === 'pending' ||
    value === 'confirmed' ||
    value === 'shipped' ||
    value === 'delivered' ||
    value === 'cancelled'
  ) {
    return value
  }
  return undefined
}

export async function health(_req: Request, res: Response): Promise<void> {
  const dbOk = isDatabaseConnected()

  if (!dbOk) {
    res.status(503).json({
      status: 'error',
      mongodb: 'disconnected',
    })
    return
  }

  res.status(200).json({
    status: 'ok',
  })
}

export async function getCoffees(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const locale = parseLocale(req.query.locale)
    const limit = parseQueryNumber(req.query.limit)
    const offset = parseQueryNumber(req.query.offset)

    if (limit !== undefined || offset !== undefined) {
      const coffees = await coffeeService.listCoffees({ locale, limit, offset })
      res.json({ success: true, data: coffees })
      return
    }

    const coffees = await coffeeService.getAllCoffees(locale)
    res.json({ success: true, data: coffees })
  } catch (error) {
    next(error)
  }
}

export async function getCoffeeBySlug(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const locale = parseLocale(req.query.locale)
    const coffee = await coffeeService.getCoffeeBySlug(req.params.slug, locale)
    res.json({ success: true, data: coffee })
  } catch (error) {
    next(error)
  }
}

export async function updateCoffee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payload = req.body as UpdateCoffeePayload
    const coffee = await coffeeService.updateCoffee(req.params.slug, payload)
    res.json({ success: true, data: coffee })
  } catch (error) {
    next(error)
  }
}

export async function createCoffee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payload = req.body as CreateCoffeePayload
    const coffee = await coffeeService.createCoffee(payload)
    res.status(201).json({ success: true, data: coffee })
  } catch (error) {
    next(error)
  }
}

export async function deleteCoffee(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await coffeeService.deleteCoffee(req.params.slug)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

export async function deleteCoffeeImage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const coffee = await coffeeService.deleteCoffeeImage(req.params.slug)
    res.json({ success: true, data: coffee })
  } catch (error) {
    next(error)
  }
}

export async function createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payload = req.body as CreateOrderPayload

    if (!payload?.customer?.name || !payload?.customer?.phone || !payload?.customer?.email) {
      throw new AppError('Customer name, phone and email are required', 400)
    }

    if (!payload?.customer?.city || !payload?.customer?.address) {
      throw new AppError('Customer city and address are required', 400)
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.customer.email)
    if (!emailOk) {
      throw new AppError('Invalid email address', 400)
    }

    const order = await orderService.createOrder(payload)
    res.status(201).json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export async function getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const order = await orderService.getOrderById(req.params.id)
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export async function updateOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const payload = req.body as UpdateOrderPayload
    const order = await orderService.updateOrder(req.params.id, payload)
    res.json({ success: true, data: order })
  } catch (error) {
    next(error)
  }
}

export async function listContactMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const messages = await contactService.listContactMessages({
      limit: parseQueryNumber(req.query.limit),
      offset: parseQueryNumber(req.query.offset),
      status: parseContactStatus(req.query.status),
    })
    res.json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
}

export async function getContactMessageById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const message = await contactService.getContactMessageById(req.params.id)
    res.json({ success: true, data: message })
  } catch (error) {
    next(error)
  }
}

export async function updateContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = req.body as UpdateContactMessagePayload
    const message = await contactService.updateContactMessage(req.params.id, payload)
    res.json({ success: true, data: message })
  } catch (error) {
    next(error)
  }
}

export async function deleteContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await contactService.deleteContactMessage(req.params.id)
    res.json({ success: true })
  } catch (error) {
    next(error)
  }
}

export async function listOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const orders = await orderService.listOrders({
      limit: parseQueryNumber(req.query.limit),
      offset: parseQueryNumber(req.query.offset),
      status: parseOrderStatus(req.query.status),
    })
    res.json({ success: true, data: orders })
  } catch (error) {
    next(error)
  }
}

export async function createContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const payload = req.body as CreateContactMessagePayload
    const contactMessage = await contactService.createContactMessage(payload)
    res.status(201).json({ success: true, data: contactMessage })
  } catch (error) {
    next(error)
  }
}
