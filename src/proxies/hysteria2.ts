import { z } from 'zod'
import { BasicOptionSchema, CommonTLSFieldsSchema, ClientFingerprintSchema, ECHOptionsSchema, WSOptionsSchema, HTTPOptionsSchema, HTTP2OptionsSchema, GrpcOptionsSchema, XHTTPOptionsSchema } from './common.js'

export const Hysteria2OptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().optional(),
  ports: z.string().optional(),
  'hop-interval': z.string().optional(),
  up: z.string().optional(),
  down: z.string().optional(),
  password: z.string().optional(),
  obfs: z.string().optional(),
  'obfs-password': z.string().optional(),
  sni: z.string().optional(),
  'ech-opts': ECHOptionsSchema.optional(),
  ...CommonTLSFieldsSchema,
  cwnd: z.number().int().optional(),
  'bbr-profile': z.string().optional(),
  'udp-mtu': z.number().int().optional(),
  'realm-opts': z.object({
    enable: z.boolean().optional(),
    server: z.string().optional(),
    port: z.number().int().optional(),
  }).optional(),
  'initial-stream-receive-window': z.number().int().optional(),
  'max-stream-receive-window': z.number().int().optional(),
  'initial-connection-receive-window': z.number().int().optional(),
  'max-connection-receive-window': z.number().int().optional(),
})

export type Hysteria2Options = z.input<typeof Hysteria2OptionsSchema>

export function hysteria2(options: Hysteria2Options) {
  return { type: 'hysteria2' as const, ...Hysteria2OptionsSchema.parse(options) }
}