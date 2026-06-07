import { z } from 'zod'
import { BasicOptionSchema, CommonTLSFieldsSchema, ClientFingerprintSchema, ECHOptionsSchema, WSOptionsSchema, HTTPOptionsSchema, HTTP2OptionsSchema, GrpcOptionsSchema, XHTTPOptionsSchema } from './common.js'

export const HysteriaOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().optional(),
  ports: z.string().optional(),
  protocol: z.enum(['udp']).optional(),
  'obfs-protocol': z.string().optional(),
  up: z.string(),
  down: z.string(),
  'up-speed': z.number().int().optional(),
  'down-speed': z.number().int().optional(),
  auth: z.string().optional(),
  'auth-str': z.string().optional(),
  obfs: z.string().optional(),
  sni: z.string().optional(),
  'ech-opts': ECHOptionsSchema.optional(),
  ...CommonTLSFieldsSchema,
  'recv-window-conn': z.number().int().optional(),
  'recv-window': z.number().int().optional(),
  'disable-mtu-discovery': z.boolean().optional(),
  'fast-open': z.boolean().optional(),
  'hop-interval': z.number().int().optional(),
})

export type HysteriaOptions = z.input<typeof HysteriaOptionsSchema>

export function hysteria(options: HysteriaOptions) {
  return { type: 'hysteria' as const, ...HysteriaOptionsSchema.parse(options) }
}