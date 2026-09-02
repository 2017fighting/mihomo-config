import { describe, it, expect } from "vitest";
import {
  vless,
  shadowsocks,
  heybox,
  select,
  urlTest,
  loadBalance,
  dns,
  sniffer,
  experimental,
  listener,
  ruleProvider,
  proxyProvider,
  ruleSet,
  domainSuffix,
  ipCidr,
  match,
  createConfig,
  toYaml,
} from "../index.js";

describe("proxy factories", () => {
  it("creates a vless proxy with reality", () => {
    const p = vless({
      name: "JP-Akile",
      server: "82.41.50.93",
      port: 15697,
      uuid: "08932320-d5b5-4a48-92f8-06cb7e77a0b7",
      "client-fingerprint": "random",
      tls: true,
      servername: "www.amd.com",
      flow: "xtls-rprx-vision",
      network: "tcp",
      "reality-opts": {
        "public-key": "tsAFpMx_Bq30fTCUs7WZ1Pg-QvQhuw0YBAfwZTyGolE",
        "short-id": "0c51a27855551fe5",
      },
    });
    expect(p.type).toBe("vless");
    expect(p.name).toBe("JP-Akile");
    expect(p.flow).toBe("xtls-rprx-vision");
  });

  it("creates a shadowsocks proxy", () => {
    const p = shadowsocks({
      name: "test-ss",
      server: "1.2.3.4",
      port: 8388,
      password: "test",
      cipher: "aes-256-gcm",
    });
    expect(p.type).toBe("ss");
  });

  it("creates a heybox proxy (小黑盒加速器)", () => {
    const p = heybox({
      name: "Switch-通用-日本3",
      "heybox-id": 16651571,
      pkey: "MTc4...",
      "acc-id": 356,
      "game-id": 0,
      "server-region": 1,
      "node-name": "日本3",
      "acc-mode": 1,
      "transport-proto": "udp",
      isp: "liantong",
      "node-ip": "1.2.3.4",
      "echo-addr": "1.2.3.4:443",
      "rtt-avg": 30,
    });
    expect(p.type).toBe("heybox");
    expect(p["heybox-id"]).toBe(16651571);
    expect(p["node-name"]).toBe("日本3");
    // 无 server/port:会话由加速服务原子下发
    expect(p).not.toHaveProperty("server");
  });

  it("rejects a heybox proxy missing required fields", () => {
    expect(() =>
      // @ts-expect-error -- pkey 必填
      heybox({
        name: "x",
        "heybox-id": 1,
        "acc-id": 356,
        "node-name": "日本3",
      }),
    ).toThrow();
  });
});

describe("proxy groups", () => {
  it("creates a select group", () => {
    const g = select({
      name: "节点选择",
      type: "select",
      proxies: ["JP", "DIRECT"],
    });
    expect(g.type).toBe("select");
  });

  it("creates a url-test group", () => {
    const g = urlTest({
      name: "日本自动",
      type: "url-test",
      url: "https://cp.cloudflare.com",
      interval: 300,
      tolerance: 100,
    });
    expect(g.tolerance).toBe(100);
  });

  it("creates a load-balance group", () => {
    const g = loadBalance({
      name: "香港负载均衡",
      type: "load-balance",
      strategy: "sticky-sessions",
      interval: 300,
    });
    expect(g.strategy).toBe("sticky-sessions");
  });
});

describe("dns + sniffer", () => {
  it("creates dns config with kebab-case keys", () => {
    const d = dns({
      enable: true,
      listen: "0.0.0.0:53",
      "enhanced-mode": "redir-host",
      "cache-algorithm": "arc",
      nameserver: ["https://1.1.1.1/dns-query"],
    });
    expect(d["enhanced-mode"]).toBe("redir-host");
  });

  it("creates dns config with preferred-ip", () => {
    const d = dns({
      enable: true,
      "preferred-ip": [
        {
          name: "cloudflare",
          cidr: ["173.245.48.0/20", "103.21.244.0/22"],
          ipv6: "block",
          "answer-count": 5,
          "ttl-cap": 60,
          persist: true,
          speedtest: {
            interval: "24h",
            threads: 200,
            "tcp-port": 443,
            "ping-times": 4,
            "download-count": 10,
            "download-time": "10s",
            "max-delay": "9999ms",
          },
        },
        {
          name: "gcore",
          cidr: ["203.104.0.0/16"],
          speedtest: { interval: 86400, "max-loss-rate": 1.0 },
        },
      ],
    });
    expect(d["preferred-ip"]).toHaveLength(2);
    expect(d["preferred-ip"]?.[0]?.speedtest?.interval).toBe("24h");
    // 秒数形式也可用
    expect(d["preferred-ip"]?.[1]?.speedtest?.interval).toBe(86400);
  });

  it("rejects duplicate preferred-ip names (persistence key)", () => {
    expect(() =>
      dns({
        enable: true,
        "preferred-ip": [
          { name: "cloudflare", cidr: ["173.245.48.0/20"] },
          { name: "cloudflare", cidr: ["103.21.244.0/22"] },
        ],
      }),
    ).toThrow(/unique/);
  });

  it("creates sniffer config", () => {
    const s = sniffer({
      enable: true,
      sniff: {
        HTTP: { ports: ["80", "8080-8880"], "override-destination": true },
        TLS: { ports: ["443"] },
      },
    });
    expect(s.sniff?.HTTP?.ports).toContain("80");
  });
});

