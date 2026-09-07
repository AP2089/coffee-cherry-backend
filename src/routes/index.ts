import { Router } from 'express'
import * as controller from '../controllers'

const router = Router()

router.get('/health', controller.health)
router.get('/coffees', controller.getCoffees)
router.get('/coffees/:slug', controller.getCoffeeBySlug)

router.post('/orders', controller.createOrder)
router.get('/orders/:id', controller.getOrderById)

router.post('/contacts', controller.createContactMessage)

export default router
