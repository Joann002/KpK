const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401 && token) {
    const refreshed = await refreshToken();
    if (refreshed) {
      return fetchApi(endpoint, options);
    }
    logout();
    throw new Error('Session expirée');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || 'Erreur API');
  return data;
}

async function refreshToken() {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) return false;

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refresh}` },
    });
    if (!res.ok) return false;
    const tokens = await res.json();
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  window.location.href = '/login';
}

export const auth = {
  login: (email: string, password: string) =>
    fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, name?: string) =>
    fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
};

export const events = {
  getAll: () => fetchApi('/events'),
  getMy: () => fetchApi('/events/my'),
  getOne: (id: number) => fetchApi(`/events/${id}`),
  create: (data: { title: string; startDate: string; description?: string; location?: string }) =>
    fetchApi('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Record<string, unknown>) =>
    fetchApi(`/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: number) => fetchApi(`/events/${id}`, { method: 'DELETE' }),
};

export const members = {
  join: (eventId: number) => fetchApi(`/events/${eventId}/members/join`, { method: 'POST' }),
  leave: (eventId: number) => fetchApi(`/events/${eventId}/members/leave`, { method: 'DELETE' }),
};

export const invitations = {
  getMy: () => fetchApi('/invitations/my'),
  rsvp: (id: number, status: 'ACCEPTED' | 'DECLINED') =>
    fetchApi(`/invitations/${id}/rsvp`, { method: 'POST', body: JSON.stringify({ status }) }),
};
