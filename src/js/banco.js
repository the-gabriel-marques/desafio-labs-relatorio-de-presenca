var SCHEMA = `
    CREATE TABLE IF NOT EXISTS inscritos (
        id              INTEGER PRIMARY KEY AUTOINCREMENT,
        nome            TEXT NOT NULL,
        telefone        TEXT,
        email           TEXT UNIQUE NOT NULL,
        data_nascimento TEXT
    );

    CREATE TABLE IF NOT EXISTS eventos (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        descricao    TEXT NOT NULL,
        data_evento  TEXT NOT NULL,
        hora_evento  TEXT,
        local        TEXT,
        organizador  TEXT,
        palestrante  TEXT,
        informacoes  TEXT
    );

    CREATE TABLE IF NOT EXISTS inscricoes (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        inscrito_id  INTEGER NOT NULL,
        evento_id    INTEGER NOT NULL,
        presente     INTEGER NOT NULL DEFAULT 0,
        data_checkin TEXT,
        UNIQUE (inscrito_id, evento_id),
        FOREIGN KEY (inscrito_id) REFERENCES inscritos(id),
        FOREIGN KEY (evento_id) REFERENCES eventos(id)
    );
`;

var SEED = `
    INSERT INTO inscritos (nome, telefone, email, data_nascimento) VALUES
        ('Ana Souza', '73999990001', 'ana@email.com', '1995-02-10'),
        ('Bruno Lima', '73999990002', 'bruno@email.com', '1990-06-21'),
        ('Carla Mendes', '73999990003', 'carla@email.com', '1988-11-03'),
        ('Daniel Rocha', '73999990004', 'daniel@email.com', '1992-09-15'),
        ('Eduarda Alves', '73999990005', 'eduarda@email.com', '1997-01-30'),
        ('Felipe Costa', '73999990006', 'felipe@email.com', '1993-07-12'),
        ('Gabriela Santos', '73999990007', 'gabriela@email.com', '1996-05-25'),
        ('Helena Martins', '73999990008', 'helena@email.com', '1994-03-18'),
        ('Igor Fernandes', '73999990009', 'igor@email.com', '1991-08-27'),
        ('Juliana Costa', '73999990010', 'juliana@email.com', '1998-12-09'),
        ('Kaique Souza', '73999990011', 'kaique@email.com', '1996-04-14'),
        ('Larissa Gomes', '73999990012', 'larissa@email.com', '1995-10-02');

    INSERT INTO eventos (descricao, data_evento, hora_evento, local, organizador, palestrante, informacoes) VALUES
        ('Workshop Node.js', '2026-05-10', '19:00', 'Auditório A', 'Tech Org', 'João Silva', 'Introdução ao Node'),
        ('Curso React', '2026-04-12', '18:00', 'Sala 2', 'Tech Org', 'Maria Souza', 'React básico'),
        ('Palestra DevOps', '2026-05-15', '20:00', 'Auditório B', 'Dev Group', 'Carlos Lima', 'CI/CD'),
        ('Treinamento QA', '2026-05-18', '19:30', 'Sala 1', 'QA Team', 'Fernanda Alves', 'Testes automatizados'),
        ('Curso SQL', '2026-05-20', '18:30', 'Lab 3', 'Data Org', 'Ricardo Mendes', 'Banco de dados'),
        ('Workshop UX Design', '2026-05-22', '17:00', 'Sala 4', 'Design Org', 'Patricia Rocha', 'Experiência do usuário'),
        ('Palestra Segurança', '2026-05-25', '19:00', 'Auditório C', 'Security Org', 'Lucas Costa', 'Segurança web');

    INSERT INTO inscricoes (inscrito_id, evento_id, presente, data_checkin) VALUES
        (1, 1, 1, '2026-05-10 19:05'),
        (2, 1, 1, '2026-05-10 19:10'),
        (3, 1, 0, NULL),
        (4, 1, 1, '2026-05-10 19:15'),
        (5, 1, 0, NULL),
        (6, 1, 1, '2026-05-10 19:20'),
        (7, 1, 0, NULL),
        (1, 2, 1, '2026-04-12 18:05'),
        (2, 2, 0, NULL),
        (3, 2, 1, '2026-04-12 18:10'),
        (4, 2, 1, '2026-04-12 18:15'),
        (5, 2, 0, NULL),
        (6, 2, 1, '2026-04-12 18:20'),
        (7, 2, 1, '2026-04-12 18:25'),
        (1, 3, 0, NULL),
        (3, 3, 1, '2026-05-15 20:03'),
        (5, 3, 0, NULL),
        (8, 3, 1, '2026-05-15 20:10'),
        (9, 3, 0, NULL),
        (10, 3, 0, NULL),
        (2, 4, 1, '2026-05-18 19:31'),
        (4, 4, 1, '2026-05-18 19:36'),
        (6, 4, 0, NULL),
        (8, 4, 1, '2026-05-18 19:40'),
        (11, 4, 1, '2026-05-18 19:44'),
        (12, 4, 0, NULL),
        (1, 5, 1, '2026-05-20 18:31'),
        (2, 5, 1, '2026-05-20 18:34'),
        (5, 5, 1, '2026-05-20 18:37'),
        (7, 5, 0, NULL),
        (9, 5, 1, '2026-05-20 18:40'),
        (10, 5, 1, '2026-05-20 18:43'),
        (12, 5, 0, NULL),
        (3, 6, 1, '2026-05-22 17:02'),
        (4, 6, 1, '2026-05-22 17:04'),
        (6, 6, 1, '2026-05-22 17:06'),
        (8, 6, 1, '2026-05-22 17:08'),
        (10, 6, 1, '2026-05-22 17:10'),
        (11, 6, 1, '2026-05-22 17:12'),
        (2, 7, 0, NULL),
        (5, 7, 1, '2026-05-25 19:05'),
        (7, 7, 1, '2026-05-25 19:08'),
        (9, 7, 0, NULL),
        (11, 7, 1, '2026-05-25 19:12'),
        (12, 7, 0, NULL);
`;

