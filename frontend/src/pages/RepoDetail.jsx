import { useState, useEffect, useRef } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { GripVertical, ChevronDown } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Layout from '../components/Layout'
import languageLogos from '@/data/languageLogos.json'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

const TABS = ['개요', '기술 스택', '타임라인', '기여 목록/근거', 'README 카드']

export default function RepoDetail({ isViewer = false }) {
  const { repoId, username } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const initialSubtitle = location.state?.subtitle ?? ''
  const [activeTab, setActiveTab] = useState('개요')
  const navRef = useRef(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const btn = nav.querySelector('[data-active="true"]')
    if (btn) setIndicator({ left: btn.offsetLeft, width: btn.offsetWidth })
  }, [activeTab])

  return (
    <Layout>
      <div className="py-8 flex flex-col gap-6 max-w-4xl mx-auto">

        {isViewer && (
          <div className="flex items-center justify-between bg-secondary/60 border border-border rounded-xl px-4 py-3">
            <p className="text-sm text-muted-foreground">
              <span className="text-foreground font-medium">{username}</span>의 포트폴리오 · 읽기 전용
            </p>
            <Button size="sm" onClick={() => navigate('/')}>내 레포 분석하기</Button>
          </div>
        )}

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-muted-foreground text-sm shrink-0">xihxxn /</span>
          <h2 className="text-2xl font-bold text-foreground tracking-tight truncate">ml-pipeline</h2>
        </div>

        <nav ref={navRef} className="relative flex items-center gap-1 overflow-x-auto sticky top-16 bg-background py-1 z-10">
          <div
            className="absolute inset-y-0 rounded-md bg-primary/15 transition-all duration-200 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
          {TABS.map((tab) => (
            <button
              key={tab}
              data-active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`relative z-10 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div>
          {activeTab === '개요'          && <OverviewTab isViewer={isViewer} />}
          {activeTab === '기술 스택'     && <TechStackTab />}
          {activeTab === '타임라인'      && <TimelineTab isViewer={isViewer} />}
          {activeTab === '기여 목록/근거' && <ContributionTab />}
          {activeTab === 'README 카드'   && <ReadmeCardTab initialSubtitle={initialSubtitle} isViewer={isViewer} />}
        </div>

      </div>
    </Layout>
  )
}

const mockActivities = [
  {
    id: 1,
    period: '2024.11',
    title: '프로젝트 초기 설계',
    desc: 'S3 Data Lake 구조 설계 및 GitHub 수집 파이프라인 아키텍처 정의',
    note: '처음에 raw/processed 버킷 구조를 어떻게 나눌지 고민을 많이 했다. 나중에 확장성을 고려해서 레이어를 명확히 분리하길 잘했다고 생각한다.',
  },
  {
    id: 2,
    period: '2024.11 ~ 12',
    title: 'GitHub 수집 파이프라인 구현',
    desc: 'GitHub API 클라이언트 작성 및 S3 raw 버킷 업로더 모듈 개발',
    note: '',
  },
  {
    id: 3,
    period: '2024.12',
    title: 'Airflow DAG 작성 및 스케줄링',
    desc: '수집 파이프라인 자동화를 위한 DAG 작성 및 task 의존성 정의',
    note: 'task 의존성 순서를 잘못 잡아서 두 번 갈아엎었다. DAG 설계는 먼저 흐름도를 그려보고 시작하는 게 맞는 것 같다.',
  },
  {
    id: 4,
    period: '2024.12',
    title: 'PostgreSQL 스키마 설계 및 연동',
    desc: 'processed 데이터 저장을 위한 DB 스키마 설계 및 FastAPI 연동',
    note: '',
  },
]

const AI_SUMMARY = `S3 Data Lake 구조를 직접 설계하고 GitHub API 기반 수집 파이프라인을 구현했습니다. Airflow DAG를 작성해 수집 워크플로우를 자동화했으며, PostgreSQL 스키마를 설계하고 FastAPI와 연동하는 전체 백엔드 흐름을 구축했습니다.`

function OverviewTab({ isViewer = false }) {
  const mdContent = `# ml-pipeline\n\n## AI 프로젝트 요약\n${AI_SUMMARY}\n\n## 주요 활동\n${mockActivities.map((a) => `- ${a.title} (${a.period})`).join('\n')}\n\n## 느낀점\n${mockActivities.map((a) => a.note ? `### ${a.title}\n${a.note}` : '').filter(Boolean).join('\n\n') || '(타임라인에서 기록한 개인 노트가 여기 포함됩니다)'}`
  const [copied, setCopied] = useState(false)

  function handleDownload() {
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ml-pipeline.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(mdContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-foreground font-semibold">AI 프로젝트 요약</p>
          <Badge variant="secondary">기여 근거 기반</Badge>
        </div>
        <p className="text-foreground text-sm leading-relaxed mb-4">{AI_SUMMARY}</p>
        <Separator className="mb-4" />
        <p className="text-muted-foreground text-sm font-medium mb-3">주요 활동 목록</p>
        <ul className="flex flex-col gap-2">
          {mockActivities.map((a) => (
            <li key={a.id} className="flex items-center gap-3 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground">{a.title}</span>
              <span className="text-muted-foreground font-mono text-xs ml-auto shrink-0">{a.period}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-foreground font-semibold">전체 문서 MD 추출</p>
          <p className="text-muted-foreground text-sm mt-1">AI 요약 + 주요 활동 + 느낀점이 포함된 마크다운 파일</p>
        </div>
        <div className="bg-secondary rounded-lg p-5 overflow-y-auto" style={{ height: '420px' }}>
          {isViewer ? (
            <div className="prose prose-sm max-w-none text-foreground
              [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3 [&_h1]:mt-0
              [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mb-2 [&_h2]:mt-4
              [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mb-1 [&_h3]:mt-3
              [&_p]:text-sm [&_p]:leading-relaxed [&_p]:mb-2
              [&_ul]:pl-4 [&_li]:text-sm [&_li]:mb-1 [&_li]:list-disc">
              <ReactMarkdown>{mdContent}</ReactMarkdown>
            </div>
          ) : (
            <pre className="text-foreground text-sm font-mono whitespace-pre-wrap leading-relaxed">{mdContent}</pre>
          )}
        </div>
        {!isViewer && (
          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleDownload}>Markdown으로 내려받기</Button>
            <Button variant="secondary" className="flex-1" onClick={handleCopy}>
              {copied ? '복사됨 ✓' : '복사하기'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

const TECH_STACKS = [
  { name: 'Python', category: '언어', pct: 72 },
  { name: 'SQL', category: '언어', pct: 18 },
  { name: 'Bash', category: '언어', pct: 10 },
  { name: 'FastAPI', category: '프레임워크', pct: null },
  { name: 'Airflow', category: '프레임워크', pct: null },
  { name: 'PostgreSQL', category: '데이터베이스', pct: null },
  { name: 'Docker', category: '인프라', pct: null },
  { name: 'AWS S3', category: '인프라', pct: null },
]


function getLogoEntry(name) {
  const lower = name.toLowerCase()
  const exact = languageLogos.find((l) => l.name.toLowerCase() === lower)
  if (exact) return exact
  const firstWord = lower.split(' ')[0]
  return languageLogos.find((l) => l.name.toLowerCase() === firstWord) ?? null
}

function LogoIcon({ name, className = 'w-5 h-5' }) {
  const entry = getLogoEntry(name)
  if (!entry) return null
  if (entry.devicon_class) {
    return <i className={`${entry.devicon_class} text-foreground`} style={{ fontSize: className.includes('w-4') ? '16px' : '20px' }} />
  }
  return <img src={entry.logo_url} alt={name} className={`${className} object-contain`} />
}

function getTealShades(count) {
  // #14B8A6 ≈ hsl(173, 80%, 40%) → 점점 연해짐
  return Array.from({ length: count }, (_, i) => {
    const l = 40 + (i * 30) / Math.max(count - 1, 1)
    return `hsl(173, 70%, ${l}%)`
  })
}

function TechStackTab() {
  const languages = TECH_STACKS.filter((s) => s.pct !== null)
  const others = TECH_STACKS.filter((s) => s.pct === null)
  const shades = getTealShades(languages.length)

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground font-semibold mb-4">언어 비중</p>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
          {languages.map((l, i) => (
            <div key={l.name} style={{ width: `${l.pct}%`, backgroundColor: shades[i] }} />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {languages.map((l, i) => {
            const hasLogo = !!getLogoEntry(l.name)
            return (
            <div key={l.name} className="flex items-center gap-3">
              {hasLogo
                ? <LogoIcon name={l.name} className="w-4 h-4 shrink-0" />
                : <div className="w-4 h-4 rounded-sm shrink-0" style={{ backgroundColor: shades[i] }} />
              }
              <span className="text-sm text-foreground w-20">{l.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${l.pct}%`, backgroundColor: shades[i] }} />
              </div>
              <span className="text-muted-foreground text-xs font-mono w-8 text-right">{l.pct}%</span>
            </div>
          )})}

        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground font-semibold mb-4">프레임워크 / 툴</p>
        <div className="flex flex-wrap gap-2">
          {others.map((s) => {
            const hasLogo = !!getLogoEntry(s.name)
            return (
              <div key={s.name} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2">
                {hasLogo
                  ? <LogoIcon name={s.name} className="w-5 h-5 shrink-0" />
                  : <div className="w-5 h-5 rounded bg-muted shrink-0" />
                }
                <span className="text-sm text-foreground">{s.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TimelineTab({ isViewer = false }) {
  const [notes, setNotes] = useState(() =>
    Object.fromEntries(mockActivities.map((a) => [a.id, a.note]))
  )

  return (
    <div className="flex flex-col gap-4">
      {mockActivities.map((activity, i) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center pt-1">
            <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
            {i < mockActivities.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
          </div>
          <div className="flex-1 bg-card border border-border rounded-xl p-4 mb-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground text-sm font-medium">{activity.title}</p>
                <p className="text-muted-foreground text-sm">{activity.desc}</p>
              </div>
              <span className="text-muted-foreground text-xs font-mono shrink-0">{activity.period}</span>
            </div>
            <Separator className="my-3" />
            <p className="text-muted-foreground text-sm mb-1.5">개인 노트</p>
            {isViewer ? (
              notes[activity.id]
                ? <p className="text-foreground text-sm leading-relaxed">{notes[activity.id]}</p>
                : <p className="text-muted-foreground text-sm italic">작성된 노트가 없어요.</p>
            ) : (
              <Textarea
                value={notes[activity.id]}
                onChange={(e) => setNotes((prev) => ({ ...prev, [activity.id]: e.target.value }))}
                placeholder="이 활동에 대한 느낀점, 배운 점 등을 기록하세요..."
                className="min-h-[56px] max-h-[420px] text-sm resize-none overflow-y-auto"
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

const REPO_OWNER = 'xihxxn'
const REPO_NAME = 'ml-pipeline'

const mockActions = [
  {
    id: 1,
    title: '데이터 수집 파이프라인 설계 및 구현',
    summary: 'S3 raw 버킷에 GitHub 이벤트 데이터를 적재하는 수집 레이어를 직접 설계하고 구현함',
    commits: [
      { hash: 'a3f2c1d', message: 'feat: S3 업로더 모듈 작성', additions: 120, deletions: 0 },
      { hash: 'b1e9d2a', message: 'feat: GitHub API 호출 클라이언트 구현', additions: 85, deletions: 5 },
    ],
    files: ['pipeline/uploader.py', 'pipeline/github_client.py', 'pipeline/config.py'],
    prs: [{ number: 12, title: 'feat: 데이터 수집 파이프라인 1차 구현' }],
  },
  {
    id: 2,
    title: 'Airflow DAG 작성 및 스케줄링 설정',
    summary: '수집 파이프라인을 주기적으로 실행하기 위한 Airflow DAG을 작성하고 의존성을 정의함',
    commits: [
      { hash: 'c7a3f1b', message: 'feat: collect_dag 초안 작성', additions: 60, deletions: 0 },
      { hash: 'd2b8e4c', message: 'fix: task 의존성 순서 오류 수정', additions: 10, deletions: 8 },
    ],
    files: ['dags/collect_dag.py', 'dags/utils.py'],
    prs: [],
  },
]

function ContributionTab() {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="flex flex-col gap-3">
      {mockActions.map((action) => (
        <div key={action.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === action.id ? null : action.id)}
            aria-expanded={expanded === action.id}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/60 transition-colors duration-150"
          >
            <div className="flex flex-col gap-1">
              <p className="text-foreground font-medium">{action.title}</p>
              <p className="text-muted-foreground text-sm">{action.summary}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 ml-4 transition-transform duration-150 ${expanded === action.id ? 'rotate-180' : ''}`} />
          </button>

          <div className={`grid transition-all duration-200 ease-out ${expanded === action.id ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
            <div className="overflow-hidden">
              <div className="border-t border-border p-5 flex flex-col gap-5">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">커밋</p>
                  <div className="flex flex-col gap-2">
                    {action.commits.map((c) => (
                      <a key={c.hash}
                        href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${c.hash}`}
                        target="_blank" rel="noreferrer"
                        className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2.5 hover:bg-secondary/70 transition-colors duration-150"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <code className="text-xs text-muted-foreground font-mono shrink-0">{c.hash}</code>
                          <p className="text-foreground text-sm truncate">{c.message}</p>
                        </div>
                        <div className="flex gap-2 text-sm shrink-0 ml-3">
                          <span className="text-success">+{c.additions}</span>
                          <span className="text-destructive">-{c.deletions}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-2">수정된 파일</p>
                  <div className="flex flex-col gap-1.5">
                    {action.files.map((f) => (
                      <div key={f} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <code className="text-xs text-muted-foreground font-mono">{f}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {action.prs.length > 0 && (
                  <div>
                    <p className="text-muted-foreground text-sm font-medium mb-2">PR</p>
                    <div className="flex flex-col gap-2">
                      {action.prs.map((pr) => (
                        <a key={pr.number}
                          href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-3 bg-secondary rounded-lg px-4 py-2.5 hover:bg-secondary/70 transition-colors duration-150"
                        >
                          <span className="text-muted-foreground text-xs font-mono">#{pr.number}</span>
                          <p className="text-foreground text-sm">{pr.title}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


const SECTION_COLORS = {
  ai_summary:           { bg: '#D8F9FD', text: '#418FAF' },
  techstack:            { bg: '#DEEAFC', text: '#3762E3' },
  timeline:             { bg: '#F1E9FD', text: '#883AE2' },
  timeline_memo:        { bg: '#F9E8F3', text: '#CA3B76' },
  contributions:        { bg: '#E2FBE9', text: '#4CA154' },
  contribution_evidence:{ bg: '#FCEED8', text: '#D9622B' },
}

const DEFAULT_SECTIONS = [
  { id: 'ai_summary', label: 'AI 프로젝트 요약', on: true },
  { id: 'techstack', label: '기술 스택', on: true },
  { id: 'timeline', label: '타임라인', on: true },
  { id: 'timeline_memo', label: '타임라인 메모', on: false },
  { id: 'contributions', label: '기여 목록', on: true },
  { id: 'contribution_evidence', label: '기여 근거', on: false },
]

function SortableSection({ section, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-colors duration-150 ${
        section.on ? 'border-border bg-secondary' : 'border-transparent opacity-50'
      }`}
    >
      <Switch
        checked={section.on}
        onCheckedChange={() => onToggle(section.id)}
        aria-label={`${section.label} 표시 여부`}
      />
      <span className="text-sm text-foreground flex-1">{section.label}</span>
      <button {...listeners} {...attributes}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5 touch-none shrink-0"
        aria-label="드래그하여 순서 변경"
      >
        <GripVertical className="w-4 h-4" />
      </button>
    </div>
  )
}

function SectionLabel({ id, label }) {
  const c = SECTION_COLORS[id]
  return (
    <span
      className="self-start inline-block text-sm font-semibold px-2.5 py-0.5 rounded-full mb-2 cursor-default"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {label}
    </span>
  )
}

function ReadmeCardTab({ initialSubtitle = '', isViewer = false }) {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [subtitle, setSubtitle] = useState(initialSubtitle)
  const [copied, setCopied] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  const cardMarkdown = '![GitIntel Card](https://gitintel.app/card/...)'

  async function handleCopy() {
    await navigator.clipboard.writeText(cardMarkdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function toggle(id) {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, on: !s.on } : s))
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSections((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id)
        const newIndex = prev.findIndex((s) => s.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const activeSections = sections.filter((s) => s.on)

  return (
    <div className="flex flex-col gap-6">
      <div className={`grid grid-cols-1 gap-6 ${!isViewer ? 'lg:grid-cols-2' : ''}`}>

        {!isViewer && <div className="flex flex-col gap-4">
          <p className="text-foreground font-semibold text-sm">카드 구성</p>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">프로젝트 부제목</label>
              <span className="text-xs text-muted-foreground">GitIntel 내에서만 수정됨</span>
            </div>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: ETL 파이프라인 & 데이터 인프라"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">드래그로 순서 변경, 토글로 on/off</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-1.5">
                  {sections.map((section) => (
                    <SortableSection key={section.id} section={section} onToggle={toggle} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>}

        <div className="flex flex-col gap-2">
          <p className="text-foreground font-semibold text-sm">카드 미리보기</p>
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
              <div>
                <p className="text-foreground font-medium text-sm">ml-pipeline</p>
                {subtitle && <p className="text-muted-foreground text-xs mt-0.5">{subtitle}</p>}
              </div>
            </div>

            {activeSections.map((s) => (
              <div key={s.id} className="border-t border-border pt-3">
                {s.id === 'ai_summary' && (
                  <div>
                    <SectionLabel id="ai_summary" label="AI 프로젝트 요약" />
                    <p className="text-foreground text-xs leading-relaxed">{AI_SUMMARY}</p>
                  </div>
                )}
                {s.id === 'techstack' && (
                  <div>
                    <SectionLabel id="techstack" label="기술 스택" />
                    <div className="flex gap-1.5 flex-wrap">
                      {['Python', 'FastAPI', 'Airflow', 'PostgreSQL', 'Docker'].map((t) => {
                        const hasLogo = !!getLogoEntry(t)
                        return hasLogo ? (
                          <LogoIcon key={t} name={t} className="w-5 h-5" />
                        ) : (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-secondary text-foreground">{t}</span>
                        )
                      })}
                    </div>
                  </div>
                )}
                {s.id === 'timeline' && (
                  <div>
                    <SectionLabel id="timeline" label="타임라인" />
                    <ul className="flex flex-col gap-1">
                      {mockActivities.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-xs">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground shrink-0" />
                          <span className="text-foreground">{a.title}</span>
                          <span className="text-muted-foreground font-mono ml-auto shrink-0">{a.period}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.id === 'timeline_memo' && (() => {
                  const withNotes = mockActivities.filter((a) => a.note)
                  if (withNotes.length === 0) return null
                  return (
                    <div className="flex flex-col gap-3">
                      <SectionLabel id="timeline_memo" label="타임라인 메모" />
                      {withNotes.map((a) => (
                        <div key={a.id}>
                          <p className="text-foreground text-xs font-medium mb-0.5">{a.title}</p>
                          <p className="text-muted-foreground text-xs leading-relaxed">{a.note}</p>
                        </div>
                      ))}
                    </div>
                  )
                })()}
                {s.id === 'contributions' && (
                  <div>
                    <SectionLabel id="contributions" label="기여 목록" />
                    <ul className="flex flex-col gap-0.5">
                      {['데이터 수집 파이프라인 설계', 'Airflow DAG 작성'].map((c) => (
                        <li key={c} className="text-foreground text-xs flex gap-2"><span>•</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.id === 'contribution_evidence' && (
                  <div>
                    <SectionLabel id="contribution_evidence" label="기여 근거" />
                    <p className="text-muted-foreground text-xs">커밋 a3f2c1d, b1e9d2a 외 2개 · 파일 5개 수정</p>
                  </div>
                )}
              </div>
            ))}

            {activeSections.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-6 leading-relaxed">
                표시할 섹션이 없어요.<br />왼쪽에서 항목을 켜주세요.
              </p>
            )}
          </div>
        </div>
      </div>

      {!isViewer && (
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
          <div>
            <p className="text-foreground font-semibold text-sm">카드 Markdown 추출</p>
            <p className="text-muted-foreground text-sm mt-0.5">위 카드 구성 기준으로 추출</p>
          </div>
          <div className="bg-secondary rounded-lg p-3">
            <p className="text-muted-foreground text-xs font-mono">{cardMarkdown}</p>
          </div>
          <Button className="w-full" onClick={handleCopy}>
            {copied ? '복사됨 ✓' : '카드 Markdown 복사'}
          </Button>
        </div>
      )}
    </div>
  )
}
