import { z } from 'zod'
import { BasicOptionSchema, CommonTLSFieldsSchema } from './common.js'

export const SnellOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  psk: z.string(),
  udp: z.boolean(),
  version: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  'obfs-opts': z.object({
    mode: z.enum(['tls', 'http']),
    host: z.string(),
  }).optional(),
  ...CommonTLSFieldsSchema,
})

export type SnellOptions = z.input<typeof SnellOptionsSchema>

export function snell(options: SnellOptions) {
  return { type: 'snell' as const, ...SnellOptionsSchema.parse(options) }
}