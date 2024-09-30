import { request } from '@/lib/axiosClient'

type SignUpData = {
  name: string
  email: string
  password: string
}

export function useUserActions() {
  async function signUp(userData: SignUpData) {
    const resp = await request.post('/auth/register', userData)
    return resp.data
  }

  async function searchUsers(params: {
    search?: string
    page: number
    pageSize: number
  }) {
    const resp = await request.get('/user', { params })
    return resp.data
  }

  return { signUp, searchUsers }
}
