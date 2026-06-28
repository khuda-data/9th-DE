import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import Layout from '../components/Layout'

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

function RepoCard({ repo, isPublic, onTogglePublic }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/repo/${repo.id}`)}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 cursor-pointer hover:border-primary/40 transition-colors"
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
          <div>
            <p className="text-foreground font-medium text-sm">{repo.name}</p>
            {repo.subtitle && <p className="text-muted-foreground text-xs mt-0.5">{repo.subtitle}</p>}
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePublic() }}
          className="shrink-0 flex items-center gap-1.5"
        >
          <span className={`text-xs transition-colors ${isPublic ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>private</span>
          <div className={`relative w-9 h-5 rounded-full transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-muted'}`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${isPublic ? 'left-[18px]' : 'left-0.5'}`} />
          </div>
          <span className={`text-xs transition-colors ${isPublic ? 'text-emerald-400 font-medium' : 'text-muted-foreground'}`}>public</span>
        </button>
      </div>

      {/* AI 요약 */}
      <div className="border-t border-border pt-3">
        <p className="text-muted-foreground text-xs mb-1">AI 프로젝트 요약</p>
        <p className="text-foreground text-xs leading-relaxed line-clamp-2">{repo.aiSummary}</p>
      </div>

      {/* 기술 스택 */}
      <div className="border-t border-border pt-3">
        <p className="text-muted-foreground text-xs mb-2">기술 스택</p>
        <div className="flex gap-1 flex-wrap">
          {repo.techStack.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* 타임라인 */}
      <div className="border-t border-border pt-3">
        <p className="text-muted-foreground text-xs mb-2">타임라인</p>
        <ul className="flex flex-col gap-1">
          {repo.timeline.map((a) => (
            <li key={a.title} className="flex items-center gap-2 text-xs">
              <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
              <span className="text-foreground">{a.title}</span>
              <span className="text-muted-foreground font-mono ml-auto shrink-0">{a.period}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 기여 목록 */}
      <div className="border-t border-border pt-3">
        <p className="text-muted-foreground text-xs mb-2">기여 목록</p>
        <ul className="flex flex-col gap-1">
          {repo.contributions.map((c) => (
            <li key={c} className="flex items-start gap-2 text-xs">
              <span className="mt-1 w-1 h-1 rounded-full bg-primary shrink-0" />
              <span className="text-foreground">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 푸터 */}
      <div className="border-t border-border pt-3 flex items-center justify-end">
        <p className="text-muted-foreground text-xs">마지막 업데이트 {repo.lastUpdated}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [publicMap, setPublicMap] = useState(() =>
    Object.fromEntries(mockRepos.map((r) => [r.id, true]))
  )

  function togglePublic(id) {
    setPublicMap((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <Layout>
      <div className="p-8 flex flex-col gap-8">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">대시보드</h2>
            <p className="text-muted-foreground text-sm mt-1">등록된 레포지토리를 확인하세요</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            레포지토리 등록
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {mockRepos.map((repo) => (
            <RepoCard
              key={repo.id}
              repo={repo}
              isPublic={publicMap[repo.id]}
              onTogglePublic={() => togglePublic(repo.id)}
            />
          ))}
        </div>

      </div>
    </Layout>
  )
}
