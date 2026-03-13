/**
 * Fetch data from Senado Federal API
 * API Docs: https://legis.senado.leg.br/dadosabertos/api-docs/swagger-ui/index.html
 *
 * IMPORTANT: Rate limit is 10 requests/second (HTTP 429 if exceeded)
 *
 * This script fetches:
 * - List of current senators
 * - Nominal votes
 * - Budget amendments
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'https://legis.senado.leg.br/dadosabertos';
const OUTPUT_DIR = join(process.cwd(), 'data', 'raw');
const DELAY_MS = 150; // Keep under 10 req/s limit

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJSON(url: string) {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (res.status === 429) {
    console.warn('  ⚠️ Rate limited! Waiting 5 seconds...');
    await sleep(5000);
    return fetchJSON(url); // Retry
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }

  return res.json();
}

async function fetchSenators() {
  // Current legislature (57th: 2023-2027)
  console.log('\n📋 Fetching senators...');
  const data = await fetchJSON(`${BASE_URL}/senador/lista/57/57.json`);

  // Navigate the XML-like JSON structure
  const senators =
    data?.ListaParlamentarLegislatura?.Parlamentares?.Parlamentar || [];
  console.log(`  Found ${senators.length} senators`);
  return senators;
}

async function fetchSenatorVotes(senatorCode: string) {
  try {
    const data = await fetchJSON(`${BASE_URL}/senador/${senatorCode}/votacoes.json`);
    return data?.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao || [];
  } catch (err) {
    console.error(`  ❌ Error fetching votes for senator ${senatorCode}:`, err);
    return [];
  }
}

async function fetchNominalVotes() {
  console.log('\n🗳️ Fetching Senate nominal votes...');
  try {
    const data = await fetchJSON(`${BASE_URL}/votacao.json`);
    const votes = data?.ListaVotacoes?.Votacoes?.Votacao || [];
    console.log(`  Found ${votes.length} nominal votes`);
    return votes;
  } catch (err) {
    console.error('  ❌ Error fetching nominal votes:', err);
    return [];
  }
}

async function fetchBudgetAmendments() {
  console.log('\n💰 Fetching budget amendments...');
  try {
    const data = await fetchJSON(`${BASE_URL}/orcamento/lista.json`);
    const amendments = data?.ListaLotesEmendas?.LotesEmendas?.LoteEmendas || [];
    console.log(`  Found ${amendments.length} amendment batches`);
    return amendments;
  } catch (err) {
    console.error('  ❌ Error fetching amendments:', err);
    return [];
  }
}

async function main() {
  console.log('🏛️ Senado Federal — Data Fetch');

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Fetch senators
  const senators = await fetchSenators();
  writeFileSync(
    join(OUTPUT_DIR, 'senado-senators.json'),
    JSON.stringify(senators, null, 2),
    'utf-8'
  );
  await sleep(DELAY_MS);

  // 2. Fetch nominal votes
  const votes = await fetchNominalVotes();
  writeFileSync(
    join(OUTPUT_DIR, 'senado-votes.json'),
    JSON.stringify(votes, null, 2),
    'utf-8'
  );
  await sleep(DELAY_MS);

  // 3. Fetch individual senator votes (carefully rate-limited)
  console.log('\n📊 Fetching individual senator votes...');
  const senatorVotes: Record<string, any> = {};

  for (let i = 0; i < senators.length; i++) {
    const senator = senators[i];
    const code =
      senator?.IdentificacaoParlamentar?.CodigoParlamentar || senator?.CodigoParlamentar;
    if (!code) continue;

    console.log(`  [${i + 1}/${senators.length}] Senator ${code}...`);
    senatorVotes[code] = await fetchSenatorVotes(code);
    await sleep(DELAY_MS);
  }

  writeFileSync(
    join(OUTPUT_DIR, 'senado-senator-votes.json'),
    JSON.stringify(senatorVotes, null, 2),
    'utf-8'
  );

  // 4. Fetch budget amendments
  const amendments = await fetchBudgetAmendments();
  writeFileSync(
    join(OUTPUT_DIR, 'senado-amendments.json'),
    JSON.stringify(amendments, null, 2),
    'utf-8'
  );

  console.log('\n✅ Senado fetch complete!');
  console.log(`   Senators: ${senators.length}`);
  console.log(`   Votes: ${votes.length}`);
  console.log(`   Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
