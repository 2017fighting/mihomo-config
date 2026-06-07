import { z } from 'zod'

const RuleProviderTypeSchema = z.enum(['file', 'http', 'inline'])
const RuleProviderBehaviorSchema = z.enum(['domain', 'ipcidr', 'classical'])
const RuleProviderFormatSchema = z.enum(['yaml', 'text', 'mrs'])

export const ruleProviderSchema = z.object({
  type: RuleProviderTypeSchema,
  behavior: RuleProviderBehaviorSchema,
  format: RuleProviderFormatSchema,
  path: z.string().optional(),
  url: z.string().optional(),
  proxy: z.string().optional(),
  interval: z.number().optional(),
  'size-limit': z.number().optional(),
  payload: z.string().array().optional(),
  header: z.record(z.string().array()).optional(),
})

export type RuleProviderOptions = z.input<typeof ruleProviderSchema>

export function ruleProvider(options: RuleProviderOptions) {
  return ruleProviderSchema.parse(options)
}