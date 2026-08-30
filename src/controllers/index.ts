import type { NextFunction, Request, Response } from 'express'
import { isDatabaseConnected } from '../config/database'
import * as coffeeService from '../services/coffee.service'
import * as orderService from '../services/order.service'
import * as contactService from '../services/contact.service'
import type { CreateContactMessagePayload, CreateOrderPayload, UpdateOrderPayload } from '../types'
import { AppError } from '../middleware/errorHandler'

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

export async function getCoffees(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const coffees = await coffeeService.getAllCoffees()
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
    const coffee = await coffeeService.getCoffeeBySlug(req.params.slug)
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

function parseQueryNumber(value: unknown): number | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : undefined
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

export async function listContactMessages(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const messages = await contactService.listContactMessages({
      limit: parseQueryNumber(req.query.limit),
      offset: parseQueryNumber(req.query.offset),
    })
    res.json({ success: true, data: messages })
  } catch (error) {
    next(error)
  }
}
