#!/usr/bin/env node
// 원격 Supabase(public)에 SQL을 적용하는 헬퍼.
// 대시보드 대신 코드(SQL)로 스키마를 관리하기 위한 도구.
//
// 사용법:
//   node supabase/scripts/run-sql.mjs <file.sql>        # 파일 적용
//   node supabase/scripts/run-sql.mjs -e "select 1;"     # 인라인 SQL 실행
//
// 인증: 프로젝트 루트 .env.local 의 PAT=<sbp_...> (Supabase personal access token).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_REF = 'qotyklxakmqfehgvsouq';
const root = path.resolve(fileURLToPath(import.meta.url), '../../..');

function readPAT() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN || process.env.PAT;
  if (fromEnv) return fromEnv.trim();
  const env = fs.readFileSync(path.join(root, '.env.local'), 'utf8');
  const m = env.match(/^PAT=(.*)$/m);
  if (!m) throw new Error('PAT 를 .env.local 에서 찾지 못했습니다.');
  return m[1].trim();
}

async function runQuery(sql, pat) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${pat}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return text;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node supabase/scripts/run-sql.mjs <file.sql> | -e "<sql>"');
  process.exit(1);
}

let sql;
let label;
if (args[0] === '-e') {
  sql = args.slice(1).join(' ');
  label = '(inline)';
} else {
  const file = path.resolve(args[0]);
  sql = fs.readFileSync(file, 'utf8');
  label = path.relative(root, file);
}

const pat = readPAT();
console.log(`Applying ${label} → ${PROJECT_REF} ...`);
const out = await runQuery(sql, pat);
console.log('OK');
if (out && out !== '[]') console.log(out);
