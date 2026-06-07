import { z } from 'zod'
import { BasicOptionSchema } from './common.js'

export const HttpProxyOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  username: z.string().optional(),
  password: z.string().optional(),
  tls: z.boolean().optional(),
  'skip-cert-verify': z.boolean().optional(),
  fingerprint: z.string().optional(),
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
  headers: z.record(z.array(z.string())).optional(),
})

export type HttpProxyOptions = z.input<typeof HttpProxyOptionsSchema>

export function http(options: HttpProxyOptions) {
  return { type: 'http' as const, ...HttpProxyOptionsSchema.parse(options) }
}