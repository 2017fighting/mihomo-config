import { z } from 'zod'
import { BasicOptionSchema, CommonTLSFieldsSchema, ClientFingerprintSchema, ECHOptionsSchema, RealityOptionsSchema, HTTPOptionsSchema, HTTP2OptionsSchema, GrpcOptionsSchema, WSOptionsSchema, XHTTPOptionsSchema } from './common.js'

export const VlessOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int(),
  uuid: z.string(),
  flow: z.enum(['xtls-rprx-vision', '']).optional(),
  tls: z.boolean().optional(),
  udp: z.boolean().optional(),
  'packet-addr': z.boolean().optional(),
  xudp: z.boolean().optional(),
  'packet-encoding': z.enum(['packetaddr', 'xudp', 'packet']).optional(),
  encryption: z.string().optional(),
  network: z.enum(['ws', 'http', 'h2', 'grpc', 'xhttp', 'tcp']).optional(),
  'ech-opts': ECHOptionsSchema.optional(),
  'reality-opts': RealityOptionsSchema.optional(),
  'http-opts': HTTPOptionsSchema.optional(),
  'h2-opts': HTTP2OptionsSchema.optional(),
  'grpc-opts': GrpcOptionsSchema.optional(),
  'ws-opts': WSOptionsSchema.optional(),
  'xhttp-opts': XHTTPOptionsSchema.optional(),
  'ws-headers': z.record(z.string()).optional(),
  ...CommonTLSFieldsSchema,
  servername: z.string().optional(),
  'client-fingerprint': ClientFingerprintSchema.optional(),
})

export type VlessOptions = z.input<typeof VlessOptionsSchema>

export function vless(options: VlessOptions) {
  return { type: 'vless' as const, ...VlessOptionsSchema.parse(options) }
}
