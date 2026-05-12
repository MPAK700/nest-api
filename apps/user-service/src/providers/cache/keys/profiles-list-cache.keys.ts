export function buildProfilesListKey(query: { page: number; limit: number }) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;

  return `profiles:list:${page}:${limit}`;
}
