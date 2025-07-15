export type ResponseData<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number; toast?: string };
