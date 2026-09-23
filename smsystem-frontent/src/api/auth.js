import { api, unwrap } from './client'

export async function login(payload) {
  const res = await api.post('/auth/login', payload)
  return res.data
}

export async function register(payload) {
  const res = await api.post('/auth/register', payload)
  return unwrap(res)
}

export async function health() {
  const res = await api.get('/auth/health')
  return res.data
}
