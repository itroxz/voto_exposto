// Types for the Voto Exposto application

export type Chamber = 'camara' | 'senado';

export type VotePosition = 'SIM' | 'NAO' | 'AUSENTE' | 'OBSTRUCAO' | 'ABSTENCAO';

export type VoteCategory =
  | 'transparencia'
  | 'corrupcao'
  | 'direitos'
  | 'meio_ambiente'
  | 'orcamento'
  | 'privilegios'
  | 'tributacao'
  | 'seguranca'
  | 'educacao'
  | 'saude'
  | 'outros';

export interface Politician {
  id: number;
  externalId: string;
  name: string;
  party: string;
  state: string;
  chamber: Chamber;
  photoUrl: string;
  email?: string;
  phone?: string;
  active: boolean;
  legislature: number;
}

export interface PoliticianStats {
  presencePercent: number;
  totalVotes: number;
  yesVotes: number;
  noVotes: number;
  absentVotes: number;
  obstructionVotes: number;
  partyAlignmentPercent: number;
  totalAmendments: number; // in centavos
}

export interface PoliticianProfile extends Politician {
  stats: PoliticianStats;
}

export interface Vote {
  id: number;
  externalId: string;
  date: string;
  description: string;
  summary: string;
  result: string;
  yesCount: number;
  noCount: number;
  absentCount: number;
  chamber: Chamber;
  isHighlighted: boolean;
  category: VoteCategory;
}

export interface PoliticianVote {
  politicianId: number;
  voteId: number;
  position: VotePosition;
  vote: Vote;
}

export interface PartyGuidance {
  voteId: number;
  party: string;
  guidance: string;
}

export interface Amendment {
  id: number;
  politicianId: number;
  year: number;
  amount: number; // in centavos
  city: string;
  state: string;
  description: string;
  type: string;
}

export interface RankingEntry {
  rank: number;
  politician: Politician;
  metric: string;
  value: number;
}

export interface SearchResult {
  politician: Politician;
  presencePercent: number;
  totalAmendments: number;
}

export interface CompareData {
  politicians: PoliticianProfile[];
  commonVotes: {
    vote: Vote;
    positions: Record<number, VotePosition>;
  }[];
  agreementCount: number;
  disagreementCount: number;
}

// Helper functions
export function getVoteBadgeClass(position: VotePosition): string {
  switch (position) {
    case 'SIM': return 'vote-badge--yes';
    case 'NAO': return 'vote-badge--no';
    case 'AUSENTE': return 'vote-badge--absent';
    case 'OBSTRUCAO': return 'vote-badge--obstruction';
    case 'ABSTENCAO': return 'vote-badge--absent';
  }
}

export function getVoteLabel(position: VotePosition): string {
  switch (position) {
    case 'SIM': return '✓ Sim';
    case 'NAO': return '✗ Não';
    case 'AUSENTE': return '— Ausente';
    case 'OBSTRUCAO': return '⊘ Obstrução';
    case 'ABSTENCAO': return '○ Abstenção';
  }
}

export function formatCurrency(centavos: number): string {
  const reais = centavos / 100;
  if (reais >= 1_000_000) {
    return `R$ ${(reais / 1_000_000).toFixed(1)}M`;
  }
  if (reais >= 1_000) {
    return `R$ ${(reais / 1_000).toFixed(0)}mil`;
  }
  return `R$ ${reais.toFixed(0)}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getChamberLabel(chamber: Chamber): string {
  return chamber === 'camara' ? 'Câmara' : 'Senado';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function presenceColor(percent: number): string {
  if (percent >= 85) return 'var(--vote-yes-light)';
  if (percent >= 70) return 'var(--vote-obstruction-light)';
  return 'var(--vote-no-light)';
}
