import { z } from 'zod'

const ProxyProviderTypeSchema = z.enum(['file', 'http', 'inline'])

export const proxyProviderSchema = z.object({
  type: ProxyProviderTypeSchema,
  path: z.string().optional(),
  url: z.string().optional(),
  proxy: z.string().optional(),
  interval: z.number().optional(),
  filter: z.string().optional(),
  'exclude-filter': z.string().optional(),
  'exclude-type': z.string().optional(),
  'dialer-proxy': z.string().optional(),
  'size-limit': z.number().optional(),
  payload: z.array(z.any()).optional(),
  'health-check': z.object({
    enable: z.boolean().optional(),
    url: z.string().optional(),
    interval: z.number().optional(),
    timeout: z.number().optional(),
    lazy: z.boolean().optional(),
    'expected-status': z.string().optional(),
  }).optional(),
  override: z.object({
    'proxy-name': z.array(z.object({
      pattern: z.string(),
      target: z.string(),
    })).optional(),
    'dialer-proxy': z.string().optional(),
  }).optional(),
  header: z.record(z.string().array()).optional(),
})

export type ProxyProviderOptions = z.input<typeof proxyProviderSchema>

export function proxyProvider(options: ProxyProviderOptions) {
  return proxyProviderSchema.parse(options)
}