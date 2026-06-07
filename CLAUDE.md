# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Type-safe TypeScript library for generating [mihomo (Clash Meta)](https://github.com/MetaCubeX/mihomo) proxy configurations. Uses Zod for runtime validation and js-yaml for serialization. Published as an ESM-only package.

## Commands

```bash
npm run build      # tsup → dist/ (ESM + declarations)
npm test           # vitest run
npm run typecheck  # tsc --noEmit
npx vitest run src/__test__/integration.test.ts  # single test file
```

No dev server or lint step is configured.

## Architecture

The library uses a **factory function + Zod schema** pattern throughout. Each mihomo config section has its own module exporting:
- A Zod schema (e.g., `VlessOptionsSchema`, `SelectGroupSchema`)
- An input type alias via `z.input<typeof Schema>` (for consumer-facing types)
- A factory function that parses options through the schema and returns the validated object

### Module layout

- `src/config.ts` — Top-level `createConfig()` assembles all sections via `ConfigSchema`. Sub-configs (dns, sniffer, tun, experimental) use `z.record(z.any())` — the sub-factories handle their own validation.
- `src/proxies/` — One file per proxy protocol (vless, vmess, trojan, shadowsocks, hysteria2, tuic, wireguard, socks5, http, snell, ssh, anytls, shadowsocksr, direct). `common.ts` holds shared schemas: `BasicOptionSchema` (inherited by all proxies), TLS fields, and transport sub-option schemas (ws, grpc, http, h2, xhttp, reality, ech). Each proxy factory injects a `type` literal and spreads the parsed result.
- `src/groups/` — One file per group type: select, url-test, fallback, load-balance, relay. Each uses `z.literal()` for its type field.
- `src/rules/types.ts` — Rule functions return comma-separated strings (`TYPE,payload,target[,params]`). The private `buildRule()` helper handles formatting. `RULE_TYPES` constant provides type-safe rule name mapping.
- `src/providers/` — `ruleProvider()` and `proxyProvider()` for external data sources.
- `src/listeners/` — Listener config factory.
- `src/dns.ts`, `src/sniffer.ts`, `src/tun.ts`, `src/experimental.ts` — Sub-config factories, each with their own Zod schema.
- `src/yaml.ts` — `toYaml()` serializes a config object to YAML string using js-yaml with mihomo-friendly settings (no line wrapping, no key sorting).
- `src/index.ts` — Re-exports everything from all modules.

### Key conventions

- All config keys use **kebab-case** matching mihomo's YAML format (e.g., `'reality-opts'`, `'enhanced-mode'`).
- Proxy factories return `{ type: '<protocol>', ...parsed }` — the `type` field is injected by the factory, not the caller.
- Type exports use `z.input<typeof Schema>` so consumers get the input shape (with optional fields) rather than the parsed output shape.
- The barrel export in `src/index.ts` re-exports everything; there are no nested path exports.
