import { z } from 'zod'
import { BasicOptionSchema } from './common.js'

export const TuicOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  token: z.string(),
  'udp-relay-mode': z.enum(['native', 'quic']).optional(),
  'congestion-controller': z.string().optional(),
  'skip-cert-verify': z.boolean().optional(),
  'max-udp-relay-packet-size': z.number().int().min(1).optional(),
})

export type TuicOptions = z.input<typeof TuicOptionsSchema>

export function tuic(options: TuicOptions) {
  return { type: 'tuic' as const, ...TuicOptionsSchema.parse(options) }
}