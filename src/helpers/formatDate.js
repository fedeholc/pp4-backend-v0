export function formatDateForMySQL(date) {
  if (!date) return null;
  const d = new Date(date);
  // YYYY-MM-DD HH:MM:SS
  return d.toISOString().slice(0, 19).replace("T", " ");
}
