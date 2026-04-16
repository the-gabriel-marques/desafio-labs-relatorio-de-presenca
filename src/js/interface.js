

/**
 * Abre ou fecha o Modal
 */
function alternarExplorar() {
    const modal = document.getElementById('modal-explorar');
    if (!modal) return;

    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'flex'; 
        exibirPainelExplorar(); 
    } else {
        modal.style.display = 'none';
    }
}

function exibirPainelExplorar() {
    const container = document.getElementById('lista-encontros-chips');
    if (!container || !db) return;

    try {
        const eventos = buscarCatalogoEventos(db);

        if (eventos.length > 0) {
            container.innerHTML = ''; 
            eventos.forEach(nomeEncontro => {
                const botao = document.createElement('button');
                botao.type = 'button';
                botao.className = 'btn-chip'; 
                botao.textContent = nomeEncontro;
                
                botao.onclick = () => {
                    preencherBusca(nomeEncontro);
                    alternarExplorar(); 
                };
                container.appendChild(botao);
            });
        } else {
            container.innerHTML = '<span class="status-carregando">Nenhum encontro cadastrado.</span>';
        }
    } catch (e) {
        console.error("Erro ao carregar catálogo:", e);
    }
}


function preencherBusca(nome) {
    const campo = document.getElementById('campo-busca');
    if (campo) {
        campo.value = nome;
        if (typeof buscarEncontro === "function") {
            buscarEncontro();
        }
    }
}


 
function exibirRelatorio(relatorio) {
    const secaoRelatorio = document.getElementById('secao-relatorio');
    const secaoPresentes = document.getElementById('secao-presentes');
    
    if (secaoRelatorio) secaoRelatorio.style.display = 'block';
    if (secaoPresentes) secaoPresentes.style.display = 'block';

    // Normalização de dados para evitar 'undefined'
    const inscritos = relatorio.inscritos ?? relatorio.total_inscritos ?? 0;
    const presentes = relatorio.presentes ?? relatorio.total_presentes ?? 0;
    const faltantes = relatorio.faltaram ?? (inscritos - presentes);
    const taxa = relatorio.taxa ?? relatorio.taxa_pct ?? 0;

    
    document.getElementById('r-encontro').textContent = relatorio.encontro || "Não encontrado";
    document.getElementById('r-data').textContent     = formatarData(relatorio.data);
    document.getElementById('r-inscritos').textContent = inscritos;
    document.getElementById('r-presentes').textContent = presentes;
    document.getElementById('r-faltaram').textContent  = faltantes < 0 ? 0 : faltantes;
    document.getElementById('r-taxa').textContent      = taxa + '%';
    document.getElementById('r-taxa-2').textContent    = taxa + '%';

    const elClass = document.getElementById('r-class');
    if (elClass) elClass.textContent = relatorio.classificacao || "";


    const barra = document.getElementById('barra-progresso');
    if (barra) {
        barra.style.width = taxa + '%';
        barra.style.background = taxa >= 75 ? 'var(--cor-verde, #22c55e)' : 
                                 taxa >= 50 ? 'var(--cor-amarelo, #f59e0b)' : 
                                              'var(--cor-vermelho, #ef4444)';
    }

    
    if (secaoRelatorio) {
        secaoRelatorio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function exibirListaPresentes(lista) {
    const container = document.getElementById('lista-presentes');
    if (!container) return;
    container.innerHTML = ''; 

    if (!lista || lista.length === 0) {
        container.innerHTML = '<p class="status-carregando" style="grid-column: 1/-1;">Nenhum registro de presença para este encontro.</p>';
        return;
    }

    lista.forEach(pessoa => {
        const item = document.createElement('div');
        item.className = 'mini-card';
        item.style.textAlign = 'left';
        item.style.padding = '0.8rem';
        item.innerHTML = `
            <div style="color: var(--cor-verde, #22c55e); font-weight: bold;">✅ ${pessoa.nome}</div>
            <div style="color: var(--cor-texto-2, #94a3b8); font-size: 0.75rem;">${pessoa.email}</div>
        `;
        container.appendChild(item);
    });
}


function exibirRanking(ranking) {
    const tbody = document.getElementById('tabela-ranking');
    if (!tbody) return;
    tbody.innerHTML = '';

    ranking.forEach((linha, indice) => {
        const posicao = indice + 1;
        const medalha = posicao === 1 ? '🥇' : posicao === 2 ? '🥈' : posicao === 3 ? '🥉' : posicao + 'º';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${medalha}</td>
            <td style="color: var(--cor-destaque, #3b82f6)">${linha.encontro}</td>
            <td>${linha.inscritos ?? linha.total_inscritos ?? 0}</td>
            <td>${linha.presentes ?? linha.total_presentes ?? 0}</td>
            <td><strong>${linha.taxa_pct ?? 0}%</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

function exibirErro(mensagem) {
    const el = document.getElementById('erro');
    if (el) {
        el.textContent = mensagem;
        el.style.display = 'block';
    }
    const sRel = document.getElementById('secao-relatorio');
    const sPre = document.getElementById('secao-presentes');
    if (sRel) sRel.style.display = 'none';
    if (sPre) sPre.style.display = 'none';
}

function limparErro() {
    const el = document.getElementById('erro');
    if (el) el.style.display = 'none';
}

function formatarData(dataISO) {
    if (!dataISO) return '--/--/----';
    const p = dataISO.split('-');
    return p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : dataISO;
}
