export function nowISO() {
  return new Date().toISOString();
}

export function generateId(prefix = "id") {
  const randomPart = Math.random().toString(36).slice(2, 10);
  const timePart = Date.now().toString(36);
  return `${prefix}_${timePart}_${randomPart}`;
}

export function normalizeText(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function uniqueArray(values) {
  return [...new Set(safeArray(values))];
}

export function sortByOrder(items = []) {
  return [...items].sort((a, b) => {
    const orderA = typeof a?.order === "number" ? a.order : Number.MAX_SAFE_INTEGER;
    const orderB = typeof b?.order === "number" ? b.order : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
}
