export type LogEvent = {
  actor: string;
  action: string;
  entity_id?: string;
  status?: string;
  message?: string;
  payload?: Record<string, unknown>;
};

export function logEvent(event: LogEvent) {
  console.info(JSON.stringify(event));
}

export function logError(event: LogEvent) {
  console.error(JSON.stringify(event));
}
