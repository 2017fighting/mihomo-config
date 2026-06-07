import { z } from "zod";
import {
  BasicOptionSchema,
  CommonTLSFieldsSchema,
  ClientFingerprintSchema,
  ECHOptionsSchema,
  WSOptionsSchema,
  HTTPOptionsSchema,
  HTTP2OptionsSchema,
  GrpcOptionsSchema,
  XHTTPOptionsSchema,
} from "./common.js";

export const VmessOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int(),
  uuid: z.string(),
  alterId: z.number().int().optional(),
  cipher: z
    .enum(["auto", "aes-128-gcm", "chacha20-poly1305", "none", "zero"])
    .optional(),
  udp: z.boolean().optional(),
  network: z.enum(["ws", "http", "h2", "grpc"]).optional(),
  tls: z.boolean().optional(),
  ...CommonTLSFieldsSchema,
  servername: z.string().optional(),
  "ech-opts": ECHOptionsSchema.optional(),
  "reality-opts": z.record(z.string(), z.unknown()).optional(),
  "http-opts": HTTPOptionsSchema.optional(),
  "h2-opts": HTTP2OptionsSchema.optional(),
  "grpc-opts": GrpcOptionsSchema.optional(),
  "ws-opts": WSOptionsSchema.optional(),
  "packet-addr": z.boolean().optional(),
  xudp: z.boolean().optional(),
  "packet-encoding": z.enum(["packetaddr", "xudp", "packet"]).optional(),
  "global-padding": z.boolean().optional(),
  "authenticated-length": z.boolean().optional(),
  "client-fingerprint": ClientFingerprintSchema.optional(),
});

export type VmessOptions = z.input<typeof VmessOptionsSchema>;

export function vmess(options: VmessOptions) {
  return { type: "vmess" as const, ...VmessOptionsSchema.parse(options) };
}
