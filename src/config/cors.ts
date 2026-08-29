import { env } from './env'

export function resolveCorsOrigin(): boolean | string | string[] {
  if (env.corsOrigin === '*') return true

  const origins = env.corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

  if (origins.length === 1) return origins[0]

  return origins
}
