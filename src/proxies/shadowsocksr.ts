import { z } from "zod";
import { BasicOptionSchema } from "./common.js";

export const ShadowsocksrOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  password: z.string(),
  cipher: z.string(),
  obfs: z.string().optional(),
  "obfs-param": z.string().optional(),
  protocol: z.string().optional(),
  "protocol-param": z.string().optional(),
  udp: z.boolean().optional(),
});

export type ShadowsocksrOptions = z.input<typeof ShadowsocksrOptionsSchema>;

export function shadowsocksr(options: ShadowsocksrOptions) {
  return {
    type: "shadowsocksr" as const,
    ...ShadowsocksrOptionsSchema.parse(options),
  };
}
