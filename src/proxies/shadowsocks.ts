import { z } from 'zod'
import { BasicOptionSchema, ClientFingerprintSchema, ECHOptionsSchema, WSOptionsSchema, HTTPOptionsSchema, HTTP2OptionsSchema, GrpcOptionsSchema, XHTTPOptionsSchema } from './common.js'

export const ShadowsocksOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int(),
  password: z.string(),
  cipher: z.string(),
  udp: z.boolean().optional(),
  plugin: z.enum(['obfs', 'shadow-tls', 'v2ray-plugin', '']).optional(),
  'plugin-opts': z.record(z.string(), z.unknown()).optional(),
  'udp-over-tcp': z.boolean().optional(),
  'udp-over-tcp-version': z.number().int().optional(),
  'ech-opts': ECHOptionsSchema.optional(),
  'ws-opts': WSOptionsSchema.optional(),
  'http-opts': HTTPOptionsSchema.optional(),
  'h2-opts': HTTP2OptionsSchema.optional(),
  'grpc-opts': GrpcOptionsSchema.optional(),
  'xhttp-opts': XHTTPOptionsSchema.optional(),
  'client-fingerprint': ClientFingerprintSchema.optional(),
})

export type ShadowsocksOptions = z.input<typeof ShadowsocksOptionsSchema>

export function shadowsocks(options: ShadowsocksOptions) {
  return { type: 'ss' as const, ...ShadowsocksOptionsSchema.parse(options) }
}
