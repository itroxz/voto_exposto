-- Voto Exposto — D1 Database Schema
-- Run with: wrangler d1 execute voto-exposto-db --file=db/schema.sql

-- Politicians (deputados + senadores)
CREATE TABLE IF NOT EXISTS politicians (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  party TEXT NOT NULL,
  state TEXT NOT NULL,
  chamber TEXT NOT NULL CHECK (chamber IN ('camara', 'senado')),
  photo_url TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  legislature INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_politicians_name ON politicians(name);
CREATE INDEX IF NOT EXISTS idx_politicians_party ON politicians(party);
CREATE INDEX IF NOT EXISTS idx_politicians_state ON politicians(state);
CREATE INDEX IF NOT EXISTS idx_politicians_chamber ON politicians(chamber);
CREATE INDEX IF NOT EXISTS idx_politicians_search ON politicians(name, party, state);

-- Votes (votações em plenário)
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  external_id TEXT NOT NULL UNIQUE,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  summary TEXT DEFAULT '',
  result TEXT DEFAULT '',
  yes_count INTEGER NOT NULL DEFAULT 0,
  no_count INTEGER NOT NULL DEFAULT 0,
  absent_count INTEGER NOT NULL DEFAULT 0,
  chamber TEXT NOT NULL CHECK (chamber IN ('camara', 'senado')),
  is_highlighted INTEGER NOT NULL DEFAULT 0,
  category TEXT DEFAULT 'outros',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_votes_date ON votes(date);
CREATE INDEX IF NOT EXISTS idx_votes_highlighted ON votes(is_highlighted);
CREATE INDEX IF NOT EXISTS idx_votes_chamber ON votes(chamber);
CREATE INDEX IF NOT EXISTS idx_votes_category ON votes(category);

-- Individual politician votes (como cada um votou)
CREATE TABLE IF NOT EXISTS politician_votes (
  politician_id INTEGER NOT NULL,
  vote_id INTEGER NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('SIM', 'NAO', 'AUSENTE', 'OBSTRUCAO', 'ABSTENCAO')),
  PRIMARY KEY (politician_id, vote_id),
  FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE,
  FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pv_politician ON politician_votes(politician_id);
CREATE INDEX IF NOT EXISTS idx_pv_vote ON politician_votes(vote_id);

-- Party voting guidance (orientação de bancada)
CREATE TABLE IF NOT EXISTS party_guidance (
  vote_id INTEGER NOT NULL,
  party TEXT NOT NULL,
  guidance TEXT NOT NULL,
  PRIMARY KEY (vote_id, party),
  FOREIGN KEY (vote_id) REFERENCES votes(id) ON DELETE CASCADE
);

-- Parliamentary amendments (emendas parlamentares)
CREATE TABLE IF NOT EXISTS amendments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  politician_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0, -- in centavos
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'individual',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_amendments_politician ON amendments(politician_id);
CREATE INDEX IF NOT EXISTS idx_amendments_year ON amendments(year);

-- Attendance (presença nas sessões)
CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  politician_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  present INTEGER NOT NULL DEFAULT 0,
  session_type TEXT DEFAULT 'plenario',
  FOREIGN KEY (politician_id) REFERENCES politicians(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_attendance_politician ON attendance(politician_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Metadata (controle de atualizações)
CREATE TABLE IF NOT EXISTS metadata (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Insert initial metadata
INSERT OR REPLACE INTO metadata (key, value) VALUES ('last_update', datetime('now'));
INSERT OR REPLACE INTO metadata (key, value) VALUES ('data_version', '1.0.0');
