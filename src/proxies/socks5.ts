import { z } from "zod";
import { BasicOptionSchema, CommonTLSFieldsSchema } from "./common.js";

export const Socks5OptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  username: z.string().optional(),
  password: z.string().optional(),
  udp: z.boolean(),
  ...CommonTLSFieldsSchema,
});

export type Socks5Options = z.input<typeof Socks5OptionsSchema>;

export function socks5(options: Socks5Options) {
  return { type: "socks5" as const, ...Socks5OptionsSchema.parse(options) };
}
