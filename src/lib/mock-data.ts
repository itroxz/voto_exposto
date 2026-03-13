// Mock data for development — will be replaced by D1 queries in production

import type {
  Politician,
  PoliticianProfile,
  PoliticianVote,
  Vote,
  Amendment,
  SearchResult,
  RankingEntry,
  CompareData,
} from './types';

// --- Politicians ---
export const mockPoliticians: Politician[] = [
  {
    id: 1,
    externalId: '204554',
    name: 'Alexandre Almeida',
    party: 'PT',
    state: 'SP',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 2,
    externalId: '204321',
    name: 'Marina Ferreira',
    party: 'MDB',
    state: 'SP',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 3,
    externalId: '204789',
    name: 'Roberto Cavalcanti',
    party: 'PL',
    state: 'SP',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 4,
    externalId: '204111',
    name: 'Luciana Barreto',
    party: 'UNIÃO',
    state: 'SP',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 5,
    externalId: '204222',
    name: 'Carlos Figueiredo',
    party: 'PP',
    state: 'PA',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 6,
    externalId: '204333',
    name: 'José Mendonça Neto',
    party: 'AVANTE',
    state: 'BA',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 7,
    externalId: '204444',
    name: 'Rosemary Novaes',
    party: 'MDB',
    state: 'MA',
    chamber: 'camara',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 8,
    externalId: '305001',
    name: 'Antônio Marcos Silva',
    party: 'PSD',
    state: 'MG',
    chamber: 'senado',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 9,
    externalId: '305002',
    name: 'Fernanda Ribeiro',
    party: 'PT',
    state: 'RJ',
    chamber: 'senado',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
  {
    id: 10,
    externalId: '305003',
    name: 'Walter Brant',
    party: 'PL',
    state: 'MG',
    chamber: 'senado',
    photoUrl: '',
    active: true,
    legislature: 57,
  },
];

// --- Votes ---
export const mockVotes: Vote[] = [
  {
    id: 1,
    externalId: 'VOT-2024-001',
    date: '2025-03-12',
    description: 'PL 1087/2024 — Regulamentação do mercado de apostas esportivas',
    summary: 'Regulamenta as apostas esportivas online (bets) no Brasil, definindo regras de tributação, publicidade e proteção ao consumidor.',
    result: 'APROVADO',
    yesCount: 312,
    noCount: 103,
    absentCount: 98,
    chamber: 'camara',
    isHighlighted: true,
    category: 'orcamento',
  },
  {
    id: 2,
    externalId: 'VOT-2023-045',
    date: '2023-07-07',
    description: 'PEC 45/2019 — Reforma tributária (2ª votação)',
    summary: 'Unifica impostos sobre consumo (IBS + CBS), substituindo PIS, Cofins, IPI, ICMS e ISS. Maior reforma tributária em 30 anos.',
    result: 'APROVADO',
    yesCount: 382,
    noCount: 118,
    absentCount: 13,
    chamber: 'camara',
    isHighlighted: true,
    category: 'tributacao',
  },
  {
    id: 3,
    externalId: 'VOT-2023-030',
    date: '2023-05-30',
    description: 'PL 2903/2023 — Marco Temporal para terras indígenas',
    summary: 'Define que povos indígenas só têm direito a terras que ocupavam em outubro de 1988 (data da Constituição).',
    result: 'APROVADO',
    yesCount: 283,
    noCount: 155,
    absentCount: 75,
    chamber: 'camara',
    isHighlighted: true,
    category: 'direitos',
  },
  {
    id: 4,
    externalId: 'VOT-2024-088',
    date: '2024-12-18',
    description: 'PEC da Anistia — 8 de Janeiro',
    summary: 'Proposta de anistia aos condenados pelos atos de depredação de 8 de janeiro de 2023 em Brasília.',
    result: 'APROVADO',
    yesCount: 297,
    noCount: 131,
    absentCount: 85,
    chamber: 'camara',
    isHighlighted: true,
    category: 'direitos',
  },
  {
    id: 5,
    externalId: 'VOT-2024-067',
    date: '2024-12-11',
    description: 'PLP 68/2024 — Lei Complementar Tributária',
    summary: 'Regulamenta a Reforma Tributária, definindo alíquotas, isenções e cesta básica nacional.',
    result: 'APROVADO',
    yesCount: 344,
    noCount: 77,
    absentCount: 92,
    chamber: 'camara',
    isHighlighted: false,
    category: 'tributacao',
  },
  {
    id: 6,
    externalId: 'VOT-2024-041',
    date: '2024-08-15',
    description: 'PL Transparência CNPJ — Dados abertos de empresas',
    summary: 'Obriga publicação online dos dados cadastrais completos de todas as empresas brasileiras.',
    result: 'APROVADO',
    yesCount: 401,
    noCount: 55,
    absentCount: 57,
    chamber: 'camara',
    isHighlighted: true,
    category: 'transparencia',
  },
  {
    id: 7,
    externalId: 'VOT-2024-053',
    date: '2024-09-20',
    description: 'PL Desoneração da folha de pagamento',
    summary: 'Prorroga a desoneração da folha de pagamento para 17 setores da economia até 2027.',
    result: 'APROVADO',
    yesCount: 389,
    noCount: 68,
    absentCount: 56,
    chamber: 'camara',
    isHighlighted: false,
    category: 'tributacao',
  },
  {
    id: 8,
    externalId: 'VOT-2024-071',
    date: '2024-10-05',
    description: 'PL Trabalho escravo — Endurecimento de penas',
    summary: 'Aumenta penas para empregadores flagrados com trabalhadores em condição análoga à escravidão.',
    result: 'APROVADO',
    yesCount: 415,
    noCount: 42,
    absentCount: 56,
    chamber: 'camara',
    isHighlighted: false,
    category: 'direitos',
  },
];

// --- Politician Votes ---
export const mockPoliticianVotes: Record<number, PoliticianVote[]> = {
  1: [ // Alexandre Almeida
    { politicianId: 1, voteId: 1, position: 'SIM', vote: mockVotes[0] },
    { politicianId: 1, voteId: 2, position: 'SIM', vote: mockVotes[1] },
    { politicianId: 1, voteId: 3, position: 'NAO', vote: mockVotes[2] },
    { politicianId: 1, voteId: 4, position: 'NAO', vote: mockVotes[3] },
    { politicianId: 1, voteId: 5, position: 'AUSENTE', vote: mockVotes[4] },
    { politicianId: 1, voteId: 6, position: 'SIM', vote: mockVotes[5] },
    { politicianId: 1, voteId: 7, position: 'AUSENTE', vote: mockVotes[6] },
    { politicianId: 1, voteId: 8, position: 'SIM', vote: mockVotes[7] },
  ],
  3: [ // Roberto Cavalcanti
    { politicianId: 3, voteId: 1, position: 'SIM', vote: mockVotes[0] },
    { politicianId: 3, voteId: 2, position: 'SIM', vote: mockVotes[1] },
    { politicianId: 3, voteId: 3, position: 'SIM', vote: mockVotes[2] },
    { politicianId: 3, voteId: 4, position: 'SIM', vote: mockVotes[3] },
    { politicianId: 3, voteId: 5, position: 'SIM', vote: mockVotes[4] },
    { politicianId: 3, voteId: 6, position: 'NAO', vote: mockVotes[5] },
    { politicianId: 3, voteId: 7, position: 'SIM', vote: mockVotes[6] },
    { politicianId: 3, voteId: 8, position: 'NAO', vote: mockVotes[7] },
  ],
};

// --- Amendments ---
export const mockAmendments: Record<number, Amendment[]> = {
  1: [
    { id: 1, politicianId: 1, year: 2024, amount: 410000000, city: 'Santo André', state: 'SP', description: 'Saúde — Hospital Municipal', type: 'individual' },
    { id: 2, politicianId: 1, year: 2024, amount: 370000000, city: 'São Bernardo do Campo', state: 'SP', description: 'Infraestrutura — Pavimentação', type: 'individual' },
    { id: 3, politicianId: 1, year: 2024, amount: 250000000, city: 'São Paulo', state: 'SP', description: 'Saúde — UPA 24h', type: 'individual' },
    { id: 4, politicianId: 1, year: 2024, amount: 120000000, city: 'Diadema', state: 'SP', description: 'Educação — Creches', type: 'individual' },
    { id: 5, politicianId: 1, year: 2024, amount: 80000000, city: 'Mauá', state: 'SP', description: 'Assistência Social', type: 'individual' },
  ],
};

// --- Profiles with stats ---
export const mockProfiles: Record<number, PoliticianProfile> = {
  1: {
    ...mockPoliticians[0],
    stats: {
      presencePercent: 91,
      totalVotes: 453,
      yesVotes: 326,
      noVotes: 63,
      absentVotes: 41,
      obstructionVotes: 23,
      partyAlignmentPercent: 84,
      totalAmendments: 1230000000,
    },
  },
  2: {
    ...mockPoliticians[1],
    stats: {
      presencePercent: 68,
      totalVotes: 453,
      yesVotes: 198,
      noVotes: 110,
      absentVotes: 145,
      obstructionVotes: 0,
      partyAlignmentPercent: 72,
      totalAmendments: 870000000,
    },
  },
  3: {
    ...mockPoliticians[2],
    stats: {
      presencePercent: 88,
      totalVotes: 453,
      yesVotes: 301,
      noVotes: 98,
      absentVotes: 54,
      obstructionVotes: 0,
      partyAlignmentPercent: 91,
      totalAmendments: 2210000000,
    },
  },
  4: {
    ...mockPoliticians[3],
    stats: {
      presencePercent: 74,
      totalVotes: 453,
      yesVotes: 245,
      noVotes: 89,
      absentVotes: 119,
      obstructionVotes: 0,
      partyAlignmentPercent: 66,
      totalAmendments: 1500000000,
    },
  },
};

// --- Search ---
export function mockSearch(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return mockPoliticians
    .filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.party.toLowerCase() === q ||
        p.state.toLowerCase() === q ||
        `${p.party}-${p.state}`.toLowerCase() === q
      );
    })
    .map((p) => ({
      politician: p,
      presencePercent: mockProfiles[p.id]?.stats.presencePercent ?? 75,
      totalAmendments: mockProfiles[p.id]?.stats.totalAmendments ?? 0,
    }));
}

