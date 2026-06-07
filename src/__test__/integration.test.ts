import { describe, it, expect } from 'vitest'
import {
  vless, shadowsocks,
  select, urlTest, loadBalance,
  dns, sniffer, experimental,
  ruleProvider, proxyProvider,
  ruleSet, domainSuffix, ipCidr, match,
  createConfig, toYaml,
} from '../index.js'

describe('proxy factories', () => {
  it('creates a vless proxy with reality', () => {
    const p = vless({
      name: 'JP-Akile',
      server: '82.41.50.93',
      port: 15697,
      uuid: '08932320-d5b5-4a48-92f8-06cb7e77a0b7',
      'client-fingerprint': 'random',
      tls: true,
      servername: 'www.amd.com',
      flow: 'xtls-rprx-vision',
      network: 'tcp',
      'reality-opts': {
        'public-key': 'tsAFpMx_Bq30fTCUs7WZ1Pg-QvQhuw0YBAfwZTyGolE',
        'short-id': '0c51a27855551fe5',
      },
    })
    expect(p.type).toBe('vless')
    expect(p.name).toBe('JP-Akile')
    expect(p.flow).toBe('xtls-rprx-vision')
  })

  it('creates a shadowsocks proxy', () => {
    const p = shadowsocks({
      name: 'test-ss',
      server: '1.2.3.4',
      port: 8388,
      password: 'test',
      cipher: 'aes-256-gcm',
    })
    expect(p.type).toBe('ss')
  })
})

describe('proxy groups', () => {
  it('creates a select group', () => {
    const g = select({ name: '节点选择', type: 'select', proxies: ['JP', 'DIRECT'] })
    expect(g.type).toBe('select')
  })

  it('creates a url-test group', () => {
    const g = urlTest({ name: '日本自动', type: 'url-test', url: 'https://cp.cloudflare.com', interval: 300, tolerance: 100 })
    expect(g.tolerance).toBe(100)
  })

  it('creates a load-balance group', () => {
    const g = loadBalance({ name: '香港负载均衡', type: 'load-balance', strategy: 'sticky-sessions', interval: 300 })
    expect(g.strategy).toBe('sticky-sessions')
  })
})

describe('dns + sniffer', () => {
  it('creates dns config with kebab-case keys', () => {
    const d = dns({
      enable: true,
      listen: '0.0.0.0:53',
      'enhanced-mode': 'redir-host',
      'cache-algorithm': 'arc',
      nameserver: ['https://1.1.1.1/dns-query'],
    })
    expect(d['enhanced-mode']).toBe('redir-host')
  })

  it('creates sniffer config', () => {
    const s = sniffer({
      enable: true,
      sniff: { HTTP: { ports: ['80', '8080-8880'], 'override-destination': true }, TLS: { ports: ['443'] } },
    })
    expect(s.sniff?.HTTP?.ports).toContain('80')
  })
})

describe('rules', () => {
  it('creates rule strings', () => {
    expect(ruleSet('geosite_cn', 'DIRECT')).toBe('RULE-SET,geosite_cn,DIRECT')
    expect(domainSuffix('google.com', '节点选择')).toBe('DOMAIN-SUFFIX,google.com,节点选择')
    expect(ipCidr('192.168.9.0/24', '家庭内网', 'no-resolve')).toBe('IP-CIDR,192.168.9.0/24,家庭内网,no-resolve')
    expect(match('节点选择')).toBe('MATCH,节点选择')
  })
})

describe('providers', () => {
  it('creates providers', () => {
    const rp = ruleProvider({ type: 'http', behavior: 'domain', format: 'mrs', interval: 3600, url: 'https://example.com/rule.mrs' })
    expect(rp.format).toBe('mrs')
    const pp = proxyProvider({ type: 'http', interval: 86400, url: 'https://example.com/sub' })
    expect(pp.interval).toBe(86400)
  })
})

describe('full config to YAML', () => {
  it('creates a full config and serializes to YAML', () => {
    const config = createConfig({
      'log-level': 'warning',
      'find-process-mode': 'off',
      dns: dns({ enable: true, listen: '0.0.0.0:53', 'enhanced-mode': 'redir-host', nameserver: ['https://1.1.1.1/dns-query'] }),
      sniffer: sniffer({ enable: true }),
      proxies: [vless({ name: 'JP', server: '1.2.3.4', port: 443, uuid: 'test-uuid', tls: true, flow: 'xtls-rprx-vision', network: 'tcp', 'reality-opts': { 'public-key': 'testkey', 'short-id': 'abc' } })],
      'proxy-groups': [select({ name: '节点选择', type: 'select', proxies: ['JP', 'DIRECT'] })],
      rules: [ruleSet('geosite_cn', 'DIRECT'), match('节点选择')],
      'rule-providers': { geosite_cn: ruleProvider({ type: 'http', behavior: 'domain', format: 'mrs', interval: 3600, url: 'https://example.com/cn.mrs' }) },
      experimental: experimental({ 'dialer-ip4p-convert': true }),
    })

    const yaml = toYaml(config)
    expect(yaml).toContain('log-level: warning')
    expect(yaml).toContain('type: vless')
    expect(yaml).toContain('enhanced-mode: redir-host')
    expect(yaml).toContain('MATCH,节点选择')
    expect(yaml).toContain('dialer-ip4p-convert: true')
  })
})
