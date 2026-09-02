import { z } from "zod";

/**
 * 时长字段:支持 "24h" / "10s" / "9999ms" 字符串或纯数字(秒)
 */
const DurationSchema = z.union([z.string(), z.number()]);

/**
 * 内嵌测速器配置 (dns.preferred-ip[].speedtest):
 * 强制直连 tcping + 下载测速筛出优选池。
 */
export const PreferredIPSpeedTestOptionsSchema = z.object({
 /** 下载测速地址,留空用 speed.cloudflare.com,建议自建 */
 url: z.string().optional(),
 /** 定时重测,默认 24h,最小 1m */
 interval: DurationSchema.optional(),
 /** true 则仅按延迟排序,不做下载测速 */
 "disable-download": z.boolean().optional(),
 /** tcping 并发,默认 200,范围 [1, 1000] */
 threads: z.number().int().min(1).max(1000).optional(),
 /** tcping 端口,默认 443 */
 "tcp-port": z.number().int().min(1).max(65535).optional(),
 /** tcping 次数,默认 4 */
 "ping-times": z.number().int().min(1).optional(),
 /** 参与下载测速的数量,默认 10 */
 "download-count": z.number().int().min(1).optional(),
 /** 单 IP 下载时长,默认 10s */
 "download-time": DurationSchema.optional(),
 /** 平均延迟上限 */
 "max-delay": DurationSchema.optional(),
 /** 平均延迟下限 */
 "min-delay": DurationSchema.optional(),
 /** 丢包率上限 [0, 1],1 为不过滤 */
 "max-loss-rate": z.number().min(0).max(1).optional(),
 /** 下载速度下限 MB/s */
 "min-speed": z.number().min(0).optional(),
});
export type PreferredIPSpeedTestOptions = z.input<
 typeof PreferredIPSpeedTestOptionsSchema
>;

/**
 * IP 优选条目 (dns.preferred-ip[]):DNS 答案命中 cidr 段时,
 * 替换为测速优选池前 N 条;池未就绪(首次测速完成前)原样透传。
 * cidr 列表同时驱动匹配与测速候选,v4 段建议从
 * https://www.cloudflare.com/ips-v4 获取。
 */
export const PreferredIPOptionsSchema = z.object({
 /** 持久化键,不能重复 */
 name: z.string().min(1),
 cidr: z.string().array().min(1),
 /** replace(默认,用 v6 优选池替换) / block(命中返回空答案);v6 段需列出后 AAAA 才会命中 */
 ipv6: z.enum(["replace", "block"]).optional(),
 /** 改写后返回的前 N 条,默认 5,范围 [1, 16] */
 "answer-count": z.number().int().min(1).max(16).optional(),
 /** 改写记录 TTL 上限(秒),默认 60 */
 "ttl-cap": z.number().int().min(1).optional(),
 /** 测速结果持久化到 cache.db,重启后立即生效,默认 true */
 persist: z.boolean().optional(),
 speedtest: PreferredIPSpeedTestOptionsSchema.optional(),
});
export type PreferredIPOptions = z.input<typeof PreferredIPOptionsSchema>;

// name 是持久化键,重复会使后者覆盖前者,镜像上游拒绝重复
const PreferredIPListSchema = z
 .array(PreferredIPOptionsSchema)
 .refine(
  (entries) => new Set(entries.map((e) => e.name)).size === entries.length,
  {
   message: "dns.preferred-ip: name is the persistence key and must be unique",
  },
 );

export const DnsSchema = z.object({
 enable: z.boolean().optional(),
 "prefer-h3": z.boolean().optional(),
 ipv6: z.boolean().optional(),
 "ipv6-timeout": z.number().optional(),
 "use-hosts": z.boolean().optional(),
 "use-system-hosts": z.boolean().optional(),
 "respect-rules": z.boolean().optional(),
 listen: z.string().optional(),
 "enhanced-mode": z.enum(["normal", "fake-ip", "redir-host"]).optional(),
 "fake-ip-range": z.string().optional(),
 "fake-ip-range6": z.string().optional(),
 "fake-ip-filter": z.array(z.string()).optional(),
 "fake-ip-filter-mode": z.enum(["blacklist", "whitelist", "rule"]).optional(),
 "fake-ip-ttl": z.number().optional(),
 "default-nameserver": z.array(z.string()).optional(),
 nameserver: z.array(z.string()).optional(),
 fallback: z.array(z.string()).optional(),
 "fallback-filter": z
  .object({
   geoip: z.boolean().optional(),
   "geoip-code": z.string().optional(),
   ipcidr: z.array(z.string()).optional(),
   domain: z.array(z.string()).optional(),
  })
  .optional(),
 "cache-algorithm": z.enum(["lru", "arc"]).optional(),
 "cache-max-size": z.number().optional(),
 "nameserver-policy": z.record(z.any()).optional(),
 "proxy-server-nameserver": z.array(z.string()).optional(),
 "proxy-server-nameserver-policy": z.record(z.any()).optional(),
 "direct-nameserver": z.array(z.string()).optional(),
 "direct-nameserver-follow-policy": z.boolean().optional(),
 "preferred-ip": PreferredIPListSchema.optional(),
});

export type DnsOptions = z.input<typeof DnsSchema>;

export function dns(options: DnsOptions) {
 return DnsSchema.parse(options);
}
