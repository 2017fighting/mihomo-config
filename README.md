# mihomo-config

Type-safe TypeScript library for generating [mihomo (Clash Meta)](https://github.com/MetaCubeX/mihomo) proxy configuration dynamically. Runtime validation via [Zod](https://zod.dev), YAML serialization via [js-yaml](https://github.com/nodeca/js-yaml).

## Install

```bash
npm install mihomo-config
```

## Quick Start

```typescript
import {
  vless, select, urlTest, loadBalance,
  dns, sniffer, experimental,
  ruleProvider, proxyProvider,
  ruleSet, domainSuffix, ipCidr, match,
  createConfig, toYaml,
} from 'mihomo-config'

const config = createConfig({
  'log-level': 'warning',
  'find-process-mode': 'off',
  dns: dns({
    enable: true,
    listen: '0.0.0.0:53',
    'enhanced-mode': 'redir-host',
    nameserver: ['https://1.1.1.1/dns-query'],
  }),
  sniffer: sniffer({ enable: true }),
  proxies: [
    vless({
      name: 'JP',
      server: '1.2.3.4',
      port: 443,
      uuid: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      tls: true,
      flow: 'xtls-rprx-vision',
      network: 'tcp',
      'reality-opts': { 'public-key': 'xxxxx', 'short-id': 'abc' },
    }),
  ],
  'proxy-groups': [
    select({ name: '节点选择', type: 'select', proxies: ['JP', 'DIRECT'] }),
  ],
  rules: [ruleSet('geosite_cn', 'DIRECT'), match('节点选择')],
  'rule-providers': {
    geosite_cn: ruleProvider({
      type: 'http', behavior: 'domain', format: 'mrs',
      interval: 3600, url: 'https://example.com/cn.mrs',
    }),
  },
  experimental: experimental({ 'dialer-ip4p-convert': true }),
})

console.log(toYaml(config))
```

## API

### Proxies

All proxy factories return validated objects with a `type` field. Each accepts an options object matching the mihomo config schema — keys use kebab-case (same as YAML).

```typescript
import { vless, vmess, trojan, shadowsocks, hysteria2, tuic, wireguard } from 'mihomo-config'

vless({ name: '...', server: '...', port: 443, uuid: '...', /* ... */ })
vmess({ name: '...', server: '...', port: 443, uuid: '...', alterId: 0, cipher: 'auto', /* ... */ })
trojan({ name: '...', server: '...', port: 443, password: '...', /* ... */ })
shadowsocks({ name: '...', server: '...', port: 8388, password: '...', cipher: 'aes-256-gcm', /* ... */ })
hysteria2({ name: '...', server: '...', port: 443, password: '...', /* ... */ })
tuic({ name: '...', server: '...', port: 443, uuid: '...', password: '...', /* ... */ })
wireguard({ name: '...', server: '...', port: 51820, 'private-key': '...', ip: '...', /* ... */ })
```

Additional proxy types: `socks5`, `http`, `snell`, `ssh`, `anytls`, `shadowsocksr`, `direct`.

Common options available on most proxies: `udp`, `tfo`, `mptcp`, `interface-name`, `routing-mark`, `dialer-proxy`, `ip-version`, `client-fingerprint`, plus transport sub-options (`ws-opts`, `grpc-opts`, `http-opts`, `h2-opts`, `xhttp-opts`).

### Proxy Groups

```typescript
import { select, urlTest, fallback, loadBalance, relay } from 'mihomo-config'

select({ name: '节点选择', type: 'select', proxies: ['JP', 'DIRECT'] })
urlTest({ name: '日本自动', type: 'url-test', url: 'https://cp.cloudflare.com', interval: 300, tolerance: 100 })
fallback({ name: '回退', type: 'fallback', url: 'https://cp.cloudflare.com', interval: 300, proxies: ['JP', 'DIRECT'] })
loadBalance({ name: '负载均衡', type: 'load-balance', strategy: 'sticky-sessions', interval: 300, proxies: ['JP1', 'JP2'] })
relay({ name: '链路', type: 'relay', proxies: ['JP', 'US'] })
```

### DNS

```typescript
import { dns } from 'mihomo-config'

dns({
  enable: true,
  listen: '0.0.0.0:53',
  'enhanced-mode': 'redir-host',       // 'normal' | 'fake-ip' | 'redir-host'
  'cache-algorithm': 'arc',             // 'lru' | 'arc'
  nameserver: ['https://1.1.1.1/dns-query'],
  'proxy-server-nameserver': ['https://223.5.5.5/dns-query'],
  'direct-nameserver': ['https://120.53.53.53/dns-query'],
})
```

### Sniffer

```typescript
import { sniffer } from 'mihomo-config'

sniffer({
  enable: true,
  'parse-pure-ip': true,
  'force-domain': ['+.google.com'],
  sniff: {
    HTTP: { ports: ['80', '8080-8880'], 'override-destination': true },
    TLS: { ports: ['443'] },
    QUIC: { ports: ['443'] },
  },
})
```

### TUN

```typescript
import { tun } from 'mihomo-config'

tun({
  enable: true,
  stack: 'mixed',                       // 'gvisor' | 'system' | 'mixed'
  'auto-route': true,
  'auto-detect-interface': true,
  'dns-hijack': ['any:53'],
})
```

### Rules

All rule functions return a `RULE-TYPE,payload,target[,params...]` string.

```typescript
import {
  domain, domainSuffix, domainKeyword, domainRegex,
  geoSite, geoIp, ipCidr, srcIpCidr,
  ruleSet, match, network, processName,
  dstPort, srcPort, inPort, inType,
  and, or, not, subRule,
} from 'mihomo-config'

domainSuffix('google.com', '节点选择')            // DOMAIN-SUFFIX,google.com,节点选择
ipCidr('192.168.0.0/16', 'DIRECT', 'no-resolve') // IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
ruleSet('geosite_cn', 'DIRECT')                   // RULE-SET,geosite_cn,DIRECT
match('节点选择')                                  // MATCH,节点选择
```

### Providers

```typescript
import { ruleProvider, proxyProvider } from 'mihomo-config'

ruleProvider({
  type: 'http',
  behavior: 'domain',                  // 'domain' | 'ipcidr' | 'classical'
  format: 'mrs',                       // 'mrs' | 'yaml' | 'text'
  interval: 3600,
  url: 'https://example.com/rule.mrs',
})

proxyProvider({
  type: 'http',
  interval: 86400,
  url: 'https://example.com/sub',
})
```

### Listeners

```typescript
import { listener } from 'mihomo-config'

listener({
  type: 'mixed',
  listen: '0.0.0.0:7893',
})
```

### Experimental

```typescript
import { experimental } from 'mihomo-config'

experimental({
  'dialer-ip4p-convert': true,
  'quic-go-disable-gso': false,
  'quic-go-disable-ecn': false,
})
```

### Top-level Config

`createConfig()` assembles all sections into a validated config object. Accepts all mihomo top-level keys.

```typescript
import { createConfig } from 'mihomo-config'

const config = createConfig({
  'mixed-port': 7890,
  'allow-lan': true,
  mode: 'rule',
  'log-level': 'info',
  dns: dns({ /* ... */ }),
  sniffer: sniffer({ /* ... */ }),
  tun: tun({ /* ... */ }),
  proxies: [/* ... */],
  'proxy-groups': [/* ... */],
  'proxy-providers': { /* ... */ },
  rules: [/* ... */],
  'rule-providers': { /* ... */ },
  experimental: experimental({ /* ... */ }),
})
```

### YAML Serialization

```typescript
import { toYaml } from 'mihomo-config'

const yaml = toYaml(config)  // string
```

## Development

```bash
npm install
npm run build       # tsup → dist/
npm test            # vitest
npm run typecheck   # tsc --noEmit
```

## License

MIT
