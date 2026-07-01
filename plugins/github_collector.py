"""
GitHub 커밋 수집: 레포의 커밋을 긁어와 raw_{REPO}.json 으로 저장 (증분 지원)
실행: python github_collector.py <owner> <repo>   (인자 없으면 .env 의 OWNER/REPO 사용)
"""
import os
import sys
import json
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.environ.get("GITHUB_TOKEN")
# 레포는 명령어 인자 우선, 없으면 .env
if len(sys.argv) >= 3:
    OWNER, REPO = sys.argv[1], sys.argv[2]
else:
    OWNER = os.environ.get("OWNER")
    REPO = os.environ.get("REPO")

if not all([TOKEN, OWNER, REPO]):
    raise SystemExit(
        "필요: GITHUB_TOKEN(.env) + OWNER/REPO(.env 또는 인자)\n"
        "예) python github_collector.py kwang-i-coder ACC-springStudy"
    )

headers = {"Authorization": f"Bearer {TOKEN}"}
BASE = f"https://api.github.com/repos/{OWNER}/{REPO}"


def get(url):
    res = requests.get(url, headers=headers)
    print(f"  [GET {url}] -> {res.status_code}")
    res.raise_for_status()
    return res.json()


def get_all(url):
    """페이지를 끝까지 넘겨가며 전부 받기 (pagination)."""
    items = []
    page = 1
    while True:
        sep = "&" if "?" in url else "?"
        res = requests.get(f"{url}{sep}page={page}", headers=headers)
        print(f"  [GET {url}{sep}page={page}] -> {res.status_code}")
        res.raise_for_status()
        batch = res.json()
        if not batch:
            break
        items.extend(batch)
        if len(batch) < 100:  
            break
        page += 1
    return items


# 지난번 수집 지점(checkpoint)을 읽어 그 이후 커밋만 받는다 ---
CHECKPOINT_PATH = "checkpoint.json"
repo_key = f"{OWNER}/{REPO}"

if os.path.exists(CHECKPOINT_PATH):
    with open(CHECKPOINT_PATH, encoding="utf-8") as f:
        checkpoint = json.load(f)
else:
    checkpoint = {}

last_seen = checkpoint.get(repo_key)  # 없으면 처음 수집
if last_seen:
    print(f"[증분] {last_seen} 이후 커밋만 가져옵니다.\n")
else:
    print("[증분] 처음 수집하는 레포입니다. 전부 가져옵니다.\n")


result = {"owner": OWNER, "repo": REPO, "commits": []}

# --- 1) 커밋 목록 (since 로 증분) ---
print("=== 커밋 목록 ===")
url = f"{BASE}/commits?per_page=100"
if last_seen:
    url += f"&since={last_seen}"
commits = get_all(url)
print(f"커밋 개수(전체): {len(commits)}\n")

# --- 2) 커밋별 상세: 파일 경로·파일별 줄수는 상세 호출에서만 나온다 ---
for c in commits:
    sha = c["sha"]
    print(f"=== {sha[:7]}: {c['commit']['message'].splitlines()[0]} ===")

    detail = get(f"{BASE}/commits/{sha}")
    stats = detail.get("stats", {})

    result["commits"].append({
        "sha": sha,
        "message": c["commit"]["message"],
        "author": (c["author"] or {}).get("login"),  
        "author_name": c["commit"]["author"]["name"],
        "date": c["commit"]["author"]["date"],
        "additions": stats.get("additions"),
        "deletions": stats.get("deletions"),
        "files": [
            {"path": f["filename"], "additions": f["additions"], "deletions": f["deletions"]}
            for f in detail.get("files", [])
        ],
    })

# --- 3) 기존 파일과 sha 기준으로 합쳐서(merge) 저장 ---
out_path = f"raw_{REPO}.json"
received = len(result["commits"])  # merge 전에 세둠

merged_by_sha = {}
if os.path.exists(out_path):
    with open(out_path, encoding="utf-8") as f:
        for c in json.load(f).get("commits", []):
            merged_by_sha[c["sha"]] = c

new_count = 0
for c in result["commits"]:
    if c["sha"] not in merged_by_sha:
        new_count += 1
    merged_by_sha[c["sha"]] = c

result["commits"] = sorted(merged_by_sha.values(), key=lambda x: x["date"], reverse=True)

with open(out_path, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"\n저장 완료: {out_path}  "
      f"(전체 {len(result['commits'])}개, 이번에 받음 {received}개 / 그중 새 커밋 {new_count}개)")

# --- 4) checkpoint 갱신: 이번에 받은 커밋 중 가장 최신 시각 저장 ---
if received > 0:
    newest = max(c["date"] for c in result["commits"])
    if not last_seen or newest > last_seen:
        checkpoint[repo_key] = newest
        with open(CHECKPOINT_PATH, "w", encoding="utf-8") as f:
            json.dump(checkpoint, f, ensure_ascii=False, indent=2)
        print(f"[증분] checkpoint 갱신: {repo_key} -> {newest}")
    else:
        print("[증분] 새로 받은 커밋이 없어 checkpoint 유지")
else:
    print("[증분] 이번에 새로 받은 커밋 없음")
