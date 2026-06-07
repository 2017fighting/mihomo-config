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

export const TrojanOptionsSchema = BasicOptionSchema.extend({
  name: z.string(),
  server: z.string(),
  port: z.number().int(),
  password: z.string(),
  sni: z.string().optional(),
  ...CommonTLSFieldsSchema,
  udp: z.boolean().optional(),
  network: z.enum(["ws", "grpc"]).optional(),
  "ech-opts": ECHOptionsSchema.optional(),
  "reality-opts": z.record(z.string(), z.unknown()).optional(),
  "grpc-opts": GrpcOptionsSchema.optional(),
  "ws-opts": WSOptionsSchema.optional(),
  "ss-opts": z
    .object({
      enabled: z.boolean().optional(),
      method: z.string().optional(),
      password: z.string().optional(),
    })
    .optional(),
  "client-fingerprint": ClientFingerprintSchema.optional(),
});

export type TrojanOptions = z.input<typeof TrojanOptionsSchema>;

export function trojan(options: TrojanOptions) {
  return { type: "trojan" as const, ...TrojanOptionsSchema.parse(options) };
}
