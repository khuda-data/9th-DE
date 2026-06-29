import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { fetchMe } from '../api/auth'

export default function AuthCallback() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token')

    if (token) {
      localStorage.setItem('accessToken', token)
      fetchMe()
        .then((user) => {
          login(user)
          navigate('/dashboard', { replace: true })
        })
        .catch(() => navigate('/', { replace: true }))
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return null
}
