import { Order } from '../models/Order'
import { AppError } from '../middleware/errorHandler'
import { getCoffeeBySlug, decreaseStock } from './coffee.service'
import type { CoffeeWeight, CreateOrderPayload, IOrder } from '../types'

export type OrderDTO = IOrder & { _id: string }

const WEIGHT_MULTIPLIER: Record<CoffeeWeight, number> = {
  250: 1,
  500: 1.9,
  1000: 3.6,
}

function calcItemPrice(basePrice: number, weight: CoffeeWeight): number {
  return Math.round(basePrice * WEIGHT_MULTIPLIER[weight])
}

function toOrderDTO(doc: unknown): OrderDTO {
  const raw = doc as IOrder & { _id: unknown }
  return {
    _id: String(raw._id),
    items: raw.items,
    customer: raw.customer,
    totalPrice: raw.totalPrice,
    status: raw.status,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export async function createOrder(payload: CreateOrderPayload): Promise<OrderDTO> {
  if (!payload.items?.length) {
    throw new AppError('Order must contain at least one item', 400)
  }

  if (!payload.customer) {
    throw new AppError('Customer data is required', 400)
  }

  const orderItems = []

  for (const item of payload.items) {
    if (!item.slug || !item.weight || !item.quantity || item.quantity < 1) {
      throw new AppError('Invalid order item', 400)
    }

    const coffee = await getCoffeeBySlug(item.slug)

    if (coffee.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${coffee.name}`, 400)
    }

    if (!coffee.weights.includes(item.weight)) {
      throw new AppError(`Weight ${item.weight}g is not available for ${coffee.name}`, 400)
    }

    orderItems.push({
      coffeeId: coffee._id,
      slug: coffee.slug,
      name: coffee.name,
      weight: item.weight,
      quantity: item.quantity,
      price: calcItemPrice(coffee.price, item.weight),
    })
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  for (const item of orderItems) {
    await decreaseStock(item.coffeeId, item.quantity)
  }

  const order = await Order.create({
    items: orderItems,
    customer: {
      name: payload.customer.name.trim(),
      phone: payload.customer.phone.trim(),
      email: payload.customer.email.trim().toLowerCase(),
      city: payload.customer.city.trim(),
      address: payload.customer.address.trim(),
      comment: payload.customer.comment?.trim() || '',
    },
    totalPrice,
    status: 'pending',
  })

  return toOrderDTO(order.toObject())
}

export async function getOrderById(id: string): Promise<OrderDTO> {
  const order = await Order.findById(id).lean().exec()

  if (!order) {
    throw new AppError('Order not found', 404)
  }

  return toOrderDTO(order)
}
