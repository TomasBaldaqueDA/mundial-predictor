#!/usr/bin/env node
/**
 * Applies 112_national_jersey_numbers.sql via Supabase client (service role).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadEnvLocal() {
  const envPath = path.join(root, '.env.local');
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

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

function parseSql(sql) {
  const blocks = [];
  const re =
    /-- ([^\n]+)\nUPDATE[\s\S]*?FROM \(VALUES\n([\s\S]*?)\) AS v\(name, num\)\nWHERE p\.team = '([^']+)' AND p\.name = v\.name;/g;
  let m;
  while ((m = re.exec(sql)) !== null) {
    const teamLabel = m[1];
    const valuesBlock = m[2];
    const team = m[3];
    const players = [];
    for (const line of valuesBlock.split('\n')) {
      const vm = line.match(/\('((?:''|[^'])*)',\s*(\d+)\)/);
      if (!vm) continue;
      players.push({
        name: vm[1].replace(/''/g, "'"),
        num: Number(vm[2]),
      });
    }
    blocks.push({ teamLabel, team, players });
  }
  return blocks;
}

const sql = fs.readFileSync(
  path.join(root, 'supabase/sql/112_national_jersey_numbers.sql'),
  'utf8'
);
const blocks = parseSql(sql);
console.log(`Parsed ${blocks.length} teams, ${blocks.reduce((n, b) => n + b.players.length, 0)} players`);

let updated = 0;
let errors = 0;

for (const block of blocks) {
  for (const { name, num } of block.players) {
    const { error } = await supabase
      .from('five_a_side_players')
      .update({ jersey_number: num })
      .eq('team', block.team)
      .eq('name', name);

    if (error) {
      console.error(`FAIL ${block.team} / ${name}:`, error.message);
      errors++;
    } else {
      updated++;
    }
  }
  console.log(`  ${block.team}: ${block.players.length} players`);
}

const { error: refreshErr } = await supabase.rpc('refresh_five_a_side_player_stats');
if (refreshErr) {
  console.error('refresh_five_a_side_player_stats:', refreshErr.message);
  process.exit(1);
}

console.log(`Done: ${updated} updated, ${errors} issues`);
process.exit(errors > 0 ? 1 : 0);
