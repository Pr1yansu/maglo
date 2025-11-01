export type SynonymMap = Record<string, string[]>;

export const DEFAULT_SYNONYMS: SynonymMap = {
  paid: ["settled", "completed", "cleared"],
  pending: ["awaiting", "due", "unpaid"],
  overdue: ["late", "past due", "past-due"],
  invoice: ["bill", "receipt"],
  client: ["customer", "buyer"],
  email: ["mail", "e-mail"],
  transaction: ["order", "purchase"],
  service: ["consulting", "support"],
  product: ["item", "goods"],
};

export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9@.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Lightweight Levenshtein distance optimized for short tokens
export const editDistance = (a: string, b: string) => {
  if (a === b) return 0;
  const al = a.length,
    bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;
  const dp = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) dp[j] = j;
  for (let i = 1; i <= al; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= bl; j++) {
      const temp = dp[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost);
      prev = temp;
    }
  }
  return dp[bl];
};

export const fuzzyScore = (token: string, text: string) => {
  if (!token || !text) return 0;
  if (text.includes(token)) return 1;
  let best = 0;
  const words = text.split(" ");
  for (const w of words) {
    const maxLen = Math.max(token.length, w.length);
    if (maxLen === 0) continue;
    const dist = editDistance(token, w);
    const sim = 1 - dist / maxLen;
    if (sim > best) best = sim;
    if (best === 1) break;
  }
  return best;
};

export type IndexedRow<T> = {
  row: T;
  fields: Record<string, string>;
};

export function buildIndex<T>(
  rows: T[],
  getFields: (row: T) => Record<string, string>
): IndexedRow<T>[] {
  return rows.map((row) => {
    const raw = getFields(row);
    const fields: Record<string, string> = {};
    for (const k of Object.keys(raw))
      fields[k] = normalize(String(raw[k] ?? ""));
    return { row, fields };
  });
}

export function filterAndRank<T>(
  index: IndexedRow<T>[],
  query: string,
  opts?: {
    synonyms?: SynonymMap;
    weights?: Record<string, number>;
    status?: string;
    statusFieldKey?: string;
  }
): T[] {
  const synonyms = opts?.synonyms ?? DEFAULT_SYNONYMS;
  const q = normalize(query || "");
  const statusNorm = normalize(opts?.status || "");

  let items = index;
  if (statusNorm && opts?.statusFieldKey) {
    items = items.filter((it) =>
      it.fields[opts.statusFieldKey!]?.includes(statusNorm)
    );
  }

  if (!q) return items.map((i) => i.row);

  const tokens = q.split(" ").filter(Boolean);
  const expanded = tokens.flatMap((t) => [
    t,
    ...(synonyms[t] || []).map(normalize),
  ]);

  const results: Array<{ r: T; score: number }> = [];
  for (const it of items) {
    let score = 0;
    for (const [key, text] of Object.entries(it.fields)) {
      const w = opts?.weights?.[key] ?? 1;
      for (const tok of expanded) score += w * fuzzyScore(tok, text);
    }
    if (score > 0) results.push({ r: it.row, score });
  }
  results.sort((a, b) => b.score - a.score);
  return results.map((x) => x.r);
}
