/**
 * Fetch data from Câmara dos Deputados API
 * API Docs: https://dadosabertos.camara.leg.br/swagger/api.html
 *
 * This script fetches:
 * - List of all current deputies
 * - Recent voting sessions
 * - Individual votes per session
 * - Party guidance per session
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';
const OUTPUT_DIR = join(process.cwd(), 'data', 'raw');
const DELAY_MS = 200; // Polite delay between requests

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url: string) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return res.json();
}

async function fetchAllPages(baseUrl: string, params: Record<string, string> = {}) {
  const allItems: any[] = [];
  let page = 1;
  const pageSize = 100;

  while (true) {
    const searchParams = new URLSearchParams({
      ...params,
      itens: String(pageSize),
      pagina: String(page),
    });
    const url = `${baseUrl}?${searchParams}`;
    console.log(`  Fetching page ${page}: ${url}`);

    const data = await fetchJSON(url);
    const items = data.dados || [];
    allItems.push(...items);

    if (items.length < pageSize) break;
    page++;
    await sleep(DELAY_MS);
  }

  return allItems;
}

async function fetchDeputies() {
  console.log('\n📋 Fetching deputies...');
  const deputies = await fetchAllPages(`${BASE_URL}/deputados`, {
    ordem: 'ASC',
    ordenarPor: 'nome',
  });
  console.log(`  Found ${deputies.length} deputies`);
  return deputies;
}

async function fetchRecentVotes(daysBack: number = 30) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];

  console.log(`\n🗳️ Fetching votes from ${startDate} to ${endDate}...`);
  const votes = await fetchAllPages(`${BASE_URL}/votacoes`, {
    dataInicio: startDate,
    dataFim: endDate,
    ordem: 'DESC',
    ordenarPor: 'dataHoraRegistro',
  });
  console.log(`  Found ${votes.length} voting sessions`);
  return votes;
}

async function fetchVoteDetails(voteId: string) {
  const [votos, orientacoes] = await Promise.all([
    fetchJSON(`${BASE_URL}/votacoes/${voteId}/votos`).then((d) => d.dados || []),
    fetchJSON(`${BASE_URL}/votacoes/${voteId}/orientacoes`).then((d) => d.dados || []),
  ]);
  return { votos, orientacoes };
}

async function main() {
  const isFullRefresh = process.argv.includes('--full');
  const daysBack = isFullRefresh ? 365 : 30;

  console.log('🏛️ Câmara dos Deputados — Data Fetch');
  console.log(`   Mode: ${isFullRefresh ? 'FULL REFRESH' : 'incremental (last 30 days)'}`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Fetch deputies
  const deputies = await fetchDeputies();
  writeFileSync(
    join(OUTPUT_DIR, 'camara-deputies.json'),
    JSON.stringify(deputies, null, 2),
    'utf-8'
  );

  // 2. Fetch recent votes
  const votes = await fetchRecentVotes(daysBack);
  writeFileSync(
    join(OUTPUT_DIR, 'camara-votes.json'),
    JSON.stringify(votes, null, 2),
    'utf-8'
  );

  // 3. Fetch individual votes for each session (with rate limiting)
  console.log('\n📊 Fetching individual vote details...');
  const voteDetails: Record<string, any> = {};

  for (let i = 0; i < votes.length; i++) {
    const vote = votes[i];
    const voteId = vote.id;
    console.log(`  [${i + 1}/${votes.length}] Vote ${voteId}...`);

    try {
      voteDetails[voteId] = await fetchVoteDetails(voteId);
    } catch (err) {
      console.error(`  ❌ Error fetching vote ${voteId}:`, err);
      voteDetails[voteId] = { votos: [], orientacoes: [] };
    }

    await sleep(DELAY_MS);
  }

  writeFileSync(
    join(OUTPUT_DIR, 'camara-vote-details.json'),
    JSON.stringify(voteDetails, null, 2),
    'utf-8'
  );

  console.log('\n✅ Câmara fetch complete!');
  console.log(`   Deputies: ${deputies.length}`);
  console.log(`   Votes: ${votes.length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
