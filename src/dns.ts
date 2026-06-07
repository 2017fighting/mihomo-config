import { z } from 'zod'

export const DnsSchema = z.object({
  enable: z.boolean().optional(),
  'prefer-h3': z.boolean().optional(),
  ipv6: z.boolean().optional(),
  'ipv6-timeout': z.number().optional(),
  'use-hosts': z.boolean().optional(),
  'use-system-hosts': z.boolean().optional(),
  'respect-rules': z.boolean().optional(),
  listen: z.string().optional(),
  'enhanced-mode': z.enum(['normal', 'fake-ip', 'redir-host']).optional(),
  'fake-ip-range': z.string().optional(),
  'fake-ip-range6': z.string().optional(),
  'fake-ip-filter': z.array(z.string()).optional(),
  'fake-ip-filter-mode': z.enum(['blacklist', 'whitelist', 'rule']).optional(),
  'fake-ip-ttl': z.number().optional(),
  'default-nameserver': z.array(z.string()).optional(),
  nameserver: z.array(z.string()).optional(),
  fallback: z.array(z.string()).optional(),
  'fallback-filter': z.object({
    geoip: z.boolean().optional(),
    'geoip-code': z.string().optional(),
    ipcidr: z.array(z.string()).optional(),
    domain: z.array(z.string()).optional(),
  }).optional(),
  'cache-algorithm': z.enum(['lru', 'arc']).optional(),
  'cache-max-size': z.number().optional(),
  'nameserver-policy': z.record(z.any()).optional(),
  'proxy-server-nameserver': z.array(z.string()).optional(),
  'proxy-server-nameserver-policy': z.record(z.any()).optional(),
  'direct-nameserver': z.array(z.string()).optional(),
  'direct-nameserver-follow-policy': z.boolean().optional(),
})

export type DnsOptions = z.input<typeof DnsSchema>

export function dns(options: DnsOptions) {
  return DnsSchema.parse(options)
}
