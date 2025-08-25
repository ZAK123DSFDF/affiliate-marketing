export function isEmptyHtml(html: string): boolean {
  if (!html) return true

  const stripped = html
    .replace(/<p>(\s|&nbsp;|<br>)*<\/p>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim()

  return stripped === ""
}
