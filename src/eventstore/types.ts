export type EventType<T extends Record<string, any> = any> = {
  name: string;
  data: T;
  timestamp: Date;
};