import json
from datetime import datetime, timezone
from pathlib import Path

import boto3


BUCKET_NAME = "khuda-airflow-data-bucket-2026-782818417849-ap-northeast-2-an"
REGION_NAME = "ap-northeast-2"

PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DATA_DIR = PROJECT_ROOT / "data" / "raw"

RAW_FILES = [
    RAW_DATA_DIR / "raw_ACC-springStudy.json",
    RAW_DATA_DIR / "raw_jandi-be.json",
]


def load_json(file_path: Path) -> dict:
    if not file_path.exists():
        raise FileNotFoundError(f"파일을 찾을 수 없습니다: {file_path}")

    with file_path.open("r", encoding="utf-8") as f:
        return json.load(f)


def make_s3_key(raw_data: dict, run_date: str) -> str:
    owner = raw_data["owner"]
    repo = raw_data["repo"]

    return f"raw/github/{run_date}/{owner}/{repo}/raw.json"


def upload_json_to_s3(s3_client, data: dict, bucket_name: str, s3_key: str) -> None:
    body = json.dumps(data, ensure_ascii=False, indent=2)

    s3_client.put_object(
        Bucket=bucket_name,
        Key=s3_key,
        Body=body.encode("utf-8"),
        ContentType="application/json",
    )

    print(f"업로드 완료: s3://{bucket_name}/{s3_key}")


def upload_raw_files_to_s3() -> None:
    s3_client = boto3.client(
        "s3",
        region_name=REGION_NAME,
    )

    run_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    uploaded_items = []

    for raw_file in RAW_FILES:
        raw_data = load_json(raw_file)
        s3_key = make_s3_key(raw_data, run_date)

        upload_json_to_s3(
            s3_client=s3_client,
            data=raw_data,
            bucket_name=BUCKET_NAME,
            s3_key=s3_key,
        )

        uploaded_items.append(
            {
                "owner": raw_data["owner"],
                "repo": raw_data["repo"],
                "local_file": str(raw_file),
                "s3_key": s3_key,
            }
        )

    manifest = {
        "bundle_type": "github_raw_upload_manifest",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "bucket": BUCKET_NAME,
        "raw_prefix": f"raw/github/{run_date}/",
        "uploaded_count": len(uploaded_items),
        "items": uploaded_items,
    }

    manifest_key = f"raw/github/{run_date}/raw_bundle_manifest.json"

    upload_json_to_s3(
        s3_client=s3_client,
        data=manifest,
        bucket_name=BUCKET_NAME,
        s3_key=manifest_key,
    )


if __name__ == "__main__":
    upload_raw_files_to_s3()