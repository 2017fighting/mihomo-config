import { z } from 'zod'

// --- Enums ---

export const IpVersionSchema = z.enum(['ipv4', 'ipv6', 'ipv4-prefer', 'ipv6-prefer'])
export type IpVersion = z.infer<typeof IpVersionSchema>

export const ClientFingerprintSchema = z.enum([
  'chrome', 'firefox', 'safari', 'ios', 'android', 'edge',
  '360', 'qq', 'random', 'randomized',
])
export type ClientFingerprint = z.infer<typeof ClientFingerprintSchema>

// --- Shared BasicOption (every proxy type inherits these) ---

export const BasicOptionSchema = z.object({
  tfo: z.boolean().optional(),
  mptcp: z.boolean().optional(),
  'interface-name': z.string().optional(),
  'routing-mark': z.number().int().optional(),
  'ip-version': IpVersionSchema.optional(),
  'dialer-proxy': z.string().optional(),
})
export type BasicOption = z.input<typeof BasicOptionSchema>

// --- Transport sub-options ---

export const RealityOptionsSchema = z.object({
  'public-key': z.string(),
  'short-id': z.string().optional(),
  'support-x25519mlkem768': z.boolean().optional(),
})
export type RealityOptions = z.input<typeof RealityOptionsSchema>

export const ECHOptionsSchema = z.object({
  enable: z.boolean().optional(),
  config: z.string().optional(),
  'query-server-name': z.string().optional(),
})
export type ECHOptions = z.input<typeof ECHOptionsSchema>

export const HTTPOptionsSchema = z.object({
  method: z.string().optional(),
  path: z.array(z.string()).optional(),
  headers: z.record(z.array(z.string())).optional(),
})
export type HTTPOptions = z.input<typeof HTTPOptionsSchema>

export const HTTP2OptionsSchema = z.object({
  host: z.array(z.string()).optional(),
  path: z.string().optional(),
})
export type HTTP2Options = z.input<typeof HTTP2OptionsSchema>

export const GrpcOptionsSchema = z.object({
  'grpc-service-name': z.string().optional(),
  'grpc-user-agent': z.string().optional(),
  'ping-interval': z.number().int().optional(),
  'max-connections': z.number().int().optional(),
  'min-streams': z.number().int().optional(),
  'max-streams': z.number().int().optional(),
})
export type GrpcOptions = z.input<typeof GrpcOptionsSchema>

export const WSOptionsSchema = z.object({
  path: z.string().optional(),
  headers: z.record(z.string()).optional(),
  'max-early-data': z.number().int().optional(),
  'early-data-header-name': z.string().optional(),
  'v2ray-http-upgrade': z.boolean().optional(),
  'v2ray-http-upgrade-fast-open': z.boolean().optional(),
})
export type WSOptions = z.input<typeof WSOptionsSchema>

export const XHTTPReuseSettingsSchema = z.object({
  'max-concurrency': z.string().optional(),
  'max-connections': z.string().optional(),
  'min-streams': z.string().optional(),
  'max-streams': z.string().optional(),
  'max-multiplexed': z.string().optional(),
})
export type XHTTPReuseSettings = z.input<typeof XHTTPReuseSettingsSchema>

export const XHTTPDownloadSettingsSchema = z.object({
  'max-connections': z.string().optional(),
  'max-streams': z.string().optional(),
})
export type XHTTPDownloadSettings = z.input<typeof XHTTPDownloadSettingsSchema>

export const XHTTPOptionsSchema = z.object({
  path: z.string().optional(),
  host: z.string().optional(),
  mode: z.enum(['packet-up', 'stream-up', 'stream-one']).optional(),
  headers: z.record(z.string()).optional(),
  'no-grpc-header': z.boolean().optional(),
  'x-padding-bytes': z.string().optional(),
  'x-padding-obfs-mode': z.boolean().optional(),
  'x-padding-key': z.string().optional(),
  'x-padding-header': z.string().optional(),
  'x-padding-placement': z.string().optional(),
  'x-padding-method': z.string().optional(),
  'uplink-http-method': z.string().optional(),
  'session-placement': z.string().optional(),
  'session-key': z.string().optional(),
  'seq-placement': z.string().optional(),
  'seq-key': z.string().optional(),
  'uplink-data-placement': z.string().optional(),
  'uplink-data-key': z.string().optional(),
  'uplink-chunk-size': z.string().optional(),
  'sc-max-each-post-bytes': z.string().optional(),
  'sc-min-posts-interval-ms': z.string().optional(),
  'reuse-settings': XHTTPReuseSettingsSchema.optional(),
  'download-settings': XHTTPDownloadSettingsSchema.optional(),
})
export type XHTTPOptions = z.input<typeof XHTTPOptionsSchema>

// --- Common TLS fields (shared by many proxy types) ---

export const CommonTLSFieldsSchema = {
  alpn: z.array(z.string()).optional(),
  'skip-cert-verify': z.boolean().optional(),
  fingerprint: z.string().optional(),
  certificate: z.string().optional(),
  'private-key': z.string().optional(),
}

// --- Helper to clean undefined values from output ---

export function cleanObject<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value
    }
  }
  return result
}
