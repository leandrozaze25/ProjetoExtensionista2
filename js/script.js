
let acertos = Number(localStorage.getItem("acertos")) || 0;
let erros = Number(localStorage.getItem("erros")) || 0;

let audioNarracao = null;
let audioObjeto = null;
let repetidorSom = null;


// FUNÇÕES GERAIS

function embaralhar(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function pararNarracao() {
  if (audioNarracao) {
    audioNarracao.pause();
    audioNarracao.currentTime = 0;
  }
}

function pararSomObjeto() {
  if (repetidorSom) {
    clearInterval(repetidorSom);
    repetidorSom = null;
  }

  if (audioObjeto) {
    audioObjeto.pause();
    audioObjeto.currentTime = 0;
  }
}

function tocarNarracao(nomeArquivo) {
  if (window.speechSynthesis) {
    speechSynthesis.cancel();
  }

  pararNarracao();

  audioNarracao = new Audio("audios/" + nomeArquivo);
  audioNarracao.play().catch(() => {});
}

function tocarSomObjetoRepetindo(caminho) {
  pararSomObjeto();

  audioObjeto = new Audio(caminho);
  audioObjeto.loop = false;
  audioObjeto.play().catch(() => {});

  repetidorSom = setInterval(() => {
    if (audioObjeto) {
      audioObjeto.currentTime = 0;
      audioObjeto.play().catch(() => {});
    }
  }, 5000);
}


function irPara(pagina) {
  pararSomObjeto();
  pararNarracao();
  window.location.href = pagina;
}

function salvarPontuacao() {
  localStorage.setItem("acertos", acertos);
  localStorage.setItem("erros", erros);
}

function registrarAcerto() {
  acertos++;
  salvarPontuacao();
}

function registrarErro() {
  erros++;
  salvarPontuacao();
}

function comecarCircuito() {
  localStorage.setItem("acertos", 0);
  localStorage.setItem("erros", 0);
  irPara("memoria.html");
}

function reiniciarCircuito() {
  localStorage.setItem("acertos", 0);
  localStorage.setItem("erros", 0);
  irPara("index.html");
}

function telaInicial() {
  tocarNarracao("Bem_Vindo.mp3");
}


// JOGO 1 

let primeiraCarta = null;
let segundaCarta = null;
let bloqueado = false;
let paresEncontrados = 0;

const imagensMemoria = [
  { nome: "Banana", imagem: "imagens/Banana.png" },
  { nome: "Cachorro", imagem: "imagens/Cachorro.png" },
  { nome: "Carro", imagem: "imagens/Carro.png" },
  { nome: "Casa", imagem: "imagens/Casa.png" },
  { nome: "Girassol", imagem: "imagens/Girassol.png" },
  { nome: "Maçã", imagem: "imagens/Maça.png" }
];

function repetirInstrucaoMemoria() {
  tocarNarracao("Jogo_Memoria.mp3");
}

function iniciarMemoria() {
  primeiraCarta = null;
  segundaCarta = null;
  bloqueado = false;
  paresEncontrados = 0;

  repetirInstrucaoMemoria();

  const cartas = embaralhar([...imagensMemoria, ...imagensMemoria]);
  const tabuleiro = document.getElementById("tabuleiro");

  if (!tabuleiro) return;

  tabuleiro.innerHTML = "";
  document.getElementById("paresEncontrados").innerText = "0";

  cartas.forEach((item, indice) => {
    const carta = document.createElement("button");

    carta.className = "carta";
    carta.dataset.nome = item.nome;
    carta.dataset.imagem = item.imagem;
    carta.dataset.virada = "false";
    carta.setAttribute("aria-label", "Carta " + (indice + 1));

    mostrarFrenteCarta(carta);

    carta.onclick = () => virarCarta(carta);
    tabuleiro.appendChild(carta);
  });
}

function mostrarFrenteCarta(carta) {
  carta.innerHTML = `
    <div class="conteudo-carta">
      <img src="imagens/Logo.png" class="logo-carta" alt="Logo Mente Ativa">
    </div>
  `;
}

function mostrarVersoCarta(carta) {
  carta.innerHTML = `
    <div class="conteudo-carta">
      <img src="${carta.dataset.imagem}" class="imagem-carta" alt="${carta.dataset.nome}">
      <div class="nome-carta">${carta.dataset.nome}</div>
    </div>
  `;
}

function virarCarta(carta) {
  if (bloqueado) return;
  if (carta.dataset.virada === "true") return;

  mostrarVersoCarta(carta);
  carta.dataset.virada = "true";

  if (!primeiraCarta) {
    primeiraCarta = carta;
    return;
  }

  segundaCarta = carta;
  bloqueado = true;

  if (primeiraCarta.dataset.nome === segundaCarta.dataset.nome) {
    registrarAcerto();
    paresEncontrados++;

    primeiraCarta.classList.add("encontrada");
    segundaCarta.classList.add("encontrada");

    document.getElementById("paresEncontrados").innerText = paresEncontrados;

    tocarNarracao("Confirmacao_Acerto.mp3");

    primeiraCarta = null;
    segundaCarta = null;
    bloqueado = false;

    if (paresEncontrados === 6) {
      setTimeout(() => {
        tocarNarracao("Encerrar_Jogo_Memoria.mp3");

        const botaoProximo = document.getElementById("proximoMemoria");
        if (botaoProximo) {
          botaoProximo.classList.remove("escondido");
        }
      }, 3000);
    }

  } else {
    registrarErro();
    tocarNarracao("Confirmacao_Erro.mp3");

    setTimeout(() => {
      mostrarFrenteCarta(primeiraCarta);
      mostrarFrenteCarta(segundaCarta);

      primeiraCarta.dataset.virada = "false";
      segundaCarta.dataset.virada = "false";

      primeiraCarta = null;
      segundaCarta = null;
      bloqueado = false;
    }, 1200);
  }
}

// JOGO 2 

const objetosSons = [
  {
    nome: "Telefone",
    imagem: "imagens/Telefone.png",
    audio: "audios/telefone.mp3"
  },
  {
    nome: "Radio",
    imagem: "imagens/Radio.png",
    audio: "audios/radio.mp3"
  },
  {
    nome: "Sino",
    imagem: "imagens/Sino.png",
    audio: "audios/sino.mp3"
  },
  {
    nome: "Trem",
    imagem: "imagens/Trem.png",
    audio: "audios/trem.mp3"
  },
  {
    nome: "Galo",
    imagem: "imagens/Galo.png",
    audio: "audios/galo.mp3"
  },
  {
    nome: "Gato",
    imagem: "imagens/Gato.png",
    audio: "audios/gato.mp3"
  }
];

let rodadaSons = 0;
let rodadasSelecionadas = [];
let objetoSomAtual = null;
const totalRodadasSons = 5;

function iniciarSons() {
  rodadaSons = 0;
  rodadasSelecionadas = embaralhar(objetosSons).slice(0, totalRodadasSons);

  tocarNarracao("Atividade_de_Sons.mp3");

  if (audioNarracao) {
  audioNarracao.onended = function () {
    mostrarPerguntaSons();
    };
  }
}

function repetirPerguntaSons() {
  if (!objetoSomAtual) return;

  pararSomObjeto();

  setTimeout(() => {
  tocarNarracao("Pergunta_qual_sons.mp3");
  }, 1000);

  setTimeout(() => {
    tocarSomObjetoRepetindo(objetoSomAtual.audio);
  }, 2000);
}

function montarOpcoesSons(correta) {
  const erradas = objetosSons.filter(obj => obj.nome !== correta.nome);
  const opcoesErradas = embaralhar(erradas).slice(0, 3);

  return embaralhar([correta, ...opcoesErradas]);
}

function mostrarPerguntaSons() {
  pararSomObjeto();

  if (rodadaSons >= totalRodadasSons) {
    tocarNarracao("Fim_sons.mp3");

    setTimeout(() => {
      irPara("troco.html");
    }, 4500);

    return;
  }

  objetoSomAtual = rodadasSelecionadas[rodadaSons];

  const numeroSons = document.getElementById("numeroSons");
  const perguntaSons = document.getElementById("perguntaSons");
  const areaOpcoes = document.getElementById("opcoesSons");

  if (!numeroSons || !perguntaSons || !areaOpcoes) return;

  numeroSons.innerText =
    "Rodada " + (rodadaSons + 1) + " de " + totalRodadasSons;

  perguntaSons.innerText = "Qual objeto produziu este som?";
  areaOpcoes.innerHTML = "";

  const opcoes = montarOpcoesSons(objetoSomAtual);

  opcoes.forEach((opcao) => {
    const botao = document.createElement("button");

    botao.className = "opcao";
    botao.innerHTML = `
      <div class="opcao-imagem">
        <img src="${opcao.imagem}" class="imagem-opcao" alt="${opcao.nome}">
        <div class="nome-opcao">${opcao.nome}</div>
      </div>
    `;

    botao.onclick = () => responderSons(botao, opcao.nome);

    areaOpcoes.appendChild(botao);
  });

  repetirPerguntaSons();
}

function responderSons(botao, resposta) {
  pararSomObjeto();

  const botoes = document.querySelectorAll(".opcao");

  botoes.forEach(b => b.disabled = true);

  if (resposta === objetoSomAtual.nome) {
    registrarAcerto();
    botao.classList.add("correta");
    tocarNarracao("Confirmacao_Acerto.mp3");
  } else {
    registrarErro();
    botao.classList.add("errada");

    botoes.forEach(b => {
      if (b.innerText.includes(objetoSomAtual.nome)) {
        b.classList.add("correta");
      }
    });

    tocarNarracao("Confirmacao_Erro.mp3");
  }

  rodadaSons++;

  setTimeout(() => {
    mostrarPerguntaSons();
  }, 2600);
}


// JOGO 3 

const perguntasTroco = [
  {
    produto: "Pão",
    imagemProduto: "imagens/Pao.png",
    preco: "R$ 4,00",
    valorPago: "R$ 10,00",
    imagemNota: "imagens/Nota10.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_01.mp3",
    opcoes: ["R$ 4", "R$ 5", "R$ 6", "R$ 7"],
    correta: "R$ 6"
  },
  {
    produto: "Leite",
    imagemProduto: "imagens/Leite.png",
    preco: "R$ 6,00",
    valorPago: "R$ 10,00",
    imagemNota: "imagens/Nota10.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_02.mp3",
    opcoes: ["R$ 2", "R$ 3", "R$ 4", "R$ 5"],
    correta: "R$ 4"
  },
  {
    produto: "Banana",
    imagemProduto: "imagens/BananaTroco.png",
    preco: "R$ 5,00",
    valorPago: "R$ 10,00",
    imagemNota: "imagens/Nota10.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_03.mp3",
    opcoes: ["R$ 3", "R$ 4", "R$ 5", "R$ 6"],
    correta: "R$ 5"
  },
  {
    produto: "Café",
    imagemProduto: "imagens/Cafe.png",
    preco: "R$ 8,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_04.mp3",
    opcoes: ["R$ 10", "R$ 11", "R$ 12", "R$ 13"],
    correta: "R$ 12"
  },
  {
    produto: "Arroz",
    imagemProduto: "imagens/Arroz.png",
    preco: "R$ 15,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_05.mp3",
    opcoes: ["R$ 3", "R$ 4", "R$ 5", "R$ 6"],
    correta: "R$ 5"
  },
  {
    produto: "Ovos",
    imagemProduto: "imagens/Ovos.png",
    preco: "R$ 12,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_06.mp3",
    opcoes: ["R$ 6", "R$ 7", "R$ 8", "R$ 9"],
    correta: "R$ 8"
  },
  {
    produto: "Frango",
    imagemProduto: "imagens/Frango.png",
    preco: "R$ 18,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_07.mp3",
    opcoes: ["R$ 1", "R$ 2", "R$ 3", "R$ 4"],
    correta: "R$ 2"
  },
  {
    produto: "Açúcar",
    imagemProduto: "imagens/Acucar.png",
    preco: "R$ 7,00",
    valorPago: "R$ 10,00",
    imagemNota: "imagens/Nota10.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_08.mp3",
    opcoes: ["R$ 2", "R$ 3", "R$ 4", "R$ 5"],
    correta: "R$ 3"
  },
  {
    produto: "Macarrão",
    imagemProduto: "imagens/Macarrao.png",
    preco: "R$ 9,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_09.mp3",
    opcoes: ["R$ 9", "R$ 10", "R$ 11", "R$ 12"],
    correta: "R$ 11"
  },
  {
    produto: "Óleo",
    imagemProduto: "imagens/Oleo.png",
    preco: "R$ 13,00",
    valorPago: "R$ 20,00",
    imagemNota: "imagens/Nota20.png",
    pergunta: "Quanto você deve receber de troco?",
    audio: "audios/Pergunta_Troco_10.mp3",
    opcoes: ["R$ 5", "R$ 6", "R$ 7", "R$ 8"],
    correta: "R$ 7"
  }
];

let perguntasTrocoSelecionadas = [];
let indiceTroco = 0;
let respostasTroco = [];
const totalRodadasTroco = 5;

function iniciarTroco() {
  indiceTroco = 0;
  respostasTroco = [];

  perguntasTrocoSelecionadas = embaralhar(perguntasTroco).slice(0, totalRodadasTroco);
  localStorage.removeItem("respostasTroco");

  tocarNarracao("Atividade_Jogo_do_Troco.mp3");

  if (audioNarracao) {
    audioNarracao.onended = function () {
      mostrarPerguntaTroco();
    };
  }
}

function repetirPerguntaTroco() {
  const atual = perguntasTrocoSelecionadas[indiceTroco];

  if (atual) {
    tocarAudioPerguntaTroco(atual.audio);
  }
}

function tocarAudioPerguntaTroco(caminho) {
  if (audioNarracao) {
    audioNarracao.pause();
    audioNarracao.currentTime = 0;
  }

  audioNarracao = new Audio(caminho);

  audioNarracao.play().catch((erro) => {
    console.log("Erro ao tocar áudio:", caminho, erro);
  });
}

function mostrarPerguntaTroco() {
  const atual = perguntasTrocoSelecionadas[indiceTroco];

  if (!atual) {
    localStorage.setItem("respostasTroco", JSON.stringify(respostasTroco));

    tocarNarracao("Fim_Troco.mp3");

    if (audioNarracao) {
      audioNarracao.onended = function () {
        irPara("resultado.html");
      };
    }

    return;
  }

  document.getElementById("numeroTroco").innerText =
    "Rodada " + (indiceTroco + 1) + " de " + totalRodadasTroco;

  document.getElementById("imagemProdutoTroco").src = atual.imagemProduto;
  document.getElementById("imagemProdutoTroco").alt = atual.produto;

  document.getElementById("nomeProdutoTroco").innerText = atual.produto;
  document.getElementById("precoProdutoTroco").innerText = atual.preco;

  document.getElementById("imagemNotaTroco").src = atual.imagemNota;
  document.getElementById("imagemNotaTroco").alt = atual.valorPago;

  document.getElementById("valorPagoTroco").innerText = atual.valorPago;
  document.getElementById("perguntaTroco").innerText = atual.pergunta;

  const areaOpcoes = document.getElementById("opcoesTroco");
  areaOpcoes.innerHTML = "";

  const opcoesEmbaralhadas = embaralhar(atual.opcoes);

  opcoesEmbaralhadas.forEach((opcao) => {
    const botao = document.createElement("button");

    botao.className = "opcao";
    botao.innerText = opcao;

    botao.onclick = () => responderTroco(botao, opcao);

    areaOpcoes.appendChild(botao);
  });

  tocarAudioPerguntaTroco(atual.audio);
}

function responderTroco(botao, resposta) {
  const atual = perguntasTrocoSelecionadas[indiceTroco];
  const acertou = resposta === atual.correta;

  if (acertou) {
    registrarAcerto();
  } else {
    registrarErro();
  }

  respostasTroco.push({
    numero: indiceTroco + 1,
    produto: atual.produto,
    preco: atual.preco,
    valorPago: atual.valorPago,
    respostaUsuario: resposta,
    respostaCorreta: atual.correta,
    acertou: acertou
  });

  const botoes = document.querySelectorAll(".opcao");
  botoes.forEach(b => b.disabled = true);

  indiceTroco++;

  setTimeout(mostrarPerguntaTroco, 600);
}

// RESULTADO FINAL

function mostrarResultado() {
  const totalAcertos = Number(localStorage.getItem("acertos")) || 0;
  const totalErros = Number(localStorage.getItem("erros")) || 0;
  const total = totalAcertos + totalErros;
  const porcentagem = total > 0 ? Math.round((totalAcertos / total) * 100) : 0;

  document.getElementById("totalAcertos").innerText = totalAcertos;
  document.getElementById("totalErros").innerText = totalErros;
  document.getElementById("pontuacao").innerText = porcentagem + "%";

  const mensagemFinal = document.getElementById("mensagemFinal");

  if (mensagemFinal) {
    if (porcentagem >= 80) {
      mensagemFinal.innerText = "Excelente desempenho. Você foi muito bem!";
    } else if (porcentagem >= 50) {
      mensagemFinal.innerText = "Bom desempenho. Continue praticando!";
    } else {
      mensagemFinal.innerText = "Você concluiu o circuito. Vamos praticar novamente depois!";
    }
  }

  tocarNarracao("Finalizacao_do_Circuito.mp3");
}