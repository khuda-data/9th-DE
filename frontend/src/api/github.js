// 백엔드 연동 시 BASE_URL을 설정하고 fetch 대상을 백엔드 엔드포인트로 교체
const BASE_URL = null // 'https://api.gitintel.app'

/**
 * 레포지토리 정보 조회
 * 백엔드 연동 후: POST ${BASE_URL}/api/repos/search { owner, repo }
 */
export async function fetchRepo(owner, repo) {
  if (BASE_URL) {
    const res = await fetch(`${BASE_URL}/api/repos/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ owner, repo }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new ApiError(res.status, err.message)
    }
    return res.json()
  }

  // 백엔드 없는 경우 GitHub Public API 직접 호출 (프로토타입용)
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`)
  if (res.status === 404) throw new ApiError(404, '레포를 찾을 수 없어요.')
  if (res.status === 403) throw new ApiError(403, '비공개 레포이거나 접근 권한이 없어요.')
  if (!res.ok) throw new ApiError(res.status, '오류가 발생했어요. 다시 시도해주세요.')
  return res.json()
}

export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
