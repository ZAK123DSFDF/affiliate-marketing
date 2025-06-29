const currencyDecimals: Record<string, number> = {
  // 0-decimal currencies
  bif: 0,
  clp: 0,
  djf: 0,
  gnf: 0,
  jpy: 0,
  kmf: 0,
  krw: 0,
  mga: 0,
  mru: 0,
  pyg: 0,
  rwf: 0,
  ugx: 0,
  vnd: 0,
  vuv: 0,
  xaf: 0,
  xof: 0,
  xpf: 0,
  isk: 0,

  // 3-decimal currencies
  bhd: 3,
  iqd: 3,
  jod: 3,
  kwd: 3,
  lyd: 3,
  omr: 3,
  tnd: 3,
};

export function getCurrencyDecimals(inputCode: string): number {
  const code = inputCode.toLowerCase();
  return currencyDecimals[code] ?? 2;
}
