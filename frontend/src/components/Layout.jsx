import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from '../store/theme'
import { useAuth } from '../store/auth'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function scrollToSection(id, offset = 64) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Layout({ children }) {
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [reposVisible, setReposVisible] = useState(false)

  useEffect(() => {
    setReposVisible(false)
    const handler = (e) => setReposVisible(e.detail)
    window.addEventListener('repos-visibility', handler)
    return () => window.removeEventListener('repos-visibility', handler)
  }, [location.pathname])

  function handleTrace() {
    if (location.pathname === '/dashboard') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/dashboard', { state: { scrollTo: 'stats' } })
    }
  }

  function handleDashboard() {
    if (location.pathname === '/dashboard') {
      scrollToSection('repos-section')
    } else {
      navigate('/dashboard', { state: { scrollTo: 'repos' } })
    }
  }

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="h-16 border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto h-full px-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={handleTrace}
              className="flex items-center gap-2 text-base font-bold text-foreground tracking-tight hover:text-primary transition-colors duration-150"
            >
              <img src="/favicon.png" alt="" className="w-5 h-5 object-contain" />
              Trace
            </button>
            <Separator orientation="vertical" className="h-4" />
            <nav className="flex items-center gap-1">
              <button
                onClick={handleDashboard}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors duration-150 ${
                  reposVisible
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }`}
              >
                대시보드
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              className="w-9 h-9 text-muted-foreground"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-secondary/60 transition-colors duration-150">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.avatar_url
                      ? <img src={user.avatar_url} alt={user.login} className="w-full h-full object-cover" />
                      : <GithubIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </div>
                  <span className="text-sm text-foreground font-medium">{user?.login ?? 'guest'}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {user?.name && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-xs text-muted-foreground">{user.name}</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-screen-xl mx-auto px-16">
          {children}
        </div>
      </main>
    </div>
  )
}
