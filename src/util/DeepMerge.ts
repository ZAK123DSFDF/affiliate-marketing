function isObject(v: unknown): v is Record<string, any> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function deepMerge<T extends Record<string, any>>(
  base: T,
  patch?: Partial<T>,
): T {
  // clone base to avoid mutating original
  const clone =
    typeof structuredClone === "function"
      ? (structuredClone(base) as T)
      : (JSON.parse(JSON.stringify(base)) as T);

  if (!patch) return clone;

  for (const k of Object.keys(patch)) {
    const p = (patch as any)[k];
    const b = (clone as any)[k];

    if (isObject(b) && isObject(p)) {
      (clone as any)[k] = deepMerge(b, p);
    } else {
      (clone as any)[k] = p;
    }
  }

  return clone;
}
