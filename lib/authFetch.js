// Drop-in replacement for fetch() that automatically attaches the logged-in
// user's JWT token, if one exists. Needed on every admin/crew/ground-staff
// page now that their API routes enforce server-side role checks — without
// this, even a correctly logged-in admin would get 401s.
export function authFetch(url, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url, { ...options, headers });
}
