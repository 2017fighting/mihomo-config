import { z } from 'zod'

export const LoadBalanceGroupSchema = z.object({
  name: z.string(),
  type: z.literal('load-balance'),
  proxies: z.array(z.string()).optional(),
  use: z.array(z.string()).optional(),
  'include-all': z.boolean().optional(),
  'include-all-proxies': z.boolean().optional(),
  filter: z.string().optional(),
  'exclude-filter': z.string().optional(),
  'exclude-type': z.string().optional(),
  hidden: z.boolean().optional(),
  icon: z.string().optional(),
  url: z.string().optional(),
  'expected-status': z.string().optional(),
  'disable-udp': z.boolean().optional(),
  strategy: z.enum(['consistent-hashing', 'round-robin', 'sticky-sessions']).optional(),
  interval: z.number().optional(),
})

export type LoadBalanceGroupOptions = z.input<typeof LoadBalanceGroupSchema>

export function loadBalance(options: LoadBalanceGroupOptions) {
  return LoadBalanceGroupSchema.parse(options)
}