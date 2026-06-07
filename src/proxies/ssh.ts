import { z } from "zod";
import { BasicOptionSchema } from "./common.js";

export const SSHOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int().min(1).max(65535),
  username: z.string(),
  password: z.string().optional(),
  "private-key": z.string().optional(),
  "private-key-passphrase": z.string().optional(),
  "host-key": z.array(z.string()).optional(),
  "host-key-algorithms": z.array(z.string()).optional(),
});

export type SSHOptions = z.input<typeof SSHOptionsSchema>;

export function ssh(options: SSHOptions) {
  return { type: "ssh" as const, ...SSHOptionsSchema.parse(options) };
}
