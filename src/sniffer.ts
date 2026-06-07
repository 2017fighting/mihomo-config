import { z } from "zod";

export const SnifferSchema = z.object({
  enable: z.boolean().optional(),
  "override-destination": z.boolean().optional(),
  "force-domain": z.array(z.string()).optional(),
  "skip-domain": z.array(z.string()).optional(),
  "skip-src-address": z.array(z.string()).optional(),
  "skip-dst-address": z.array(z.string()).optional(),
  "force-dns-mapping": z.boolean().optional(),
  "parse-pure-ip": z.boolean().optional(),
  sniff: z
    .record(
      z.enum(["HTTP", "TLS", "QUIC"]),
      z.object({
        ports: z.array(z.string()),
        "override-destination": z.boolean().optional(),
      }),
    )
    .optional(),
});

export type SnifferOptions = z.input<typeof SnifferSchema>;

export function sniffer(options: SnifferOptions) {
  return SnifferSchema.parse(options);
}
