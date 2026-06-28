import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Layout from '../components/Layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const mockCommitActivity = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 8 },
  { month: 'Mar', count: 23 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 31 },
  { month: 'Jun', count: 19 },
  { month: 'Jul', count: 28 },
  { month: 'Aug', count: 42 },
  { month: 'Sep', count: 35 },
  { month: 'Oct', count: 18 },
  { month: 'Nov', count: 27 },
  { month: 'Dec', count: 14 },
]


function StatsSection() {
  const maxCount = Math.max(...mockCommitActivity.map((d) => d.count))
  const totalCommits = mockCommitActivity.reduce((s, d) => s + d.count, 0)

  return (
    <section className="flex flex-col gap-6 pb-10 border-b border-border">
      {/* 요약 수치 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '등록 레포', value: '3' },
          { label: '총 커밋', value: totalCommits.toLocaleString() },
          { label: '사용 언어', value: '5개' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <p className="text-muted-foreground text-sm mb-1">{label}</p>
            <p className="text-foreground text-2xl font-bold tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* 커밋 활동 */}
      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
        <p className="text-foreground font-semibold">커밋 활동</p>
        <div className="flex items-end gap-1.5">
          {mockCommitActivity.map((d) => {
            const barH = Math.round((d.count / maxCount) * 120)
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-muted-foreground font-mono" style={{ fontSize: '10px' }}>{d.count}</span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${barH}px`,
                    backgroundColor: 'var(--brand-primary)',
                    opacity: 0.25 + (d.count / maxCount) * 0.75,
                  }}
                />
                <span className="text-muted-foreground font-mono" style={{ fontSize: '9px' }}>{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const mockRepos = [
  {
    id: 1,
    name: 'ml-pipeline',
    owner: 'xihxxn',
    subtitle: 'ETL 파이프라인 & 데이터 인프라',
    lastUpdated: '2025.06.28',
    aiSummary: 'GitHub 이벤트 데이터를 S3에 수집하고 Airflow로 자동화한 ML 데이터 파이프라인. PostgreSQL 기반 분석 레이어와 FastAPI 서빙까지 직접 구현함.',
    techStack: ['Python', 'FastAPI', 'Airflow', 'PostgreSQL', 'S3'],
    timeline: [
      { title: '프로젝트 초기 설계', period: '2024.11' },
      { title: 'GitHub 수집 파이프라인 구현', period: '2024.11~12' },
      { title: 'Airflow DAG 작성 및 스케줄링', period: '2024.12' },
      { title: 'PostgreSQL 스키마 설계 및 연동', period: '2024.12' },
    ],
    contributions: ['데이터 수집 파이프라인 설계 및 구현', 'Airflow DAG 작성 및 스케줄링 설정'],
  },
  {
    id: 2,
    name: 'data-crawler',
    owner: 'xihxxn',
    subtitle: '웹 크롤러 & 데이터 수집기',
    lastUpdated: '2025.06.28',
    aiSummary: 'Scrapy 기반 웹 크롤러로 대용량 데이터를 수집하고 정제하는 파이프라인 프로젝트.',
    techStack: ['Python', 'Scrapy', 'Redis', 'MongoDB'],
    timeline: [
      { title: '크롤러 아키텍처 설계', period: '2024.10' },
      { title: '사이트별 파서 구현', period: '2024.10~11' },
    ],
    contributions: ['크롤러 설계 및 구현', '데이터 정제 파이프라인 작성'],
  },
  {
    id: 3,
    name: 'fastapi-server',
    owner: 'xihxxn',
    subtitle: 'REST API 백엔드 서버',
    lastUpdated: '2025.06.25',
    aiSummary: 'FastAPI와 PostgreSQL을 활용한 REST API 서버. JWT 인증과 비동기 처리를 중심으로 설계.',
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    timeline: [
      { title: 'API 설계 및 초기 세팅', period: '2024.09' },
      { title: 'JWT 인증 구현', period: '2024.09' },
      { title: 'DB 모델 설계 및 연동', period: '2024.09~10' },
    ],
    contributions: ['API 엔드포인트 설계 및 구현', 'JWT 인증 미들웨어 작성'],
  },
]

function PublicSwitch({ isPublic, onToggle }) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-2 shrink-0"
    >
      <span className="text-xs text-muted-foreground">private</span>
      <Switch checked={isPublic} onCheckedChange={onToggle} />
      <span className={`text-xs font-medium transition-colors ${isPublic ? 'text-primary' : 'text-muted-foreground'}`}>
        public
      </span>
    </div>
  )
}

function FeaturedRepoCard({ repo, isPublic, onTogglePublic }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/repo/${repo.id}`)}
      className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/40 transition-colors duration-150"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary shrink-0" />
          <div>
            <p className="text-foreground font-bold text-lg tracking-tight">{repo.name}</p>
            {repo.subtitle && <p className="text-muted-foreground text-sm mt-0.5">{repo.subtitle}</p>}
          </div>
        </div>
        <PublicSwitch isPublic={isPublic} onToggle={onTogglePublic} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 flex flex-col gap-4">
          <p className="text-foreground text-sm leading-relaxed">{repo.aiSummary}</p>
          <div className="flex gap-1.5 flex-wrap">
            {repo.techStack.map((t) => (
              <Badge key={t} variant="secondary">{t}</Badge>
            ))}
          </div>
        </div>

        <div className="md:border-l md:border-border md:pl-6 flex flex-col justify-between gap-3">
          <ul className="flex flex-col gap-2">
            {repo.timeline.map((a) => (
              <li key={a.title} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                <span className="text-foreground text-sm leading-snug">{a.title}</span>
              </li>
            ))}
          </ul>
          <p className="text-muted-foreground text-sm">업데이트 {repo.lastUpdated}</p>
        </div>
      </div>
    </div>
  )
}

function CompactRepoCard({ repo, isPublic, onTogglePublic }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/repo/${repo.id}`)}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:border-primary/40 transition-colors duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-secondary shrink-0" />
          <div>
            <p className="text-foreground font-semibold text-base">{repo.name}</p>
            {repo.subtitle && <p className="text-muted-foreground text-sm mt-0.5">{repo.subtitle}</p>}
          </div>
        </div>
        <PublicSwitch isPublic={isPublic} onToggle={onTogglePublic} />
      </div>

      <p className="text-foreground text-sm leading-relaxed line-clamp-2">{repo.aiSummary}</p>

      <div className="flex gap-1.5 flex-wrap">
        {repo.techStack.slice(0, 3).map((t) => (
          <Badge key={t} variant="secondary">{t}</Badge>
        ))}
        {repo.techStack.length > 3 && (
          <span className="text-sm text-muted-foreground">+{repo.techStack.length - 3}</span>
        )}
      </div>

      <Separator />
      <p className="text-muted-foreground text-sm">업데이트 {repo.lastUpdated}</p>
    </div>
  )
}

