/**
 * Process raw data from Câmara and Senado into unified format
 * Reads from data/raw/ and outputs SQL-ready data to data/processed/
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const RAW_DIR = join(process.cwd(), 'data', 'raw');
const PROCESSED_DIR = join(process.cwd(), 'data', 'processed');

interface UnifiedPolitician {
  external_id: string;
  name: string;
  party: string;
  state: string;
  chamber: 'camara' | 'senado';
  photo_url: string;
  email: string;
  active: boolean;
  legislature: number;
}

interface UnifiedVote {
  external_id: string;
  date: string;
  description: string;
  summary: string;
  result: string;
  yes_count: number;
  no_count: number;
  absent_count: number;
  chamber: 'camara' | 'senado';
  is_highlighted: boolean;
  category: string;
}

function loadJSON(filename: string): any {
  const filepath = join(RAW_DIR, filename);
  if (!existsSync(filepath)) {
    console.warn(`  ⚠️ File not found: ${filepath}`);
    return null;
  }
  return JSON.parse(readFileSync(filepath, 'utf-8'));
}

// Load highlighted votes config
function loadHighlightedVotes(): Map<string, { category: string; label: string }> {
  const map = new Map();
  const filepath = join(process.cwd(), 'data', 'highlighted-votes.json');
  if (existsSync(filepath)) {
    const data = JSON.parse(readFileSync(filepath, 'utf-8'));
    for (const item of data) {
      map.set(item.external_id, { category: item.category, label: item.label_pt });
    }
  }
  return map;
}

function processCamaraDeputies(raw: any[]): UnifiedPolitician[] {
  return raw.map((d) => ({
    external_id: String(d.id),
    name: d.nome || d.nomeCivil || '',
    party: d.siglaPartido || '',
    state: d.siglaUf || '',
    chamber: 'camara',
    photo_url: d.urlFoto || `https://www.camara.leg.br/internet/deputado/bandep/${d.id}.jpg`,
    email: d.email || '',
    active: true,
    legislature: 57,
  }));
}

function processSenadoSenators(raw: any[]): UnifiedPolitician[] {
  return raw.map((s) => {
    const id = s?.IdentificacaoParlamentar;
    return {
      external_id: String(id?.CodigoParlamentar || ''),
      name: id?.NomeParlamentar || id?.NomeCompletoParlamentar || '',
      party: id?.SiglaPartidoParlamentar || '',
      state: id?.UfParlamentar || '',
      chamber: 'senado',
      photo_url: id?.UrlFotoParlamentar || '',
      email: id?.EmailParlamentar || '',
      active: true,
      legislature: 57,
    };
  });
}

async function main() {
  console.log('⚙️ Processing data...');
  mkdirSync(PROCESSED_DIR, { recursive: true });

  const highlighted = loadHighlightedVotes();

  // Process politicians
  const politicians: UnifiedPolitician[] = [];

  const camaraDeputies = loadJSON('camara-deputies.json');
  if (camaraDeputies) {
    politicians.push(...processCamaraDeputies(camaraDeputies));
    console.log(`  ✅ Processed ${camaraDeputies.length} Câmara deputies`);
  }

  const senadoSenators = loadJSON('senado-senators.json');
  if (senadoSenators) {
    politicians.push(...processSenadoSenators(senadoSenators));
    console.log(`  ✅ Processed ${senadoSenators.length} Senate senators`);
  }

  writeFileSync(
    join(PROCESSED_DIR, 'politicians.json'),
    JSON.stringify(politicians, null, 2),
    'utf-8'
  );

  // Process votes (Câmara)
  const camaraVotes = loadJSON('camara-votes.json');
  const votes: UnifiedVote[] = [];

  if (camaraVotes) {
    for (const v of camaraVotes) {
      const externalId = String(v.id);
      const hl = highlighted.get(externalId);
      votes.push({
        external_id: externalId,
        date: v.dataHoraRegistro || v.data || '',
        description: v.descricao || v.ementa || '',
        summary: v.ementaDetalhada || '',
        result: v.aprovacao ? 'APROVADO' : 'REJEITADO',
        yes_count: 0, // Will be calculated from individual votes
        no_count: 0,
        absent_count: 0,
        chamber: 'camara',
        is_highlighted: !!hl,
        category: hl?.category || 'outros',
      });
    }
    console.log(`  ✅ Processed ${camaraVotes.length} Câmara votes`);
  }

  writeFileSync(
    join(PROCESSED_DIR, 'votes.json'),
    JSON.stringify(votes, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Processing complete!`);
  console.log(`   Politicians: ${politicians.length}`);
  console.log(`   Votes: ${votes.length}`);
  console.log(`   Output: ${PROCESSED_DIR}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
