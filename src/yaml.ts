import yaml from 'js-yaml'

export function toYaml(config: Record<string, unknown>): string {
  return yaml.dump(config, {
    lineWidth: -1,
    noCompatMode: true,
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false,
    skipInvalid: true,
  })
}
