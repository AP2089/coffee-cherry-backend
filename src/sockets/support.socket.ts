import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { env } from '../config/env'
import * as chatService from '../services/chat.service'

function resolveCorsOrigin(): string | string[] | boolean {
  if (env.corsOrigin === '*') return true
  return env.corsOrigin.split(',').map((origin) => origin.trim())
}

export function initSupportSocket(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: resolveCorsOrigin(),
      methods: ['GET', 'POST'],
    },
    path: '/socket.io',
  })

  io.on('connection', (socket) => {
    socket.on(
      'support:join',
      async (payload: {
        sessionId?: string
        guestName?: string
        guestEmail?: string
        locale?: string
      }) => {
        const sessionId = payload?.sessionId?.trim()

        if (!sessionId) {
          socket.emit('support:error', { message: 'sessionId is required' })
          return
        }

        const locale = payload.locale === 'en' ? 'en' : 'ru'

        try {
          socket.data.sessionId = sessionId
          socket.data.role = 'user'
          await socket.join(sessionId)

          const result = await chatService.ensureConversation(
            sessionId,
            {
              guestName: payload.guestName,
              guestEmail: payload.guestEmail,
            },
            locale,
          )

          socket.emit('support:history', {
            messages: result.messages,
            guestName: result.guestName,
            guestEmail: result.guestEmail,
          })
        } catch (error) {
          console.error('[socket] support:join failed', error)
          const message = error instanceof Error ? error.message : 'Failed to join chat'
          socket.emit('support:error', { message })
        }
      },
    )

    socket.on('support:message', async (payload: { text?: string }) => {
      const sessionId = socket.data.sessionId as string | undefined
      const text = payload?.text?.trim()

      if (!sessionId || socket.data.role !== 'user') {
        socket.emit('support:error', { message: 'Not joined to chat' })
        return
      }

      if (!text) {
        socket.emit('support:error', { message: 'Message is empty' })
        return
      }

      try {
        const message = await chatService.createMessage(sessionId, 'user', text)
        const meta = await chatService.getConversationMeta(sessionId)
        io.to(sessionId).emit('support:message', { message })
        io.to('support-agents').emit('support:user-message', { sessionId, message, meta })
      } catch (error) {
        console.error('[socket] support:message failed', error)
        socket.emit('support:error', { message: 'Failed to send message' })
      }
    })

    socket.on('support:agent:join', (payload: { token?: string }) => {
      if (!env.supportAgentToken || payload?.token !== env.supportAgentToken) {
        socket.emit('support:error', { message: 'Unauthorized agent' })
        return
      }

      socket.data.role = 'agent'
      void socket.join('support-agents')
      socket.emit('support:agent:joined')
    })

    socket.on('support:agent:reply', async (payload: { sessionId?: string; text?: string }) => {
      if (socket.data.role !== 'agent') {
        socket.emit('support:error', { message: 'Unauthorized agent' })
        return
      }

      const sessionId = payload?.sessionId?.trim()
      const text = payload?.text?.trim()

      if (!sessionId || !text) {
        socket.emit('support:error', { message: 'Invalid reply payload' })
        return
      }

      try {
        const message = await chatService.createMessage(sessionId, 'agent', text)
        io.to(sessionId).emit('support:message', { message })
      } catch (error) {
        console.error('[socket] support:agent:reply failed', error)
        socket.emit('support:error', { message: 'Failed to send reply' })
      }
    })
  })

  console.log('[socket] support chat initialized')

  return io
}
