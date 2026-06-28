import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/auth'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import RepoDetail from './pages/RepoDetail'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/" replace />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/repo/:repoId" element={<PrivateRoute><RepoDetail /></PrivateRoute>} />
      {/* 공개 쇼케이스 — 비로그인 접근 가능 */}
      <Route path="/u/:username/:repoId" element={<RepoDetail isViewer />} />
    </Routes>
  )
}

export default App
