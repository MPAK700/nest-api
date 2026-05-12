export function parseKafkaBrokers(brokers: string | undefined): string[] {
  if (!brokers) {
    return [];
  }

  return brokers
    .split(',')
    .map((broker) => broker.trim())
    .filter(Boolean);
}
