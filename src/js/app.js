var db = null;

window.addEventListener('load', function () {
    var config = {
        locateFile: function (filename) {
            return 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.2/' + filename;
        }
    };

    initSqlJs(config).then(function (SQL) {
        
        db = iniciarBanco(SQL);

        
        exibirPainelExplorar(); 

        
        var ranking = buscarRankingEncontros(db);
        exibirRanking(ranking);

        console.log('✅ Sistema e Banco de Dados prontos!');
    }).catch(function(err) {
        console.error('Erro ao iniciar o SQL.js:', err);
    });
});

function buscarEncontro() {
    if (!db) return;

    var campo = document.getElementById('campo-busca');
    var nomeDigitado = campo.value.trim();

    limparErro();

    // 🔹 valida campo vazio
    if (nomeDigitado === '') {
        exibirErro('⚠️ Digite o nome de um encontro para buscar.');
        return;
    }

    var dadosBrutos = buscarDadosEncontro(db, nomeDigitado);

    // 🔹 valida se NÃO encontrou
    if (!dadosBrutos) {
        exibirErro('❌ Encontro "' + nomeDigitado + '" não encontrado.');
        return;
    }

    var relatorio = gerarRelatorio(dadosBrutos);

    if (!relatorio.encontro) {
        relatorio.encontro = nomeDigitado;
    }

    exibirRelatorio(relatorio);

    var presentes = buscarListaPresentes(db, nomeDigitado);
    exibirListaPresentes(presentes);
}

document.addEventListener('DOMContentLoaded', function () {
    var campo = document.getElementById('campo-busca');
    
    if (campo) {
        //tecla Enter
        campo.addEventListener('keydown', function (evento) {
            if (evento.key === 'Enter') {
                buscarEncontro();
            }
        });

        // Limpa a mensagem de erro vermelha assim que o usuário digita algo novo
        campo.addEventListener('input', function() {
            limparErro();
        });
    }

    
    var modal = document.getElementById('modal-explorar');
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            alternarExplorar();
        }
    });
});