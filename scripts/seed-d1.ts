/**
 * Seed Cloudflare D1 database from processed data files.
 * Usage: npx tsx scripts/seed-d1.ts
 *
 * Requires wrangler to be authenticated or CLOUDFLARE_API_TOKEN set.
 * Reads from data/processed/ and executes SQL via wrangler d1 execute.
 */

import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DB_NAME = 'voto-exposto-db';
const PROCESSED_DIR = resolve(process.cwd(), 'data/processed');
const SCHEMA_PATH = resolve(process.cwd(), 'db/schema.sql');
const BATCH_SIZE = 50;

interface ProcessedPolitician {
  id: string;
  name: string;
  chamber: 'camara' | 'senado';
  party: string;
  state: string;
  photo_url: string;
  legislature: number;
  attendance_rate: number;
  total_sessions: number;
  sessions_attended: number;
}

interface ProcessedVote {
  id: string;
  description: string;
  chamber: 'camara' | 'senado';
  date: string;
  yes_count: number;
  no_count: number;
  abstention_count: number;
  absent_count: number;
  is_highlighted: boolean;
  highlight_category: string | null;
  highlight_summary: string | null;
}

interface ProcessedPoliticianVote {
  politician_id: string;
  vote_id: string;
  position: string;
}

interface ProcessedAmendment {
  id: string;
  politician_id: string;
  description: string;
  amount: number;
  year: number;
  status: string;
  city: string | null;
  state: string | null;
}

