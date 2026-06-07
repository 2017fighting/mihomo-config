import { z } from 'zod'

export const FallbackGroupSchema = z.object({
  name: z.string(),
  type: z.literal('fallback'),
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
  interval: z.number().optional(),
  lazy: z.boolean().optional(),
})

export type FallbackGroupOptions = z.input<typeof FallbackGroupSchema>

export function fallback(options: FallbackGroupOptions) {
  return FallbackGroupSchema.parse(options)
}