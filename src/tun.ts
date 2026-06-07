import { z } from 'zod'

const TunStackSchema = z.enum(['gvisor', 'system', 'mixed'])

export const tunSchema = z.object({
  enable: z.boolean().optional(),
  device: z.string().optional(),
  stack: TunStackSchema.optional(),
  'dns-hijack': z.string().array().optional(),
  'auto-route': z.boolean().optional(),
  'auto-detect-interface': z.boolean().optional(),
  mtu: z.number().optional(),
  gso: z.boolean().optional(),
  'gso-max-size': z.number().optional(),
  'inet4-address': z.string().array().optional(),
  'inet6-address': z.string().array().optional(),
  'strict-route': z.boolean().optional(),
  'auto-redirect': z.boolean().optional(),
  'route-address': z.string().array().optional(),
  'route-exclude-address': z.string().array().optional(),
  'include-interface': z.string().array().optional(),
  'exclude-interface': z.string().array().optional(),
  'include-uid': z.number().array().optional(),
  'exclude-uid': z.number().array().optional(),
  'include-uid-range': z.string().array().optional(),
  'exclude-uid-range': z.string().array().optional(),
  'endpoint-independent-nat': z.boolean().optional(),
  'udp-timeout': z.number().optional(),
  'disable-icmp-forwarding': z.boolean().optional(),
  'file-descriptor': z.number().optional(),
})

export type TunOptions = z.input<typeof tunSchema>

export function tun(options: TunOptions) {
  return tunSchema.parse(options)
}