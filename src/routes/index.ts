import { Router } from 'express'
import * as controller from '../controllers'
import * as authController from '../controllers/auth.controller'
import * as chatController from '../controllers/chat.controller'
import { requireAuth, requireAdmin } from '../middleware/auth'

const router = Router()

router.get('/health', controller.health)
router.get('/coffees', controller.getCoffees)
router.get('/coffees/:slug', controller.getCoffeeBySlug)
router.post('/orders', controller.createOrder)
router.get('/orders/:id', controller.getOrderById)
router.patch('/orders/:id', controller.updateOrder)

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
