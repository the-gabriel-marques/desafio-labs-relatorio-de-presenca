var SCHEMA = `
    CREATE TABLE IF NOT EXISTS inscritos (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        nome  TEXT    NOT NULL,
        email TEXT    UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS encontros (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        nome        TEXT NOT NULL,
        data_evento TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS inscricoes (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        inscrito_id INTEGER NOT NULL,
        encontro_id INTEGER NOT NULL,
        presente    INTEGER NOT NULL DEFAULT 0,
        UNIQUE (inscrito_id, encontro_id),
        FOREIGN KEY (inscrito_id) REFERENCES inscritos(id),
        FOREIGN KEY (encontro_id) REFERENCES encontros(id)
    );
`;

var SEED = `
    INSERT INTO inscritos (nome, email) VALUES
        ('Ana Souza',       'ana@email.com'),
        ('Bruno Lima',      'bruno@email.com'),
        ('Carla Mendes',    'carla@email.com'),
        ('Daniel Rocha',    'daniel@email.com'),
        ('Eduarda Alves',   'eduarda@email.com'),
        ('Felipe Costa',    'felipe@email.com'),
        ('Gabriela Santos', 'gabriela@email.com');

    INSERT INTO encontros (nome, data_evento) VALUES
        ('Workshop Node.js',   '2026-05-10'),
        ('Curso React',        '2026-04-12'),
        ('Palestra DevOps',    '2026-05-15'),
        ('Treinamento SQL',    '2026-05-18'),
        ('Workshop UX Design', '2026-05-22');

    -- Encontro 1: Workshop Node.js — 4 presentes, 3 faltaram
    INSERT INTO inscricoes (inscrito_id, encontro_id, presente) VALUES
        (1, 1, 1), (2, 1, 1), (3, 1, 0),
        (4, 1, 1), (5, 1, 0), (6, 1, 1), (7, 1, 0);

    -- Encontro 2: Curso React — 5 presentes, 1 faltou
    INSERT INTO inscricoes (inscrito_id, encontro_id, presente) VALUES
        (1, 2, 1), (2, 2, 0), (3, 2, 1),
        (4, 2, 1), (5, 2, 1), (6, 2, 1);

    -- Encontro 3: Palestra DevOps — 2 presentes, 3 faltaram
    INSERT INTO inscricoes (inscrito_id, encontro_id, presente) VALUES
        (1, 3, 0), (2, 3, 1), (3, 3, 0),
        (4, 3, 1), (5, 3, 0);
`;

function iniciarBanco(SQL) {
  var db = new SQL.Database();
  db.run(SCHEMA);
  db.run(SEED);
  return db;
}

function buscarDadosEncontro(db, nomeEncontro) {
  var query = `
        SELECT
            e.nome                          AS nomeEncontro,
            e.data_evento                   AS dataEvento,
            COUNT(i.id)                     AS inscritos,
            SUM(i.presente)                 AS presentes
        FROM encontros e
        JOIN inscricoes i ON i.encontro_id = e.id
        WHERE e.nome = '${nomeEncontro}';
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
            ins.nome   AS nome,
            ins.email  AS email
        FROM inscricoes i
        JOIN inscritos ins ON ins.id = i.inscrito_id
        JOIN encontros e   ON e.id   = i.encontro_id
        WHERE e.nome     = '${nomeEncontro}'
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
            e.nome                                              AS encontro,
            COUNT(i.id)                                         AS inscritos,
            SUM(i.presente)                                     AS presentes,
            COUNT(i.id) - SUM(i.presente)                       AS faltaram,
            ROUND(SUM(i.presente) * 100.0 / COUNT(i.id), 1)    AS taxa_pct
        FROM encontros e
        JOIN inscricoes i ON i.encontro_id = e.id
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
