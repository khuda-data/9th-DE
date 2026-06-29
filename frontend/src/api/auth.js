import { API_BASE } from './client'

export async function fetchMe() {
  const token = localStorage.getItem('accessToken')
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('auth failed')
  return res.json()
}