export default function Dashboard() {
  const location = useLocation()
  const [publicMap, setPublicMap] = useState(() =>
    Object.fromEntries(mockRepos.map((r) => [r.id, true]))
  )
  const statsRef = useRef(null)

  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    requestAnimationFrame(() => {
      if (target === 'repos') {
        const el = document.getElementById('repos-section')
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }, [])

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    // stats 섹션이 화면 위로 사라지면(scrolled past) → teal, 다시 보이면 → gray
    const observer = new IntersectionObserver(
      ([entry]) => window.dispatchEvent(new CustomEvent('repos-visibility', { detail: !entry.isIntersecting })),
      { threshold: 0, rootMargin: '-56px 0px 0px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function togglePublic(id) {
    setPublicMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const [featured, ...rest] = mockRepos

  return (
    <Layout>
      <div className="py-8 flex flex-col gap-8">

        <div ref={statsRef} id="stats-section"><StatsSection /></div>

        <div id="repos-section" className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground tracking-tight">레포지토리</h2>
          <Button>
            <Plus className="w-4 h-4" />
            등록
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          <FeaturedRepoCard
            repo={featured}
            isPublic={publicMap[featured.id]}
            onTogglePublic={() => togglePublic(featured.id)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {rest.map((repo) => (
              <CompactRepoCard
                key={repo.id}
                repo={repo}
                isPublic={publicMap[repo.id]}
                onTogglePublic={() => togglePublic(repo.id)}
              />
            ))}
          </div>
        </div>

      </div>
    </Layout>
  )
}
