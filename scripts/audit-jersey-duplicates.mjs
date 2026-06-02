#!/usr/bin/env node
/**
 * Audits jersey_number duplicates per team from squad/jersey SQL files.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sqlDir = path.join(__dirname, '../supabase/sql');

function loadEnvLocal() {
  const envPath = path.join(__dirname, '../.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const raw of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const k = line.slice(0, eq).trim();
    const v = line.slice(eq + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
}

function parseJerseySql(content, source) {
  const entries = [];
  const re =
    /-- ([^\n]+)\nUPDATE[\s\S]*?FROM \(VALUES\n([\s\S]*?)\) AS v\(name, num\)\nWHERE p\.team = '((?:''|[^'])*)' AND p\.name = v\.name;/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const team = m[3].replace(/''/g, "'");
    for (const line of m[2].split('\n')) {
      const vm = line.match(/\('((?:''|[^'])*)',\s*(\d+)\)/);
      if (!vm) continue;
      entries.push({
        team,
        name: vm[1].replace(/''/g, "'"),
        num: Number(vm[2]),
        source,
      });
    }
  }
  return entries;
}

function parseSquadInlineJersey(content, source) {
  const entries = [];
  const teamMatch = content.match(/team = '([^']+)'/);
  const teamFromDelete = content.match(/DELETE FROM public\.five_a_side_players WHERE team = '([^']+)'/);
  const team = teamFromDelete?.[1] ?? teamMatch?.[1];
  if (!team) return entries;

  const insertRe =
    /\('([^']*(?:''[^']*)*)',\s*'[^']+',\s*'[^']+',\s*(\d+)\)/g;
  let m;
  while ((m = insertRe.exec(content)) !== null) {
    entries.push({
      team,
      name: m[1].replace(/''/g, "'"),
      num: Number(m[2]),
      source,
    });
  }
  return entries;
}

function findDuplicates(entries) {
  const byTeam = new Map();
  for (const e of entries) {
    if (!byTeam.has(e.team)) byTeam.set(e.team, []);
    byTeam.get(e.team).push(e);
  }

  const issues = [];
  for (const [team, players] of byTeam) {
    const byNum = new Map();
    const byName = new Map();
    for (const p of players) {
      if (!byNum.has(p.num)) byNum.set(p.num, []);
      byNum.get(p.num).push(p);
      if (byName.has(p.name)) {
        issues.push({
          type: 'duplicate_name',
          team,
          name: p.name,
          entries: [byName.get(p.name), p],
        });
      }
      byName.set(p.name, p);
    }
    for (const [num, list] of byNum) {
      if (list.length > 1) {
        issues.push({ type: 'duplicate_number', team, num, players: list });
      }
    }
    const nulls = players.filter((p) => !Number.isFinite(p.num));
    if (nulls.length) {
      issues.push({ type: 'invalid_number', team, players: nulls });
    }
  }
  return { byTeam, issues };
}

// --- SQL files audit ---
const files = fs
  .readdirSync(sqlDir)
  .filter((f) => f.endsWith('.sql'))
  .sort();

let allEntries = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(sqlDir, file), 'utf8');
  if (!content.includes('jersey_number')) continue;
  const source = file;
  if (file.includes('jersey_numbers') || file === '112_national_jersey_numbers.sql') {
    allEntries.push(...parseJerseySql(content, source));
  } else if (content.includes('jersey_number')) {
    allEntries.push(...parseSquadInlineJersey(content, source));
  }
}

// Prefer latest jersey migration per team (112 > 111 > 110 > squad inline)
const teamPriority = {
  Brazil: ['112_national_jersey_numbers.sql', '110_brazil_jersey_numbers.sql', '062_brazil_squad.sql'],
  Portugal: ['112_national_jersey_numbers.sql', '111_portugal_jersey_numbers.sql', '085_portugal_squad.sql'],
  USA: ['112_national_jersey_numbers.sql', '067_usa_squad.sql'],
};

function effectiveEntries(entries) {
  const byTeam = new Map();
  for (const e of entries) {
    if (!byTeam.has(e.team)) byTeam.set(e.team, new Map());
    byTeam.get(e.team).set(e.name, e);
  }
  // 112 overrides per-team blocks; for BR/PT/USA use dedicated files
  const from112 = entries.filter((e) => e.source === '112_national_jersey_numbers.sql');
  for (const e of from112) {
    if (['Brazil', 'Portugal', 'USA'].includes(e.team)) continue;
    byTeam.get(e.team)?.set(e.name, e);
  }
  for (const [team, sources] of Object.entries(teamPriority)) {
    for (const src of sources) {
      const file = src;
      for (const e of entries.filter((x) => x.team === team && x.source === file)) {
        if (!byTeam.has(team)) byTeam.set(team, new Map());
        byTeam.get(team).set(e.name, e);
      }
    }
  }
  return [...byTeam.values()].flatMap((m) => [...m.values()]);
}

const effective = effectiveEntries(allEntries);
const { byTeam, issues } = findDuplicates(effective);

console.log('=== Jersey duplicate audit (effective per team) ===');
console.log(`Teams: ${byTeam.size}, players: ${effective.length}`);
if (issues.length === 0) {
  console.log('OK: no duplicate jersey numbers in SQL sources');
} else {
  console.error(`FAIL: ${issues.length} issue(s)`);
  for (const i of issues) {
    if (i.type === 'duplicate_number') {
      console.error(`  ${i.team} #${i.num}: ${i.players.map((p) => p.name).join(', ')}`);
    } else {
      console.error(`  ${i.type} ${i.team}:`, i);
    }
  }
}

// --- DB audit (optional) ---
loadEnvLocal();
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (url && key) {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(url, key);
  const data = [];
  const pageSize = 1000;
  for (let from = 0; ; from += pageSize) {
    const { data: page, error } = await supabase
      .from('five_a_side_players')
      .select('team, name, jersey_number')
      .order('team')
      .order('jersey_number')
      .range(from, from + pageSize - 1);
    if (error) {
      console.error('DB query failed:', error.message);
      process.exit(issues.length ? 1 : 0);
    }
    if (!page?.length) break;
    data.push(...page);
    if (page.length < pageSize) break;
  }

  const dbByTeam = new Map();
  for (const row of data) {
    if (!dbByTeam.has(row.team)) dbByTeam.set(row.team, []);
    dbByTeam.get(row.team).push(row);
  }

  let dbIssues = 0;
  let missing = 0;
  console.log('\n=== DB jersey audit ===');
  for (const [team, players] of dbByTeam) {
    const nums = new Map();
    for (const p of players) {
      if (p.jersey_number == null) {
        missing++;
        console.warn(`  MISSING ${team}: ${p.name}`);
        dbIssues++;
        continue;
      }
      if (!nums.has(p.jersey_number)) nums.set(p.jersey_number, []);
      nums.get(p.jersey_number).push(p.name);
    }
    for (const [num, names] of nums) {
      if (names.length > 1) {
        console.error(`  DUPLICATE ${team} #${num}: ${names.join(', ')}`);
        dbIssues++;
      }
    }
  }
  if (dbIssues === 0) {
    console.log(`OK: ${data.length} players, all numbered, no duplicates`);
  } else {
    console.error(`FAIL: ${dbIssues} DB issue(s) (${missing} missing numbers)`);
  }
  process.exit(issues.length || dbIssues ? 1 : 0);
}

process.exit(issues.length ? 1 : 0);
