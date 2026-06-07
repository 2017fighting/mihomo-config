import { z } from 'zod'

export const RelayGroupSchema = z.object({
  name: z.string(),
  type: z.literal('relay'),
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
})

export type RelayGroupOptions = z.input<typeof RelayGroupSchema>

export function relay(options: RelayGroupOptions) {
  return RelayGroupSchema.parse(options)
}