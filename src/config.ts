import { z } from "zod";

export const ConfigSchema = z.object({
  port: z.number().optional(),
  "socks-port": z.number().optional(),
  "redir-port": z.number().optional(),
  "tproxy-port": z.number().optional(),
  "mixed-port": z.number().optional(),
  "allow-lan": z.boolean().optional(),
  "bind-address": z.string().optional(),
  mode: z.enum(["global", "rule", "direct"]).optional(),
  "log-level": z
    .enum(["debug", "info", "warning", "error", "silent"])
    .optional(),
  ipv6: z.boolean().optional(),
  "external-controller": z.string().optional(),
  "external-ui": z.string().optional(),
  "external-ui-url": z.string().optional(),
  "external-ui-name": z.string().optional(),
  secret: z.string().optional(),
  "unified-delay": z.boolean().optional(),
  "tcp-concurrent": z.boolean().optional(),
  "interface-name": z.string().optional(),
  "routing-mark": z.number().optional(),
  "find-process-mode": z.enum(["strict", "always", "off"]).optional(),
  "global-client-fingerprint": z.string().optional(),
  "global-ua": z.string().optional(),
  "etag-support": z.boolean().optional(),
  "keep-alive-idle": z.number().optional(),
  "keep-alive-interval": z.number().optional(),
  "disable-keep-alive": z.boolean().optional(),
  "geo-auto-update": z.boolean().optional(),
  "geo-update-interval": z.number().optional(),
  "geodata-mode": z.boolean().optional(),
  "geodata-loader": z.enum(["memconservative", "memory"]).optional(),
  "geosite-matcher": z.string().optional(),
  authentication: z.string().array().optional(),
  "inbound-tfo": z.boolean().optional(),
  "inbound-mptcp": z.boolean().optional(),

  // Sub-configs (accept any object, user is responsible for using the sub-factories)
  dns: z.record(z.any()).optional(),
  sniffer: z.record(z.any()).optional(),
  tun: z.record(z.any()).optional(),
  experimental: z.record(z.any()).optional(),

  // Arrays
  proxies: z.record(z.any()).array().optional(),
  "proxy-groups": z.record(z.any()).array().optional(),
  "proxy-providers": z.record(z.record(z.any())).optional(),
  rules: z.string().array().optional(),
  "rule-providers": z.record(z.record(z.any())).optional(),
  "sub-rules": z.record(z.string().array()).optional(),
  listeners: z.record(z.any()).array().optional(),
  hosts: z.record(z.any()).optional(),
  profile: z
    .object({
      "store-selected": z.boolean().optional(),
      "store-fake-ip": z.boolean().optional(),
    })
    .optional(),
});

export type ConfigOptions = z.input<typeof ConfigSchema>;

export function createConfig(options: ConfigOptions) {
  return ConfigSchema.parse(options);
}