describe("rules", () => {
  it("creates rule strings", () => {
    expect(ruleSet("geosite_cn", "DIRECT")).toBe("RULE-SET,geosite_cn,DIRECT");
    expect(domainSuffix("google.com", "节点选择")).toBe(
      "DOMAIN-SUFFIX,google.com,节点选择",
    );
    expect(ipCidr("192.168.9.0/24", "家庭内网", "no-resolve")).toBe(
      "IP-CIDR,192.168.9.0/24,家庭内网,no-resolve",
    );
    expect(match("节点选择")).toBe("MATCH,节点选择");
  });
});

describe("providers", () => {
  it("creates providers", () => {
    const rp = ruleProvider({
      type: "http",
      behavior: "domain",
      format: "mrs",
      interval: 3600,
      url: "https://example.com/rule.mrs",
    });
    expect(rp.format).toBe("mrs");
    const pp = proxyProvider({
      type: "http",
      interval: 86400,
      url: "https://example.com/sub",
    });
    expect(pp.interval).toBe(86400);
  });

  it("creates a heybox provider and validates required fields", () => {
    const pp = proxyProvider({
      type: "heybox",
      "heybox-id": 16651571,
      pkey: "MTc4...",
      games: [356],
      interval: 600,
    });
    expect(pp.type).toBe("heybox");
    expect(pp.games).toEqual([356]);

    // 镜像上游校验:heybox-id/pkey/games 必填
    expect(() =>
      proxyProvider({
        type: "heybox",
        "heybox-id": 16651571,
        // 缺 pkey 与 games
      }),
    ).toThrow(/requires heybox-id and pkey/);
    expect(() =>
      proxyProvider({
        type: "heybox",
        "heybox-id": 16651571,
        pkey: "MTc4...",
        games: [],
      }),
    ).toThrow(/requires games/);
  });
});

describe("full config to YAML", () => {
  it("creates a full config and serializes to YAML", () => {
    const config = createConfig({
      "log-level": "warning",
      "find-process-mode": "off",
      dns: dns({
        enable: true,
        listen: "0.0.0.0:53",
        "enhanced-mode": "redir-host",
        nameserver: ["https://1.1.1.1/dns-query"],
      }),
      sniffer: sniffer({ enable: true }),
      proxies: [
        vless({
          name: "JP",
          server: "1.2.3.4",
          port: 443,
          uuid: "test-uuid",
          tls: true,
          flow: "xtls-rprx-vision",
          network: "tcp",
          "reality-opts": { "public-key": "testkey", "short-id": "abc" },
        }),
      ],
      "proxy-groups": [
        select({ name: "节点选择", type: "select", proxies: ["JP", "DIRECT"] }),
      ],
      rules: [ruleSet("geosite_cn", "DIRECT"), match("节点选择")],
      "rule-providers": {
        geosite_cn: ruleProvider({
          type: "http",
          behavior: "domain",
          format: "mrs",
          interval: 3600,
          url: "https://example.com/cn.mrs",
        }),
      },
      experimental: experimental({ "dialer-ip4p-convert": true }),
    });

    const yaml = toYaml(config);
    expect(yaml).toContain("log-level: warning");
    expect(yaml).toContain("type: vless");
    expect(yaml).toContain("enhanced-mode: redir-host");
    expect(yaml).toContain("MATCH,节点选择");
    expect(yaml).toContain("dialer-ip4p-convert: true");
  });
});

describe("listeners", () => {
  it("flattens `extra` fields to the top level of the listener", () => {
    const l = listener({
      name: "mixed-in",
      type: "mixed",
      port: 7892,
      listen: "0.0.0.0",
      extra: {
        udp: true,
        users: [{ username: "u", password: "p" }],
      },
    });

    // Protocol fields must be top-level (where mihomo reads them)...
    const flat = l as Record<string, unknown>;
    expect(flat.udp).toBe(true);
    expect(flat.users).toEqual([{ username: "u", password: "p" }]);
    // ...not nested under a leftover `extra` key.
    expect(flat.extra).toBeUndefined();

    const yaml = toYaml({ listeners: [l] });
    expect(yaml).toContain("udp: true");
    expect(yaml).toContain("username: u");
    expect(yaml).not.toContain("extra:");
  });
});
