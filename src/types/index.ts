export type ChatSender = 'user' | 'agent'

export interface IChatMessage {
  sessionId: string
  sender: ChatSender
  text: string
  createdAt?: Date
}

export interface IConversation {
  sessionId: string
  guestName?: string
  guestEmail?: string
  status: 'open' | 'closed'
  createdAt?: Date
  updatedAt?: Date
}

export interface ChatGuestProfile {
  guestName: string
  guestEmail: string
}

export interface ChatMessageDTO {
  id: string
  sessionId: string
  sender: ChatSender
  text: string
  createdAt: string
}

export type CoffeeWeight = 250 | 500 | 1000

export interface ICoffee {
  name: string
  slug: string
  country: string
  region: string
  variety: string
  process: string
  altitude: string
  description: string
  story: string
  flavorNotes: string[]
  price: number
  weights: CoffeeWeight[]
  image: string
  gallery: string[]
  stock: number
  createdAt?: Date
  updatedAt?: Date
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

export interface IOrderItem {
  coffeeId: string
  slug: string
  name: string
  weight: CoffeeWeight
  quantity: number
  price: number
}

export interface ICustomer {
  name: string
  phone: string
  email: string
  city: string
  address: string
  comment?: string
}

export interface IOrder {
  items: IOrderItem[]
  customer: ICustomer
  totalPrice: number
  status: OrderStatus
  createdAt?: Date
  updatedAt?: Date
}

export interface CreateOrderPayload {
  items: Array<{
    slug: string
    weight: CoffeeWeight
    quantity: number
  }>
  customer: ICustomer
}

export interface UpdateOrderPayload {
  status?: OrderStatus
}
