import { useNavigate } from 'react-router-dom'
import { ArrowRight, Zap, Sun, Moon } from 'lucide-react'
import { useTheme } from '../store/theme'

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-8">

      {/* 테마 토글 */}
      <button
        onClick={toggle}
        className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors border border-border"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="text-center flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full text-xs font-medium mx-auto">
          <Zap className="w-3 h-3" />
          베타 출시 · AI 분석 기반
        </div>
        <h1 className="text-5xl font-bold text-foreground">GitIntel</h1>
        <p className="text-muted-foreground text-lg">
          GitHub 활동을 증거 기반으로 분석해서 포트폴리오로 만들어드립니다
        </p>
      </div>

      <div className="w-96 border border-border rounded-xl p-8 flex flex-col gap-6 bg-card">
        <div className="text-center">
          <p className="text-foreground font-semibold text-lg">시작하기</p>
          <p className="text-muted-foreground text-sm mt-1">GitHub 계정으로 로그인하세요</p>
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <GithubIcon className="w-5 h-5" />
          GitHub으로 로그인
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs text-muted-foreground">
          로그인 시 레포지토리 읽기 권한이 요청됩니다
        </p>
      </div>

      <div className="flex gap-12 mt-4">
        {[
          { label: '기술 스택 분석', desc: '레포에서 자동 추출' },
          { label: 'AI 기여 요약', desc: '커밋 기반 자동 생성' },
          { label: 'README 카드', desc: '포트폴리오 쇼케이스' },
        ].map(({ label, desc }) => (
          <div key={label} className="text-center">
            <div className="w-12 h-12 rounded-lg bg-secondary mx-auto mb-2" />
            <p className="text-foreground text-sm font-medium">{label}</p>
            <p className="text-muted-foreground text-xs">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
