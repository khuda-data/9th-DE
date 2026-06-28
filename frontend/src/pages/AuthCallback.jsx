import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token')

    if (token) {
      localStorage.setItem('accessToken', token)
      // TODO: GET /auth/me 호출해서 유저 정보 받아온 뒤 login() 호출
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return null
}
