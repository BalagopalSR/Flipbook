export function filterFlipbooks<T extends { title: string; createdAt: string }>(
  items: T[],
  search: string
): T[] {
  let result = [...items];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((f) => f.title.toLowerCase().includes(q));
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return result;
}
