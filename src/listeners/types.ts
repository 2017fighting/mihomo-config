import { z } from 'zod'

const ListenerTypeSchema = z.enum([
  'socks',
  'http',
  'tproxy',
  'redir',
  'mixed',
  'tunnel',
  'tun',
  'shadowsocks',
  'vmess',
  'vless',
  'trojan',
  'hysteria2',
  'tuic',
  'anytls',
])

export const listenerSchema = z.object({
  name: z.string(),
  type: ListenerTypeSchema,
  port: z.number().optional(),
  listen: z.string().optional(),
  // Extra fields for different listener types - passthrough
  extra: z.record(z.any()).optional(),
})

export type ListenerOptions = z.input<typeof listenerSchema>

export function listener(options: ListenerOptions) {
  return listenerSchema.parse(options)
}