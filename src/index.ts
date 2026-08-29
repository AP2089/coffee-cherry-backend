import { createServer } from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { env } from './config/env'
import { connectDatabase } from './config/database'
import routes from './routes'
import { errorHandler, notFoundHandler } from './middleware/errorHandler'
import { initSupportSocket } from './sockets/support.socket'

async function bootstrap(): Promise<void> {
  await connectDatabase()

  const app = express()

  app.use(cors({ origin: env.corsOrigin === '*' ? true : env.corsOrigin }))
  app.use(express.json())
  app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))

  app.get('/', (_req, res) => {
    res.json({ name: 'coffee cherry api', version: '1.0.0' })
  })

  app.use('/api', routes)
  app.use(notFoundHandler)
  app.use(errorHandler)

  const httpServer = createServer(app)
  initSupportSocket(httpServer)

  httpServer.listen(env.port, '0.0.0.0', () => {
    console.log(`[backend] listening on 0.0.0.0:${env.port}`)
  })
}

bootstrap().catch((error) => {
  console.error('[backend] failed to start', error)
  process.exit(1)
})
