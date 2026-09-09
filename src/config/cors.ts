import { env } from './env'

const LOCAL_FRONTEND_ORIGIN =
  /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/

type CorsCallback = (err: Error | null, allow?: boolean) => void

export function resolveCorsOrigin():
  boolean | string | string[] | ((origin: string | undefined, callback: CorsCallback) => void) {
  if (env.corsOrigin === '*') return true

  const origins = env.corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  return (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (origins.includes(origin)) {
      callback(null, true)
      return
    }

    if (env.corsRelaxedLocal && LOCAL_FRONTEND_ORIGIN.test(origin)) {
      callback(null, true)
      return
    }

    // false — корректный отказ CORS без 500 на preflight
    callback(null, false)
  }
}
