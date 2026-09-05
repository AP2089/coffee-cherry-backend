import { Router } from 'express'
import * as controller from '../controllers'
import * as authController from '../controllers/auth.controller'
import * as chatController from '../controllers/chat.controller'
import * as uploadController from '../controllers/upload.controller'
import { requireAuth, requireAdmin, forbidGuest } from '../middleware/auth'
import { uploadImageMiddleware } from '../middleware/upload'

const router = Router()

router.get('/health', controller.health)
router.post(
  '/uploads',
  requireAuth,
  forbidGuest,
  uploadImageMiddleware,
  uploadController.uploadImage,
)
router.get('/coffees', controller.getCoffees)
router.post('/coffees', requireAuth, forbidGuest, controller.createCoffee)
router.get('/coffees/:slug', controller.getCoffeeBySlug)
router.patch('/coffees/:slug', requireAuth, forbidGuest, controller.updateCoffee)
router.delete('/coffees/:slug/image', requireAuth, forbidGuest, controller.deleteCoffeeImage)
router.delete('/coffees/:slug', requireAuth, forbidGuest, controller.deleteCoffee)

router.post('/orders', controller.createOrder)
router.get('/orders', requireAuth, controller.listOrders)
router.get('/orders/:id', requireAuth, controller.getOrderById)
router.patch('/orders/:id', requireAuth, forbidGuest, controller.updateOrder)

router.post('/contacts', controller.createContactMessage)
router.get('/contacts', requireAuth, controller.listContactMessages)
router.get('/contacts/:id', requireAuth, controller.getContactMessageById)
router.patch('/contacts/:id', requireAuth, forbidGuest, controller.updateContactMessage)
router.delete('/contacts/:id', requireAuth, requireAdmin, controller.deleteContactMessage)

router.post('/auth/login', authController.login)
router.get('/auth/me', requireAuth, authController.me)

router.get('/conversations', requireAuth, chatController.listConversations)
router.get(
  '/conversations/:sessionId/messages',
  requireAuth,
  chatController.getConversationMessages,
)
router.delete(
  '/conversations/:sessionId',
  requireAuth,
  requireAdmin,
  chatController.deleteConversation,
)

export default router