function escapeSQL(value: string): string {
  return value.replace(/'/g, "''");
}

function executeSQL(sql: string, isLocal = false): void {
  const flag = isLocal ? '--local' : '--remote';
  try {
    execSync(
      `npx wrangler d1 execute ${DB_NAME} ${flag} --command="${sql.replace(/"/g, '\\"')}"`,
      { stdio: 'pipe', maxBuffer: 10 * 1024 * 1024 }
    );
  } catch (err: any) {
    console.error('SQL execution failed:', err.stderr?.toString() || err.message);
    throw err;
  }
}

function executeSQLBatch(statements: string[], isLocal = false): void {
  for (let i = 0; i < statements.length; i += BATCH_SIZE) {
    const batch = statements.slice(i, i + BATCH_SIZE);
    const combined = batch.join('\n');
    executeSQL(combined, isLocal);
    console.log(`  Executed batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(statements.length / BATCH_SIZE)}`);
  }
}

function loadJSON<T>(filename: string): T | null {
  const filepath = resolve(PROCESSED_DIR, filename);
  if (!existsSync(filepath)) {
    console.warn(`  File not found: ${filename}, skipping.`);
    return null;
  }
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

async function main() {
  const isLocal = process.argv.includes('--local');
  const skipSchema = process.argv.includes('--skip-schema');

  console.log(`\n🗳️  Voto Exposto — D1 Database Seeder`);
  console.log(`  Mode: ${isLocal ? 'LOCAL' : 'REMOTE'}`);
  console.log(`  Database: ${DB_NAME}\n`);

  // Step 1: Apply schema
  if (!skipSchema) {
    console.log('📋 Applying schema...');
    if (!existsSync(SCHEMA_PATH)) {
      console.error('Schema file not found at db/schema.sql');
      process.exit(1);
    }
    const schema = readFileSync(SCHEMA_PATH, 'utf-8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + ';');
    executeSQLBatch(statements, isLocal);
    console.log('  Schema applied.\n');
  }

  // Step 2: Seed politicians
  console.log('👤 Seeding politicians...');
  const politicians = loadJSON<ProcessedPolitician[]>('politicians.json');
  if (politicians && politicians.length > 0) {
    const stmts = politicians.map(p =>
      `INSERT OR REPLACE INTO politicians (id, name, chamber, party, state, photo_url, legislature) VALUES ('${escapeSQL(p.id)}', '${escapeSQL(p.name)}', '${p.chamber}', '${escapeSQL(p.party)}', '${p.state}', '${escapeSQL(p.photo_url)}', ${p.legislature});`
    );
    executeSQLBatch(stmts, isLocal);
    console.log(`  Inserted ${politicians.length} politicians.\n`);
  }

  // Step 3: Seed attendance
  console.log('📊 Seeding attendance...');
  if (politicians && politicians.length > 0) {
    const stmts = politicians
      .filter(p => p.total_sessions > 0)
      .map(p =>
        `INSERT OR REPLACE INTO attendance (politician_id, total_sessions, sessions_attended, attendance_rate) VALUES ('${escapeSQL(p.id)}', ${p.total_sessions}, ${p.sessions_attended}, ${p.attendance_rate});`
      );
    if (stmts.length > 0) {
      executeSQLBatch(stmts, isLocal);
      console.log(`  Inserted ${stmts.length} attendance records.\n`);
    }
  }

  // Step 4: Seed votes
  console.log('🗳️  Seeding votes...');
  const votes = loadJSON<ProcessedVote[]>('votes.json');
  if (votes && votes.length > 0) {
    const stmts = votes.map(v =>
      `INSERT OR REPLACE INTO votes (id, description, chamber, date, yes_count, no_count, abstention_count, absent_count, is_highlighted, highlight_category, highlight_summary) VALUES ('${escapeSQL(v.id)}', '${escapeSQL(v.description)}', '${v.chamber}', '${v.date}', ${v.yes_count}, ${v.no_count}, ${v.abstention_count}, ${v.absent_count}, ${v.is_highlighted ? 1 : 0}, ${v.highlight_category ? `'${escapeSQL(v.highlight_category)}'` : 'NULL'}, ${v.highlight_summary ? `'${escapeSQL(v.highlight_summary)}'` : 'NULL'});`
    );
    executeSQLBatch(stmts, isLocal);
    console.log(`  Inserted ${votes.length} votes.\n`);
  }

  // Step 5: Seed politician votes
  console.log('🔗 Seeding politician votes...');
  const politicianVotes = loadJSON<ProcessedPoliticianVote[]>('politician-votes.json');
  if (politicianVotes && politicianVotes.length > 0) {
    const stmts = politicianVotes.map(pv =>
      `INSERT OR REPLACE INTO politician_votes (politician_id, vote_id, position) VALUES ('${escapeSQL(pv.politician_id)}', '${escapeSQL(pv.vote_id)}', '${pv.position}');`
    );
    executeSQLBatch(stmts, isLocal);
    console.log(`  Inserted ${politicianVotes.length} politician vote records.\n`);
  }

  // Step 6: Seed amendments
  console.log('💰 Seeding amendments...');
  const amendments = loadJSON<ProcessedAmendment[]>('amendments.json');
  if (amendments && amendments.length > 0) {
    const stmts = amendments.map(a =>
      `INSERT OR REPLACE INTO amendments (id, politician_id, description, amount, year, status, city, state) VALUES ('${escapeSQL(a.id)}', '${escapeSQL(a.politician_id)}', '${escapeSQL(a.description)}', ${a.amount}, ${a.year}, '${escapeSQL(a.status)}', ${a.city ? `'${escapeSQL(a.city)}'` : 'NULL'}, ${a.state ? `'${escapeSQL(a.state)}'` : 'NULL'});`
    );
    executeSQLBatch(stmts, isLocal);
    console.log(`  Inserted ${amendments.length} amendments.\n`);
  }

  // Step 7: Update metadata
  console.log('📝 Updating metadata...');
  const now = new Date().toISOString();
  executeSQL(
    `INSERT OR REPLACE INTO metadata (key, value) VALUES ('last_update', '${now}');`,
    isLocal
  );
  executeSQL(
    `INSERT OR REPLACE INTO metadata (key, value) VALUES ('politicians_count', '${politicians?.length ?? 0}');`,
    isLocal
  );
  executeSQL(
    `INSERT OR REPLACE INTO metadata (key, value) VALUES ('votes_count', '${votes?.length ?? 0}');`,
    isLocal
  );
  console.log('  Metadata updated.\n');

  console.log('✅ Database seeded successfully!');
  console.log(`  Politicians: ${politicians?.length ?? 0}`);
  console.log(`  Votes: ${votes?.length ?? 0}`);
  console.log(`  Politician votes: ${politicianVotes?.length ?? 0}`);
  console.log(`  Amendments: ${amendments?.length ?? 0}`);
  console.log(`  Last update: ${now}\n`);
}

main().catch(err => {
  console.error('\n❌ Seeding failed:', err.message);
  process.exit(1);
});
