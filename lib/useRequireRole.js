import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Protects a page so only the given roles can view it (admin is NOT
 * automatically included — pass it explicitly, e.g. ['admin', 'crew']).
 * Returns one of: 'checking' | 'guest' | 'unauthorized' | 'authorized'.
 */
export function useRequireRole(allowedRoles) {
  const router = useRouter();
  const [status, setStatus] = useState('checking');

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!stored || !token) {
      setStatus('guest');
      router.push('/login');
      return;
    }
    try {
      const user = JSON.parse(stored);
      setStatus(allowedRoles.includes(user.role) ? 'authorized' : 'unauthorized');
    } catch (error) {
      setStatus('guest');
      router.push('/login');
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  return status;
}
