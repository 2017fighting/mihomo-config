export function domain(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DOMAIN", payload, target, params);
}

export function domainSuffix(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DOMAIN-SUFFIX", payload, target, params);
}

export function domainKeyword(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DOMAIN-KEYWORD", payload, target, params);
}

export function domainRegex(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DOMAIN-REGEX", payload, target, params);
}

export function domainWildcard(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DOMAIN-WILDCARD", payload, target, params);
}

export function geoSite(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("GEOSITE", payload, target, params);
}

export function geoIp(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("GEOIP", payload, target, params);
}

export function srcGeoIp(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("SRC-GEOIP", payload, target, params);
}

export function ipAsn(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IP-ASN", payload, target, params);
}

export function srcIpAsn(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("SRC-IP-ASN", payload, target, params);
}

export function ipCidr(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IP-CIDR", payload, target, params);
}

export function srcIpCidr(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("SRC-IP-CIDR", payload, target, params);
}

export function ipSuffix(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IP-SUFFIX", payload, target, params);
}

export function srcIpSuffix(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("SRC-IP-SUFFIX", payload, target, params);
}

export function srcPort(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("SRC-PORT", payload, target, params);
}

export function dstPort(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DST-PORT", payload, target, params);
}

export function inPort(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IN-PORT", payload, target, params);
}

export function dscp(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("DSCP", payload, target, params);
}

export function inUser(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IN-USER", payload, target, params);
}

export function inName(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IN-NAME", payload, target, params);
}

export function inType(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("IN-TYPE", payload, target, params);
}

export function processName(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("PROCESS-NAME", payload, target, params);
}

export function processPath(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("PROCESS-PATH", payload, target, params);
}

export function processNameRegex(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("PROCESS-NAME-REGEX", payload, target, params);
}

export function processPathRegex(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("PROCESS-PATH-REGEX", payload, target, params);
}

export function ruleSet(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("RULE-SET", payload, target, params);
}

export function network(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("NETWORK", payload, target, params);
}

export function uid(
  payload: string,
  target: string,
  ...params: string[]
): string {
  return buildRule("UID", payload, target, params);
}

export function subRule(target: string): string {
  return `SUB-RULE,${target}`;
}

export function match(target: string): string {
  return `MATCH,${target}`;
}

export function and(target: string): string {
  return `AND,${target}`;
}

export function or(target: string): string {
  return `OR,${target}`;
}

export function not(target: string): string {
  return `NOT,${target}`;
}

function buildRule(
  type: string,
  payload: string,
  target: string,
  params: string[],
): string {
  const extra = params.length ? "," + params.join(",") : "";
  return `${type},${payload},${target}${extra}`;
}

export const RULE_TYPES = {
  DOMAIN: "DOMAIN",
  DOMAIN_SUFFIX: "DOMAIN-SUFFIX",
  DOMAIN_KEYWORD: "DOMAIN-KEYWORD",
  DOMAIN_REGEX: "DOMAIN-REGEX",
  DOMAIN_WILDCARD: "DOMAIN-WILDCARD",
  GEOSITE: "GEOSITE",
  GEOIP: "GEOIP",
  SRC_GEOIP: "SRC-GEOIP",
  IP_ASN: "IP-ASN",
  SRC_IP_ASN: "SRC-IP-ASN",
  IP_CIDR: "IP-CIDR",
  SRC_IP_CIDR: "SRC-IP-CIDR",
  IP_SUFFIX: "IP-SUFFIX",
  SRC_IP_SUFFIX: "SRC-IP-SUFFIX",
  SRC_PORT: "SRC-PORT",
  DST_PORT: "DST-PORT",
  IN_PORT: "IN-PORT",
  DSCP: "DSCP",
  IN_USER: "IN-USER",
  IN_NAME: "IN-NAME",
  IN_TYPE: "IN-TYPE",
  PROCESS_NAME: "PROCESS-NAME",
  PROCESS_PATH: "PROCESS-PATH",
  PROCESS_NAME_REGEX: "PROCESS-NAME-REGEX",
  PROCESS_PATH_REGEX: "PROCESS-PATH-REGEX",
  RULE_SET: "RULE-SET",
  NETWORK: "NETWORK",
  UID: "UID",
  SUB_RULE: "SUB-RULE",
  MATCH: "MATCH",
  AND: "AND",
  OR: "OR",
  NOT: "NOT",
} as const;
