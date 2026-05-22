export function parseUTCDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid UTC date');
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatUTCDate(date: Date) {
  return date.toISOString().slice(0, 10);
}
