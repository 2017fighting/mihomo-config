import { z } from "zod";
import { HeyboxISPSchema } from "../proxies/heybox.js";

const ProxyProviderTypeSchema = z.enum(["file", "http", "inline", "heybox"]);

// 重命名导出内部 schema 名,保持 `proxyProviderSchema` 对外不变
const baseProxyProviderSchema = z.object({
  type: ProxyProviderTypeSchema,
  path: z.string().optional(),
  url: z.string().optional(),
  proxy: z.string().optional(),
  interval: z.number().optional(),
  filter: z.string().optional(),
  "exclude-filter": z.string().optional(),
  "exclude-type": z.string().optional(),
  "dialer-proxy": z.string().optional(),
  "size-limit": z.number().optional(),
  payload: z.array(z.any()).optional(),
  "health-check": z
    .object({
      enable: z.boolean().optional(),
      url: z.string().optional(),
      interval: z.number().optional(),
      timeout: z.number().optional(),
      lazy: z.boolean().optional(),
      "expected-status": z.string().optional(),
    })
    .optional(),
  override: z
    .object({
      "proxy-name": z
        .array(
          z.object({
            pattern: z.string(),
            target: z.string(),
          }),
        )
        .optional(),
      "dialer-proxy": z.string().optional(),
    })
    .optional(),
  header: z.record(z.string().array()).optional(),

  // --- type: heybox (小黑盒加速器节点枚举,无会话副作用) ---
  /** 小黑盒账号 ID (type: heybox 必填) */
  "heybox-id": z.number().int().optional(),
  /** 登录凭据,每次登录轮换,需自行抓取 (type: heybox 必填) */
  pkey: z.string().optional(),
  /** 游戏 acc_id 列表 (type: heybox 必填,356 = Switch) */
  games: z.number().int().array().optional(),
  /** 运营商筛选,默认 all */
  isp: HeyboxISPSchema.optional(),
  /** accapi 地址覆盖,默认 https://accapi.xiaoheihe.cn */
  api: z.string().optional(),
});

/**
 * type: heybox 的 provider 为纯枚举 (used_game_list_for_pc → 每游戏每大区
 * get_abroad_node_list),刷新不产生会话;探活/测速由出站的 UDP echo DelayHint
 * 承担,health-check 配置了也会被忽略;interval 默认 600s。
 */
export const proxyProviderSchema = baseProxyProviderSchema.superRefine(
  (opts, ctx) => {
    if (opts.type !== "heybox") return;
    if (!opts["heybox-id"] || !opts.pkey) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heybox-id"],
        message: "heybox provider requires heybox-id and pkey",
      });
    }
    if (!opts.games?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["games"],
        message: "heybox provider requires games (acc_id list)",
      });
    }
  },
);

export type ProxyProviderOptions = z.input<typeof proxyProviderSchema>;

export function proxyProvider(options: ProxyProviderOptions) {
  return proxyProviderSchema.parse(options);
}
