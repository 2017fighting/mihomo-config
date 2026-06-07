import { z } from "zod";

export const UrlTestGroupSchema = z.object({
  name: z.string(),
  type: z.literal("url-test"),
  proxies: z.array(z.string()).optional(),
  use: z.array(z.string()).optional(),
  "include-all": z.boolean().optional(),
  "include-all-proxies": z.boolean().optional(),
  filter: z.string().optional(),
  "exclude-filter": z.string().optional(),
  "exclude-type": z.string().optional(),
  hidden: z.boolean().optional(),
  icon: z.string().optional(),
  url: z.string().optional(),
  "expected-status": z.string().optional(),
  "disable-udp": z.boolean().optional(),
  tolerance: z.number().optional(),
  interval: z.number().optional(),
  lazy: z.boolean().optional(),
});

export type UrlTestGroupOptions = z.input<typeof UrlTestGroupSchema>;

export function urlTest(options: UrlTestGroupOptions) {
  return UrlTestGroupSchema.parse(options);
}
