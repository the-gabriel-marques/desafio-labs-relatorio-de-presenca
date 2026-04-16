// ============================================================
//   Para rodar no terminal
//   1. node js/relatorio-terminal.js            -> Mostra o Ranking Geral
//   2. node js/relatorio-terminal.js "inscritos" -> Lista todos os alunos
//   3. node js/relatorio-terminal.js "eventos"   -> Lista todos os encontros
//   4. node js/relatorio-terminal.js "Curso"     -> Busca detalhes de um encontro
// ===========================================================================

const initSqlJs = require("sql.js");

async function executar() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`
        CREATE TABLE inscritos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, email TEXT UNIQUE);
        CREATE TABLE encontros (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, data_evento TEXT);
        CREATE TABLE inscricoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            inscrito_id INTEGER, 
            encontro_id INTEGER, 
            presente INTEGER DEFAULT 0,
            FOREIGN KEY (inscrito_id) REFERENCES inscritos(id),
            FOREIGN KEY (encontro_id) REFERENCES encontros(id)
        );

        INSERT INTO inscritos (nome, email) VALUES 
            ('Ana Souza', 'ana@email.com'), 
            ('Bruno Lima', 'bruno@email.com'), 
            ('Carla Mendes', 'carla@email.com'), 
            ('Daniel Rocha', 'daniel@email.com');

        INSERT INTO encontros (nome, data_evento) VALUES 
            ('Workshop Node.js', '2026-05-10'), 
            ('Curso React', '2026-04-12');

        INSERT INTO inscricoes (inscrito_id, encontro_id, presente) VALUES 
            (1, 1, 1), (2, 1, 1), (3, 1, 0), (4, 1, 1), 
            (1, 2, 1), (2, 2, 1), (3, 2, 1), (4, 2, 0);
    `);

  function linha(char = "-") {
    return char.repeat(60);
  }

  function imprimirTabelaInscritos() {
    const res = db.exec("SELECT * FROM inscritos ORDER BY nome ASC");
    console.log("\n" + linha("="));
    console.log("  👥 TABELA DE INSCRITOS (TODOS OS ALUNOS)");
    console.log(linha("="));
    console.log("  ID  | Nome                | Email");
    console.log(linha());
    if (res.length > 0) {
      res[0].values.forEach((r) => {
        console.log(
          `  ${String(r[0]).padEnd(3)} | ${r[1].padEnd(19)} | ${r[2]}`,
        );
      });
    }
    console.log(linha("=") + "\n");
  }

  function imprimirTabelaEventos() {
    const res = db.exec("SELECT * FROM encontros ORDER BY data_evento ASC");
    console.log("\n" + linha("="));
    console.log("  📅 TABELA DE EVENTOS (ENCONTROS)");
    console.log(linha("="));
    console.log("  ID  | Evento              | Data Prevista");
    console.log(linha());
    if (res.length > 0) {
      res[0].values.forEach((r) => {
        console.log(
          `  ${String(r[0]).padEnd(3)} | ${r[1].padEnd(19)} | ${r[2]}`,
        );
      });
    }
    console.log(linha("=") + "\n");
  }

  function imprimirDetalhesEncontro(nomeBusca) {
    const stmtResumo = db.prepare(`
            SELECT e.nome, e.data_evento, COUNT(i.id) as total, SUM(i.presente) as pres
            FROM encontros e
            JOIN inscricoes i ON i.encontro_id = e.id
            WHERE e.nome LIKE ?
        `);
    stmtResumo.bind([`%${nomeBusca}%`]);

    if (!stmtResumo.step()) {
      console.log(
        `\n❌ Nenhum encontro encontrado com o termo: "${nomeBusca}"`,
      );
      return;
    }

    const dados = stmtResumo.getAsObject();
    stmtResumo.free();

    if (!dados.nome) {
      console.log(`\n❌ Encontro "${nomeBusca}" não encontrado.`);
      return;
    }

    const taxa = ((dados.pres / dados.total) * 100).toFixed(1);

    console.log("\n" + linha("="));
    console.log(`  📊 RELATÓRIO DETALHADO: ${dados.nome}`);
    console.log(linha("="));
    console.log(`  📅 Data      : ${dados.data_evento}`);
    console.log(`  👥 Inscritos : ${dados.total}`);
    console.log(`  ✅ Presentes : ${dados.pres}`);
    console.log(`  ❌ Faltaram  : ${dados.total - dados.pres}`);
    console.log(`  📈 Taxa      : ${taxa}%`);
    console.log(linha());

    const stmtLista = db.prepare(`
            SELECT ins.nome, ins.email 
            FROM inscricoes i 
            JOIN inscritos ins ON ins.id = i.inscrito_id
            JOIN encontros e ON e.id = i.encontro_id
            WHERE e.nome = ? AND i.presente = 1
            ORDER BY ins.nome ASC
        `);
    stmtLista.bind([dados.nome]);

    console.log(`  LISTA DE PRESENÇA CONFIRMADA:`);
    while (stmtLista.step()) {
      const p = stmtLista.getAsObject();
      console.log(`  • ${p.nome.padEnd(15)} | ${p.email}`);
    }
    stmtLista.free();
    console.log(linha("=") + "\n");
  }

  function imprimirRankingGeral() {
    const res = db.exec(`
            SELECT e.nome, COUNT(i.id) as insc, SUM(i.presente) as pres,
            ROUND(SUM(i.presente) * 100.0 / COUNT(i.id), 1) as taxa
            FROM encontros e
            JOIN inscricoes i ON i.encontro_id = e.id
            GROUP BY e.id ORDER BY taxa DESC
        `);

    console.log("\n" + linha("="));
    console.log("  🏆 RANKING GERAL DE PRESENÇA (TERMINAL)");
    console.log(linha("="));
    console.log("  Encontro                  | Insc | Pres | Taxa %");
    console.log(linha());

    if (res.length > 0) {
      res[0].values.forEach((r) => {
        const nome = r[0].padEnd(26);
        const insc = String(r[1]).padEnd(4);
        const pres = String(r[2]).padEnd(4);
        const taxa = String(r[3]).padStart(5);
        console.log(`  ${nome} | ${insc} | ${pres} | ${taxa}%`);
      });
    }
    console.log(linha("="));
    console.log('  💡 Dica: Use "inscritos", "eventos" ou "[nome do curso]"');
    console.log(linha("=") + "\n");
  }

  const argRaw = process.argv[2];
  const argumento = argRaw ? argRaw.toLowerCase() : null;

  if (!argumento) {
    imprimirRankingGeral();
  } else if (argumento === "inscritos") {
    imprimirTabelaInscritos();
  } else if (argumento === "eventos") {
    imprimirTabelaEventos();
  } else {
    imprimirDetalhesEncontro(argRaw);
  }
}

executar().catch((err) => console.error("Erro crítico no sistema:", err));
