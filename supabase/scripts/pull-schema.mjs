#!/usr/bin/env node
// 원격 Supabase(public 스키마)의 현재 상태를 카탈로그에서 읽어 JSON 스냅샷으로 떠둡니다.
// baseline 마이그레이션과 실제 원격 스키마가 어긋났는지(drift) 점검할 때 사용.
//
// 사용법: node supabase/scripts/pull-schema.mjs [out.json]
//   out 생략 시 supabase/schema-snapshot.json 에 저장.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_REF = 'qotyklxakmqfehgvsouq';
const root = path.resolve(fileURLToPath(import.meta.url), '../../..');

function readPAT() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN || process.env.PAT;
  if (fromEnv) return fromEnv.trim();
  const env = fs.readFileSync(path.join(root, '.env.local'), 'utf8');
  return env.match(/^PAT=(.*)$/m)[1].trim();
}
const pat = readPAT();

async function q(query) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${pat}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);
  return JSON.parse(text);
}

const out = {};
out.enums = await q(`select t.typname as name, array_agg(e.enumlabel order by e.enumsortorder) as labels
  from pg_type t join pg_enum e on e.enumtypid=t.oid join pg_namespace n on n.oid=t.typnamespace
  where n.nspname='public' group by t.typname order by t.typname;`);
out.tables = await q(`select c.relname as table_name, c.relrowsecurity as rls_enabled
  from pg_class c join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and c.relkind='r' order by c.relname;`);
out.columns = await q(`select c.relname as table_name, a.attnum as ord, a.attname as column_name,
  format_type(a.atttypid,a.atttypmod) as data_type, a.attnotnull as not_null,
  pg_get_expr(ad.adbin,ad.adrelid) as default_expr, a.attidentity as identity, a.attgenerated as generated
  from pg_attribute a join pg_class c on c.oid=a.attrelid join pg_namespace n on n.oid=c.relnamespace
  left join pg_attrdef ad on ad.adrelid=a.attrelid and ad.adnum=a.attnum
  where n.nspname='public' and c.relkind='r' and a.attnum>0 and not a.attisdropped
  order by c.relname, a.attnum;`);
out.constraints = await q(`select c.relname as table_name, con.conname as name, con.contype as type,
  pg_get_constraintdef(con.oid) as def
  from pg_constraint con join pg_class c on c.oid=con.conrelid join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' order by c.relname, con.contype, con.conname;`);
out.indexes = await q(`select c.relname as table_name, i.relname as index_name, pg_get_indexdef(ix.indexrelid) as def
  from pg_index ix join pg_class i on i.oid=ix.indexrelid join pg_class c on c.oid=ix.indrelid
  join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and not exists (select 1 from pg_constraint con where con.conindid=ix.indexrelid)
  order by c.relname, i.relname;`);
out.functions = await q(`select p.proname as name, pg_get_functiondef(p.oid) as def
  from pg_proc p join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.prokind in ('f','p') order by p.proname;`);
out.triggers = await q(`select c.relname as table_name, t.tgname as name, pg_get_triggerdef(t.oid) as def
  from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace
  where n.nspname='public' and not t.tgisinternal order by c.relname, t.tgname;`);
out.policies = await q(`select tablename, policyname, cmd, roles, qual, with_check
  from pg_policies where schemaname='public' order by tablename, policyname;`);
out.publications = await q(`select pubname, tablename from pg_publication_tables
  where schemaname='public' order by pubname, tablename;`);
out.storage_buckets = await q(`select id, name, public from storage.buckets order by id;`);

const outPath = path.resolve(process.argv[2] || path.join(root, 'supabase/schema-snapshot.json'));
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('snapshot →', path.relative(root, outPath));