function iniciarBanco(SQL) {
  var db = new SQL.Database();
  db.run(SCHEMA);
  db.run(SEED);
  return db;
}

function buscarCatalogoEventos(db) {
  var query = `
        SELECT e.descricao AS nomeEvento
        FROM eventos e
        ORDER BY e.descricao ASC;
    `;

  var resultado = db.exec(query);
  if (!resultado.length) return [];

  return resultado[0].values.map(function (linha) {
    return linha[0];
  });
}

function buscarDadosEncontro(db, nomeEncontro) {
  var query = `
        SELECT
            e.descricao                  AS nomeEncontro,
            e.data_evento                AS dataEvento,
            COUNT(i.id)                  AS inscritos,
            COALESCE(SUM(i.presente), 0) AS presentes
        FROM eventos e
        JOIN inscricoes i ON i.evento_id = e.id
        WHERE e.descricao = '${nomeEncontro}'
        GROUP BY e.id, e.descricao, e.data_evento;
    `;

  var resultado = db.exec(query);

  if (!resultado.length || !resultado[0].values.length) return null;

  var colunas = resultado[0].columns;
  var valores = resultado[0].values[0];

  var objeto = {};
  colunas.forEach(function (coluna, indice) {
    objeto[coluna] = valores[indice];
  });

  return objeto;
}

function buscarListaPresentes(db, nomeEncontro) {
  var query = `
        SELECT
            ins.nome  AS nome,
            ins.email AS email
        FROM inscricoes i
        JOIN inscritos ins ON ins.id = i.inscrito_id
        JOIN eventos e ON e.id = i.evento_id
        WHERE e.descricao = '${nomeEncontro}'
          AND i.presente = 1
        ORDER BY ins.nome;
    `;

  var resultado = db.exec(query);
  if (!resultado.length) return [];

  var colunas = resultado[0].columns;

  return resultado[0].values.map(function (linha) {
    var obj = {};
    colunas.forEach(function (col, idx) {
      obj[col] = linha[idx];
    });
    return obj;
  });
}

function buscarRankingEncontros(db) {
  var query = `
        SELECT
            e.descricao AS encontro,
            COUNT(i.id) AS inscritos,
            COALESCE(SUM(i.presente), 0) AS presentes,
            COUNT(i.id) - COALESCE(SUM(i.presente), 0) AS faltaram,
            ROUND(COALESCE(SUM(i.presente), 0) * 100.0 / COUNT(i.id), 1) AS taxa_pct
        FROM eventos e
        JOIN inscricoes i ON i.evento_id = e.id
        GROUP BY e.id
        ORDER BY taxa_pct DESC;
    `;

  var resultado = db.exec(query);
  if (!resultado.length) return [];

  var colunas = resultado[0].columns;
  return resultado[0].values.map(function (linha) {
    var obj = {};
    colunas.forEach(function (col, idx) {
      obj[col] = linha[idx];
    });
    return obj;
  });
}