// --- Rankings ---
export const mockRankings: Record<string, RankingEntry[]> = {
  faltosos: [
    { rank: 1, politician: mockPoliticians[4], metric: 'Presença', value: 38 },
    { rank: 2, politician: mockPoliticians[5], metric: 'Presença', value: 41 },
    { rank: 3, politician: mockPoliticians[6], metric: 'Presença', value: 47 },
    { rank: 4, politician: mockPoliticians[3], metric: 'Presença', value: 52 },
    { rank: 5, politician: mockPoliticians[1], metric: 'Presença', value: 55 },
  ],
  transparencia: [
    { rank: 1, politician: mockPoliticians[9], metric: 'Anti-transparência', value: 89 },
    { rank: 2, politician: mockPoliticians[2], metric: 'Anti-transparência', value: 78 },
    { rank: 3, politician: mockPoliticians[4], metric: 'Anti-transparência', value: 67 },
  ],
  rebeldes: [
    { rank: 1, politician: mockPoliticians[6], metric: 'Contra partido', value: 34 },
    { rank: 2, politician: mockPoliticians[3], metric: 'Contra partido', value: 28 },
    { rank: 3, politician: mockPoliticians[1], metric: 'Contra partido', value: 22 },
  ],
  emendas: [
    { rank: 1, politician: mockPoliticians[2], metric: 'Emendas concentradas', value: 1 },
    { rank: 2, politician: mockPoliticians[5], metric: 'Emendas concentradas', value: 2 },
    { rank: 3, politician: mockPoliticians[8], metric: 'Emendas concentradas', value: 3 },
  ],
};

