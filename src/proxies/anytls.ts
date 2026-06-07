import { z } from 'zod'
import { BasicOptionSchema, ClientFingerprintSchema, ECHOptionsSchema } from './common.js'

export const AnyTLSOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  password: z.string(),
  alpn: z.array(z.string()).optional(),
  sni: z.string().optional(),
  'ech-opts': ECHOptionsSchema.optional(),
  'client-fingerprint': ClientFingerprintSchema.optional(),
  'skip-cert-verify': z.boolean().optional(),
  fingerprint: z.string().optional(),
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
  udp: z.boolean().optional(),
  'idle-session-check-interval': z.number().int().min(1).optional(),
  'idle-session-timeout': z.number().int().min(1).optional(),
  'min-idle-session': z.number().int().min(1).optional(),
})

export type AnyTLSOptions = z.input<typeof AnyTLSOptionsSchema>

export function anytls(options: AnyTLSOptions) {
  return { type: 'anytls' as const, ...AnyTLSOptionsSchema.parse(options) }
}