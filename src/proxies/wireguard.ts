import { z } from "zod";
import { BasicOptionSchema } from "./common.js";

export const WireGuardOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  ip: z.string(),
  ipv6: z.string(),
  "private-key": z.string(),
  workers: z.number().int().min(1),
  mtu: z.number().int().min(1),
  udp: z.boolean(),
  "persistent-keepalive": z.number().int().min(1),
  "amnezia-wg-option": z
    .object({
      jc: z.number().int().min(1),
      jmin: z.number().int().min(1),
      jmax: z.number().int().min(1),
      s1: z.number().int().min(1),
      s2: z.number().int().min(1),
      h1: z.number().int().min(1),
      h2: z.number().int().min(1),
      h3: z.number().int().min(1),
      h4: z.number().int().min(1),
    })
    .optional(),
  peers: z.array(
    z.object({
      server: z.string(),
      port: z.number().int().min(1).max(65535),
      "public-key": z.string(),
      "pre-shared-key": z.string(),
      reserved: z.array(z.number().int().min(0).max(255)).optional(),
      "allowed-ips": z.array(z.string()),
    }),
  ),
  "remote-dns-resolve": z.boolean(),
  dns: z.array(z.string()),
  "refresh-server-ip-interval": z.number().int().min(1),
});

export type WireGuardOptions = z.input<typeof WireGuardOptionsSchema>;

export function wireguard(options: WireGuardOptions) {
  return {
    type: "wireguard" as const,
    ...WireGuardOptionsSchema.parse(options),
  };
}
