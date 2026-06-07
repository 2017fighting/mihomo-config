import { z } from "zod";

export const experimentalSchema = z.object({
  fingerprints: z.string().array().optional(),
  "quic-go-disable-gso": z.boolean().optional(),
  "quic-go-disable-ecn": z.boolean().optional(),
  "dialer-ip4p-convert": z.boolean().optional(),
});

export type ExperimentalOptions = z.input<typeof experimentalSchema>;

export function experimental(options: ExperimentalOptions) {
  return experimentalSchema.parse(options);
}
