import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { GripVertical } from 'lucide-react'
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

const TABS = ['개요', '기술 스택', '타임라인', '기여 목록/근거', 'README 카드']

export default function RepoDetail() {
  const { repoId } = useParams()
  const [activeTab, setActiveTab] = useState('개요')

  return (
    <Layout>
      <div className="p-8 flex flex-col gap-6">

        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground text-sm">xihxxn /</p>
            <h2 className="text-2xl font-bold text-foreground">ml-pipeline</h2>
            <p className="text-muted-foreground text-sm mt-1">머신러닝 파이프라인 프로젝트</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">분석 완료</span>
        </div>

        <div className="flex gap-1 border-b border-border">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-foreground border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div>
          {activeTab === '개요' && <OverviewTab />}
          {activeTab === '기술 스택' && <TechStackTab />}
          {activeTab === '타임라인' && <TimelineTab />}
          {activeTab === '기여 목록/근거' && <ContributionTab />}
          {activeTab === 'README 카드' && <ReadmeCardTab />}
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

function OverviewTab() {
  const mdContent = `# ml-pipeline

## AI 프로젝트 요약
${AI_SUMMARY}

## 주요 활동
${mockActivities.map((a) => `- ${a.title} (${a.period})`).join('\n')}

## 느낀점
${mockActivities.map((a) => a.note ? `### ${a.title}\n${a.note}` : '').filter(Boolean).join('\n\n') || '(타임라인에서 기록한 개인 노트가 여기 포함됩니다)'}`

  return (
    <div className="flex flex-col gap-5">

      {/* AI 요약 */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-foreground font-semibold">AI 프로젝트 요약</p>
          <span className="text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5 bg-secondary">기여 근거 기반</span>
        </div>
        <p className="text-foreground text-sm leading-relaxed mb-4">{AI_SUMMARY}</p>
        <div className="border-t border-border pt-4">
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-3">주요 활동 목록</p>
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
      </div>

      {/* MD 추출 */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
        <div>
          <p className="text-foreground font-semibold">전체 문서 MD 추출</p>
          <p className="text-muted-foreground text-xs mt-1">AI 요약 + 주요 활동 + 느낀점이 포함된 마크다운 파일</p>
        </div>
        <div className="bg-secondary rounded-lg p-4 max-h-48 overflow-y-auto">
          <pre className="text-muted-foreground text-xs font-mono whitespace-pre-wrap">{mdContent}</pre>
        </div>
        <button className="w-full bg-primary text-primary-foreground text-sm py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
          MD 파일 다운로드
        </button>
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

const CATEGORY_COLOR = {
  '언어': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  '프레임워크': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  '데이터베이스': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  '인프라': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

function TechStackTab() {
  const languages = TECH_STACKS.filter((s) => s.pct !== null)
  const others = TECH_STACKS.filter((s) => s.pct === null)

  return (
    <div className="flex flex-col gap-5">

      {/* 언어 비중 */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground font-semibold mb-4">언어 비중</p>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5 mb-4">
          {languages.map((l) => (
            <div
              key={l.name}
              style={{ width: `${l.pct}%` }}
              className={`${l.name === 'Python' ? 'bg-blue-400' : l.name === 'SQL' ? 'bg-pink-400' : 'bg-slate-400'}`}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {languages.map((l) => (
            <div key={l.name} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-muted shrink-0" />
              <span className="text-sm text-foreground w-20">{l.name}</span>
              <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${l.name === 'Python' ? 'bg-blue-400' : l.name === 'SQL' ? 'bg-pink-400' : 'bg-slate-400'}`}
                  style={{ width: `${l.pct}%` }}
                />
              </div>
              <span className="text-muted-foreground text-xs font-mono w-8 text-right">{l.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* 프레임워크 / 툴 */}
      <div className="bg-card border border-border rounded-xl p-6">
        <p className="text-foreground font-semibold mb-4">프레임워크 / 툴</p>
        <div className="flex flex-wrap gap-2">
          {others.map((s) => (
            <div key={s.name} className="flex items-center gap-2 bg-secondary border border-border rounded-lg px-3 py-2">
              <div className="w-5 h-5 rounded bg-muted shrink-0" />
              <span className="text-sm text-foreground">{s.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded border ${CATEGORY_COLOR[s.category]}`}>
                {s.category}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

function TimelineTab() {
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
                <p className="text-muted-foreground text-xs">{activity.desc}</p>
              </div>
              <span className="text-muted-foreground text-xs font-mono shrink-0">{activity.period}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-muted-foreground text-xs mb-1.5">개인 노트</p>
              <textarea
                value={notes[activity.id]}
                onChange={(e) => setNotes((prev) => ({ ...prev, [activity.id]: e.target.value }))}
                placeholder="이 활동에 대한 느낀점, 배운 점 등을 기록하세요..."
                className="w-full bg-secondary text-foreground text-xs rounded-lg px-3 py-2 resize-none placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring min-h-[56px]"
              />
            </div>
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
    <div className="flex flex-col gap-4">
      {mockActions.map((action) => (
        <div key={action.id} className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === action.id ? null : action.id)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary transition-colors"
          >
            <div className="flex flex-col gap-1">
              <p className="text-foreground font-medium">{action.title}</p>
              <p className="text-muted-foreground text-sm">{action.summary}</p>
            </div>
            <span className="text-muted-foreground text-xs ml-4 shrink-0">
              {expanded === action.id ? '▲ 접기' : '▼ 펼치기'}
            </span>
          </button>

          {expanded === action.id && (
            <div className="border-t border-border p-5 flex flex-col gap-5">
              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">커밋</p>
                <div className="flex flex-col gap-2">
                  {action.commits.map((c) => (
                    <a
                      key={c.hash}
                      href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/${c.hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between bg-secondary rounded-lg px-4 py-2 hover:bg-secondary/70 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <code className="text-xs text-muted-foreground font-mono">{c.hash}</code>
                        <p className="text-foreground text-sm">{c.message}</p>
                      </div>
                      <div className="flex gap-2 text-xs shrink-0">
                        <span className="text-emerald-400">+{c.additions}</span>
                        <span className="text-red-400">-{c.deletions}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">수정된 파일</p>
                <div className="flex flex-col gap-1">
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
                  <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">PR</p>
                  <div className="flex flex-col gap-2">
                    {action.prs.map((pr) => (
                      <a
                        key={pr.number}
                        href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/pull/${pr.number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 bg-secondary rounded-lg px-4 py-2 hover:bg-secondary/70 transition-colors"
                      >
                        <span className="text-muted-foreground text-xs">#{pr.number}</span>
                        <p className="text-foreground text-sm">{pr.title}</p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
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
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 border transition-colors ${
        section.on ? 'border-border bg-secondary' : 'border-transparent opacity-50'
      }`}
    >
      <button
        onClick={() => onToggle(section.id)}
        className={`w-8 h-4 rounded-full transition-colors relative shrink-0 ${section.on ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${section.on ? 'left-4' : 'left-0.5'}`} />
      </button>
      <span className="text-sm text-foreground flex-1">{section.label}</span>
      <button
        {...listeners}
        {...attributes}
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-0.5 touch-none shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </button>
    </div>
  )
}

function ReadmeCardTab() {
  const [sections, setSections] = useState(DEFAULT_SECTIONS)
  const [subtitle, setSubtitle] = useState('')
  const sensors = useSensors(useSensor(PointerSensor))

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
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-foreground font-semibold text-sm">카드 구성</p>

          {/* 부제목 입력 */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">프로젝트 부제목</p>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="예: ETL 파이프라인 & 데이터 인프라"
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* 섹션 토글 */}
          <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
            <p className="text-muted-foreground text-xs mb-1">드래그로 순서 변경, 토글로 on/off</p>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-2">
                  {sections.map((section) => (
                    <SortableSection key={section.id} section={section} onToggle={toggle} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </div>

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
                    <p className="text-muted-foreground text-xs mb-1">AI 프로젝트 요약</p>
                    <p className="text-foreground text-xs leading-relaxed">{AI_SUMMARY}</p>
                  </div>
                )}
                {s.id === 'techstack' && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">기술 스택</p>
                    <div className="flex gap-1 flex-wrap">
                      {['Python', 'FastAPI', 'Airflow'].map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 bg-secondary border border-border rounded-full text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {s.id === 'timeline' && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-2">타임라인</p>
                    <ul className="flex flex-col gap-1">
                      {mockActivities.map((a) => (
                        <li key={a.id} className="flex items-center gap-2 text-xs">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
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
                      <p className="text-muted-foreground text-xs">타임라인 메모</p>
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
                    <p className="text-muted-foreground text-xs mb-1">기여 목록</p>
                    <ul className="flex flex-col gap-0.5">
                      {['데이터 수집 파이프라인 설계', 'Airflow DAG 작성'].map((c) => (
                        <li key={c} className="text-foreground text-xs flex gap-2"><span>•</span>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {s.id === 'contribution_evidence' && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">기여 근거</p>
                    <p className="text-muted-foreground text-xs">커밋 a3f2c1d, b1e9d2a 외 2개 · 파일 5개 수정</p>
                  </div>
                )}
              </div>
            ))}

            {activeSections.length === 0 && (
              <p className="text-muted-foreground text-xs text-center py-4">표시할 항목이 없습니다</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
        <div>
          <p className="text-foreground font-semibold text-sm">카드 Markdown 추출</p>
          <p className="text-muted-foreground text-xs mt-0.5">위 카드 구성 기준으로 추출</p>
        </div>
        <div className="bg-secondary rounded-lg p-3">
          <p className="text-muted-foreground text-xs font-mono">![GitIntel Card](https://gitintel.app/card/...)</p>
        </div>
        <button className="w-full bg-primary text-primary-foreground text-sm py-2 rounded-lg hover:bg-primary/90 transition-colors">
          카드 Markdown 복사
        </button>
      </div>
    </div>
  )
}