// --- Vote Detail ---
export interface VoterEntry {
  politician: Politician;
  position: import('./types').VotePosition;
}

export function mockVoteDetail(voteId: number): { vote: Vote; voters: VoterEntry[]; guidance: import('./types').PartyGuidance[] } | null {
  const vote = mockVotes.find((v) => v.id === voteId);
  if (!vote) return null;

  // Simulate all politicians having voted on this
  const positions: import('./types').VotePosition[] = ['SIM', 'NAO', 'AUSENTE', 'SIM', 'SIM', 'NAO', 'AUSENTE', 'SIM', 'NAO', 'SIM'];
  const voters: VoterEntry[] = mockPoliticians.map((p, i) => ({
    politician: p,
    position: mockPoliticianVotes[p.id]?.find((v) => v.voteId === voteId)?.position ?? positions[i % positions.length],
  }));

  const guidance: import('./types').PartyGuidance[] = [
    { voteId, party: 'PT', guidance: 'SIM' },
    { voteId, party: 'PL', guidance: 'SIM' },
    { voteId, party: 'MDB', guidance: 'SIM' },
    { voteId, party: 'UNIÃO', guidance: 'Liberado' },
    { voteId, party: 'PP', guidance: 'SIM' },
    { voteId, party: 'PSD', guidance: 'SIM' },
    { voteId, party: 'AVANTE', guidance: 'Liberado' },
  ];

  return { vote, voters, guidance };
}

// --- Compare ---
export function mockCompare(ids: number[]): CompareData {
  const politicians = ids.map((id) => mockProfiles[id]).filter(Boolean);
  const commonVoteIds = [1, 2, 3, 4, 6, 7, 8];
  let agree = 0;
  let disagree = 0;
  const commonVotes = commonVoteIds.map((voteId) => {
    const vote = mockVotes[voteId - 1];
    const positions: Record<number, any> = {};
    ids.forEach((id) => {
      const pv = mockPoliticianVotes[id]?.find((v) => v.voteId === voteId);
      positions[id] = pv?.position ?? 'AUSENTE';
    });
    const posValues = Object.values(positions);
    if (new Set(posValues).size === 1) agree++;
    else disagree++;
    return { vote, positions };
  });
  return { politicians, commonVotes, agreementCount: agree, disagreementCount: disagree };
}
