import { z } from "zod";
import { BasicOptionSchema } from "./common.js";

/**
 * 运营商筛选:all(默认)/ dianxin / liantong / yidong / bgp
 */
export const HeyboxISPSchema = z.enum([
 "all",
 "dianxin",
 "liantong",
 "yidong",
 "bgp",
]);
export type HeyboxISP = z.infer<typeof HeyboxISPSchema>;

/**
 * 小黑盒加速器出站 (type: heybox)。
 *
 * 会话 (session_id / 握手密钥 / 协议版本 / 节点端口) 由加速服务在
 * proxy_node_list 响应中原子下发,出站惰性获取并缓存,无需配置 server/port。
 * 通常通过 `type: heybox` 的 proxy-provider 枚举生成,凭证由 provider 注入,
 * 而非手写每条 proxy。注意:除标注 optional 的字段外其余均必填
 * (上游严格解码器要求字段显式出现,即使是 0)。
 */
export const HeyboxOptionsSchema = BasicOptionSchema.extend({
 name: z.string(),
 /** 小黑盒账号 ID */
 "heybox-id": z.number().int(),
 /** 登录凭据,每次登录轮换,需自行抓取 */
 pkey: z.string(),
 /** 游戏 acc_id (356 = Switch) */
 "acc-id": z.number().int(),
 /** 游戏 game_id */
 "game-id": z.number().int(),
 /** 大区 ID (acc_district_id) */
 "server-region": z.number().int(),
 /** 节点名 (如 "日本3"),会话按此分配 */
 "node-name": z.string(),
 /** 加速模式 ID,通常为 1 */
 "acc-mode": z.number().int(),
 /** 传输协议,通常为 "udp" */
 "transport-proto": z.string(),
 /** 运营商筛选,默认 all */
 isp: HeyboxISPSchema.optional(),
 /** accapi 地址覆盖,默认 https://accapi.xiaoheihe.cn */
 api: z.string().optional(),
 /** 枚举阶段的入口 IP (仅展示/参考) */
 "node-ip": z.string().optional(),
 /** 入口 UDP 回声探测地址 (ip:port,枚举下发,DelayHint 用) */
 "echo-addr": z.string().optional(),
 /** 枚举延迟参考值 (ms),<999 有效;echo 失败时兜底 */
 "rtt-avg": z.number().int().optional(),
});

export type HeyboxOptions = z.input<typeof HeyboxOptionsSchema>;

export function heybox(options: HeyboxOptions) {
 return { type: "heybox" as const, ...HeyboxOptionsSchema.parse(options) };
}
