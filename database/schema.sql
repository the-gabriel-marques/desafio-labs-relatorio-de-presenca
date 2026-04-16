PRAGMA foreign_keys = ON;

-- Tabela de inscritos
CREATE TABLE inscritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT UNIQUE,
    data_nascimento DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de eventos
CREATE TABLE eventos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    data_evento DATE NOT NULL,
    hora_evento TIME NOT NULL,
    local TEXT,
    organizador TEXT,
    palestrante TEXT,
    informacoes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela relacionamento (inscrição + presença)
CREATE TABLE inscricoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    inscrito_id INTEGER NOT NULL,
    evento_id INTEGER NOT NULL,

    data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP,

    presente INTEGER DEFAULT 0, -- BOOLEAN (0 = false, 1 = true)
    data_checkin DATETIME,

    UNIQUE (inscrito_id, evento_id),

    FOREIGN KEY (inscrito_id) REFERENCES inscritos(id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES eventos(id) ON DELETE CASCADE
);
