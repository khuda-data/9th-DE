import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sun, Moon } from 'lucide-react'
import { useTheme } from '../store/theme'
import { useAuth } from '../store/auth'
import { Button } from '@/components/ui/button'
import techLight from '@/assets/tech-analysis-light.png'
import techDark  from '@/assets/tech-analysis-dark.png'
import aiLight   from '@/assets/ai-summary-light.png'
import aiDark    from '@/assets/ai-summary-dark.png'
import cardLight from '@/assets/readme-card-light.png'
import cardDark  from '@/assets/readme-card-dark.png'

function GithubIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const { user, login } = useAuth()

  // 이미 로그인된 경우 대시보드로
  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  function handleGithubLogin() {
    // 백엔드 연동 후:
    // window.location.href = `${API_BASE}/auth/github?redirect_uri=${window.location.origin}/auth/callback`

    // 프로토타입: 모의 로그인
    login({ login: 'xihxxn', name: 'Sihyun', avatar_url: null })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-10 px-4">

      <Button
        variant="ghost"
        size="icon"
        onClick={toggle}
        aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
        className="absolute top-5 right-5"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </Button>

      <div className="text-center flex flex-col gap-3 max-w-lg">
        <h1 className="text-5xl font-bold text-foreground tracking-tight">Trace</h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          GitHub 활동 하나하나를 추적해<br />기술 스택, 기여 요약, 포트폴리오 카드로 연결해드립니다
        </p>
      </div>

      <div className="w-full max-w-sm border border-border rounded-2xl p-6 flex flex-col gap-4 bg-card">
        <Button size="lg" className="w-full gap-3" onClick={handleGithubLogin}>
          <GithubIcon className="w-5 h-5" />
          GitHub으로 로그인
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          레포지토리 읽기 권한이 요청됩니다
        </p>
      </div>

      <div className="flex gap-12">
        {[
          { label: '기술 스택 분석', light: techLight, dark: techDark },
          { label: 'AI 기여 요약',   light: aiLight,   dark: aiDark   },
          { label: 'README 카드',    light: cardLight, dark: cardDark  },
        ].map(({ label, light, dark }) => (
          <div key={label} className="text-center">
            <div className="w-14 h-14 rounded-3xl overflow-hidden mx-auto mb-3">
              <img
                src={theme === 'dark' ? dark : light}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-foreground text-sm font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
