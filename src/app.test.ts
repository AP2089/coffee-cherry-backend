import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { createApp } from './app'

describe('HTTP app', () => {
  const app = createApp()

  it('GET / returns api info', async () => {
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ name: 'coffee cherry api', version: '1.0.0' })
  })

  it('GET /api/health responds', async () => {
    const response = await request(app).get('/api/health')

    expect([200, 503]).toContain(response.status)
  })
})
