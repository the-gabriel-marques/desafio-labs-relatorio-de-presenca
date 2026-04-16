function calcularTaxa(presentes, total) {
  if (total === 0) return 0; // condicional: se não há inscritos, retorna 0
  return Math.round((presentes / total) * 1000) / 10; // arredonda 1 casa decimal
}

function classificarTaxa(taxa) {
  if (taxa >= 75) {
    return "🟢 Ótima";
  } else if (taxa >= 50) {
    return "🟡 Regular";
  } else {
    return "🔴 Baixa";
  }
}

function gerarRelatorio(dados) {
  var totalInscritos = dados.inscritos;
  var totalPresentes = dados.presentes;
  var totalFaltaram = totalInscritos - totalPresentes;
  var taxa = calcularTaxa(totalPresentes, totalInscritos);
  var classificacao = classificarTaxa(taxa);

  return {
    encontro: dados.nomeEncontro,
    data: dados.dataEvento,
    inscritos: totalInscritos,
    presentes: totalPresentes,
    faltaram: totalFaltaram,
    taxa: taxa,
    classificacao: classificacao,
  };
}
