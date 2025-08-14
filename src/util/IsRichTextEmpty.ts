export function IsRichTextEmpty(html?: string) {
  if (!html) return true;
  const text = html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, "")
    .trim();
  return text.length === 0;
}
