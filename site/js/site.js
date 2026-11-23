/* =====================================================================
   BC Fichas — site.js
   Sem bibliotecas e sem rastreadores. A página funciona inteira sem este
   arquivo; ele só acrescenta:
     1. o número do WhatsApp num lugar só (CONTATO);
     2. a prévia das fichas com as mesmas regras do sistema que imprime
        (tamanhos, quebras e cortes), a escolha do modelo, os contadores e
        as setas do carrossel;
     3. o formulário de orçamento, que vira mensagem de WhatsApp
        (o site não envia nem guarda nada: só monta o link e a cópia);
     4. o menu e a barra fixa do celular;
     5. a ampliação de fotos, telas e comprovante.
   ===================================================================== */
(function () {
  "use strict";

  /* Para trocar o número do WhatsApp: mude aqui E no index.html e no 404.html
     (procure por 551930239050; os links de lá valem quando o JavaScript
     não carrega). */
  var CONTATO = {
    whatsapp: "551930239050",
    telefone: "(19) 3023-9050",
    mensagem: "Olá! Vim pelo site do BC Fichas e quero um orçamento para o meu evento."
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var poucoMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function linkZap(texto) {
    return "https://wa.me/" + CONTATO.whatsapp + "?text=" + encodeURIComponent(texto || CONTATO.mensagem);
  }

  /* ---------- 1. Links do WhatsApp ---------- */
  $$("a[data-zap]").forEach(function (a) {
    a.href = linkZap(a.getAttribute("data-zap-texto"));
  });

  /* ---------- 2. Fichas: prévia fiel à impressão ---------- */
  function doisDigitos(n) { return (n < 10 ? "0" : "") + n; }

  function dataDeAgora() {
    var d = new Date();
    var dia = doisDigitos(d.getDate()) + "/" + doisDigitos(d.getMonth() + 1);
    var hora = doisDigitos(d.getHours()) + ":" + doisDigitos(d.getMinutes());
    return {
      curta: dia + " " + hora,
      longa: dia + "/" + d.getFullYear() + " " + hora + ":" + doisDigitos(d.getSeconds())
    };
  }

  var agora = dataDeAgora();
  $$("[data-agora]").forEach(function (el) {
    el.textContent = agora[el.getAttribute("data-agora")] || agora.curta;
  });

  /* As regras abaixo são as do sistema que imprime as fichas (BC Fichas 3.11.7,
     Layout.cs e RenderizadorFicha.cs): ficha de 576 pontos de largura, com a
     moldura padrão e 20 de margem, letra Arial, tamanhos em pontos. Texto que não cabe é cortado com
     "…" no mesmo lugar em que a impressora cortaria, e o site avisa. */
  var LARGURA_UTIL = 576 - 2 * 20; /* com a moldura, que é o padrão do sistema, a margem é de 20 pontos */
  var FAMILIA = 'Arial, "Liberation Sans", "Helvetica Neue", Helvetica, sans-serif'; /* ganha a "Ficha" em ativarLetra() */
  var medidor = document.createElement("canvas").getContext("2d");
  if (medidor && "fontKerning" in medidor) medidor.fontKerning = "none"; /* como a impressora mede */
  var houveCorte = false;

  var larguras = {}; /* largura de cada texto já medido (a 100 pontos); esvazia quando a letra muda */

  function medir(texto, tamanho, negrito) {
    if (!medidor) return texto.length * tamanho * 0.6;
    var chave = (negrito ? "b" : "n") + texto;
    var largura = larguras[chave];
    if (largura === undefined) {
      medidor.font = (negrito ? "700" : "400") + " 100px " + FAMILIA;
      largura = larguras[chave] = medidor.measureText(texto).width;
    }
    return (largura * tamanho) / 100;
  }

  /* Layout.Cortar: tira letras do fim até caber com "…". */
  function cortar(texto, tamanho, negrito, largura) {
    if (medir(texto, tamanho, negrito) <= largura) return texto;
    var t = texto;
    while (t.length > 1 && medir(t + "…", tamanho, negrito) > largura) t = t.slice(0, -1);
    houveCorte = true;
    return t.replace(/\s+$/, "") + "…";
  }

  /* Layout.Quebrar: linhas que cabem na largura; passando do limite, a última leva "…". */
  function quebrar(texto, tamanho, negrito, largura, maxLinhas) {
    var palavras = texto.trim().split(/ +/).filter(Boolean);
    var linhas = [];
    var atual = "";
    palavras.forEach(function (palavra) {
      var tentativa = atual ? atual + " " + palavra : palavra;
      if (medir(tentativa, tamanho, negrito) <= largura) { atual = tentativa; return; }
      if (atual) linhas.push(atual);
      atual = palavra;
      while (medir(atual, tamanho, negrito) > largura && atual.length > 1) {
        var corte = atual.length - 1;
        while (corte > 1 && medir(atual.slice(0, corte), tamanho, negrito) > largura) corte--;
        linhas.push(atual.slice(0, corte));
        atual = atual.slice(corte);
      }
    });
    if (atual) linhas.push(atual);
    if (linhas.length > maxLinhas) {
      var sobra = linhas.slice(maxLinhas - 1).join(" ");
      linhas = linhas.slice(0, maxLinhas - 1);
      linhas.push(cortar(sobra, tamanho, negrito, largura));
    }
    return linhas;
  }

  /* Layout.TextoAjustado: a letra diminui até caber; prefere uma linha, quebra entre palavras se ficaria pequena. */
  function ajustado(texto, maximo, minimo, maxLinhas) {
    texto = texto.split(/ +/).filter(Boolean).join(" ");
    var umaLinha = Math.min(maximo, Math.floor((maximo * LARGURA_UTIL) / Math.max(1, medir(texto, maximo, true))));
    if (maxLinhas <= 1 || umaLinha >= maximo * 0.6 || texto.indexOf(" ") < 0) {
      var unico = Math.max(minimo, umaLinha);
      return { linhas: [cortar(texto, unico, true, LARGURA_UTIL)], tamanho: unico };
    }
    var tamanho = maximo * 0.8;
    var linhas;
    for (;;) {
      linhas = quebrar(texto, tamanho, true, LARGURA_UTIL, Infinity);
      var maior = 0;
      texto.split(" ").forEach(function (palavra) { maior = Math.max(maior, medir(palavra, tamanho, true)); });
      var cabe = linhas.length <= maxLinhas && maior <= LARGURA_UTIL;
      if (cabe || tamanho <= minimo) {
        if (!cabe) linhas = quebrar(texto, tamanho, true, LARGURA_UTIL, maxLinhas);
        break;
      }
      tamanho = Math.max(minimo, tamanho - 2);
    }
    if (tamanho <= umaLinha) {
      linhas = [cortar(texto, umaLinha, true, LARGURA_UTIL)];
      tamanho = Math.max(minimo, umaLinha);
    }
    return { linhas: linhas, tamanho: tamanho };
  }

  /* Só mexe na página quando o texto muda de verdade: redesenhar à toa custa tempo no celular. */
  function escrever(el, texto) {
    if (el && el.textContent !== texto) el.textContent = texto;
  }

  function porLinhas(el, linhas, tamanho) {
    var atuais = el.children;
    var igual = atuais.length === linhas.length && el.childNodes.length === linhas.length;
    for (var i = 0; igual && i < linhas.length; i++) {
      igual = atuais[i].className === "f-l" && atuais[i].textContent === linhas[i];
    }
    if (!igual) {
      el.textContent = "";
      linhas.forEach(function (linha) {
        var s = document.createElement("span");
        s.className = "f-l";
        s.textContent = linha;
        el.appendChild(s);
      });
    }
    if (tamanho != null) {
      var t = String(Math.round(tamanho * 100) / 100);
      if (el.style.getPropertyValue("--t").trim() !== t) el.style.setProperty("--t", t);
    }
  }

  /* Produto: até 124 pontos (104 no modelo compacto), mínimo 40, em até 2 linhas. */
  function aplicarProduto(el, texto) {
    var r = ajustado(texto, Number(el.getAttribute("data-max")) || 124, 40, 2);
    porLinhas(el, r.linhas, r.tamanho);
  }

  /* Nome do evento: cada modelo tem a sua regra (uma linha, duas linhas, ao lado do logotipo ou do número do caixa). */
  function aplicarEvento(el, texto) {
    var t = Number(el.getAttribute("data-t")) || 28;
    var linhas;
    houveCorte = false;
    if (el.hasAttribute("data-coluna")) {
      linhas = [cortar(texto, t, true, LARGURA_UTIL - (Number(el.getAttribute("data-coluna")) + 14))];
    } else if (el.hasAttribute("data-par")) {
      linhas = [cortar(texto, t, true, LARGURA_UTIL - medir(el.getAttribute("data-par"), t, true) - 12)];
    } else {
      linhas = quebrar(texto, t, true, LARGURA_UTIL, Number(el.getAttribute("data-linhas")) || 1);
    }
    porLinhas(el, linhas);
    return houveCorte;
  }

  /* Rodapé do evento: negrito de 22 pontos, em até 2 linhas, do jeito que foi digitado. */
  function aplicarRodape(el, texto) {
    houveCorte = false;
    porLinhas(el, quebrar(texto, 22, true, LARGURA_UTIL, 2));
    return houveCorte;
  }

  function ajustarProdutos() {
    $$(".f-produto").forEach(function (el) { aplicarProduto(el, (el.textContent || "").trim()); });
  }

  function listar(numeros) {
    if (numeros.length < 2) return numeros.join("");
    return numeros.slice(0, -1).join(", ") + " e " + numeros[numeros.length - 1];
  }

  var monte = $("#monte");
  var campoEvento = $("#monte-evento");
  var campoRecado = $("#monte-recado");
  var orcEvento = $("#orc-evento");
  var orcRodape = $("#orc-rodape");
  var orcModelo = $("#orc-modelo");
  var botaoLimpar = $("#orc-limpar");
  var avisoMonte = $("#monte-aviso");
  var itensDoRolo = $$("#rolo .rolo__item");
  var montarMensagem = function () {};

  function contar(campo) {
    var alvo = campo && $("#" + campo.id + "-cont");
    if (!alvo) return;
    var usados = campo.value.length;
    escrever(alvo, usados ? usados + " de " + campo.maxLength + " caracteres" : "até " + campo.maxLength + " caracteres");
  }

  /* Desenha os 7 modelos com o que a pessoa digitou (ou com os exemplos) e avisa onde a impressão corta. */
  function pintar() {
    if (!monte) return;
    var digitouEvento = (campoEvento.value || "").trim();
    var digitouRecado = ((campoRecado && campoRecado.value) || "").trim();
    var evento = (digitouEvento || campoEvento.getAttribute("placeholder") || "FESTA JUNINA").toUpperCase();
    var recado = digitouRecado || (campoRecado && campoRecado.getAttribute("placeholder")) || "";
    var escolhido = $('input[name="produto"]:checked', monte);
    var partes = (escolhido ? escolhido.value : "PASTEL|10,00").split("|");
    var cortamEvento = [];
    var cortaRodape = false;

    itensDoRolo.forEach(function (item) {
      var n = item.getAttribute("data-modelo");
      var cortouEvento = aplicarEvento($("[data-evento]", item), evento);
      var cortouRodape = aplicarRodape($("[data-recado]", item), recado);
      aplicarProduto($("[data-produto]", item), partes[0]);
      $$("[data-valor]", item).forEach(function (el) { escrever(el, "R$ " + partes[1]); });
      if (cortouEvento) cortamEvento.push(n);
      if (cortouRodape) cortaRodape = true;
      var aviso = $("[data-aviso]", item);
      var cortados = [];
      if (cortouEvento) cortados.push("o nome do evento");
      if (cortouRodape) cortados.push("o rodapé");
      if (aviso.hidden !== (cortados.length === 0)) aviso.hidden = cortados.length === 0;
      escrever(aviso, cortados.length
        ? "Neste modelo, " + cortados.join(" e ") + (cortados.length > 1 ? " saem cortados" : " sai cortado") + " na impressão, como aparece acima."
        : "");
    });

    if (avisoMonte) {
      var frases = [];
      if (digitouEvento) {
        frases.push(cortamEvento.length
          ? "O nome sai cortado " + (cortamEvento.length === 1 ? "no modelo " : "nos modelos ") + listar(cortamEvento) + " e inteiro nos demais."
          : "O nome cabe inteiro nos 7 modelos.");
      }
      if (digitouRecado) {
        frases.push(cortaRodape
          ? "O rodapé passa de duas linhas e sai cortado na impressão: encurte a frase."
          : "O rodapé cabe inteiro.");
      }
      escrever(avisoMonte, frases.join(" "));
    }
    contar(campoEvento);
    contar(campoRecado);
  }

  /* Modelo escolhido: um por vez; tocar de novo desfaz a escolha. */
  function escolherModelo(n) {
    n = String(n || "");
    itensDoRolo.forEach(function (item) {
      var sim = item.getAttribute("data-modelo") === n;
      var botao = $(".rolo__escolher", item);
      item.classList.toggle("escolhido", sim);
      if (botao) {
        botao.setAttribute("aria-pressed", sim ? "true" : "false");
        escrever(botao, sim ? "Escolhido" : "Escolher");
      }
    });
    if (orcModelo) orcModelo.value = n;
  }

  /* O que a pessoa escreve no teste das fichas e no pedido de orçamento é a mesma informação:
     mudar num lugar muda no outro. Os exemplos (placeholders) nunca viram escolha. */
  function atualizar(origem) {
    if (origem === campoEvento && orcEvento) orcEvento.value = campoEvento.value;
    if (origem === orcEvento && campoEvento) campoEvento.value = orcEvento.value;
    if (origem === campoRecado && orcRodape) orcRodape.value = campoRecado.value;
    if (origem === orcRodape && campoRecado) campoRecado.value = orcRodape.value;
    if (origem === orcModelo) escolherModelo(orcModelo.value);
    pintar();
    montarMensagem();
    if (botaoLimpar) {
      botaoLimpar.hidden = !((orcEvento && orcEvento.value) || (orcRodape && orcRodape.value) || (orcModelo && orcModelo.value));
    }
  }

  if (monte) {
    monte.addEventListener("input", function (e) { atualizar(e.target); });
    monte.addEventListener("change", function (e) { atualizar(e.target); });
    [campoEvento, campoRecado].forEach(function (campo) {
      if (campo) campo.addEventListener("keydown", function (e) { if (e.key === "Enter") campo.blur(); });
    });
    itensDoRolo.forEach(function (item) {
      var botao = $(".rolo__escolher", item);
      if (!botao) return;
      botao.hidden = false;
      botao.addEventListener("click", function () {
        var n = item.getAttribute("data-modelo");
        escolherModelo(botao.getAttribute("aria-pressed") === "true" ? "" : n);
        atualizar(null);
      });
    });
    if (botaoLimpar) {
      botaoLimpar.addEventListener("click", function () {
        [campoEvento, campoRecado, orcEvento, orcRodape].forEach(function (c) { if (c) c.value = ""; });
        escolherModelo("");
        atualizar(null);
        if (orcEvento) orcEvento.focus();
      });
    }
  }

  /* A letra das fichas (Arimo, para quem não tem Arial) só entra depois que a página
     carregou, para não atrasar a foto da abertura. Quando ela chega, mede e desenha de novo. */
  function redesenhar() { larguras = {}; ajustarProdutos(); pintar(); }
  function ativarLetra() {
    document.documentElement.classList.add("com-letra-ficha");
    FAMILIA = '"Ficha", ' + FAMILIA;
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load('700 28px "Ficha"'), document.fonts.load('400 22px "Ficha"')]).then(redesenhar, redesenhar);
    } else {
      redesenhar();
    }
  }
  redesenhar();
  if (document.readyState === "complete") ativarLetra();
  else window.addEventListener("load", ativarLetra);

  /* setas do carrossel: andam uma "tela" de modelos por vez */
  var rolo = $("#rolo");
  var setas = $$(".rolo__seta");
  if (rolo && setas.length) {
    var passoDoRolo = function () {
      var itens = $$(".rolo__item", rolo);
      if (itens.length < 2) return rolo.clientWidth;
      return itens[1].getBoundingClientRect().left - itens[0].getBoundingClientRect().left;
    };
    var atualizarSetas = function () {
      var fim = rolo.scrollWidth - rolo.clientWidth - 2;
      setas.forEach(function (b) {
        var parado = Number(b.getAttribute("data-rolo")) < 0 ? rolo.scrollLeft <= 2 : rolo.scrollLeft >= fim;
        b.setAttribute("aria-disabled", parado ? "true" : "false");
      });
    };
    setas.forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("aria-disabled") === "true") return;
        var passo = passoDoRolo();
        var porTela = Math.max(1, Math.floor(rolo.clientWidth / passo));
        rolo.scrollBy({ left: Number(b.getAttribute("data-rolo")) * passo * porTela, behavior: poucoMovimento ? "auto" : "smooth" });
      });
    });
    var esperando = false;
    rolo.addEventListener("scroll", function () {
      if (esperando) return;
      esperando = true;
      requestAnimationFrame(function () { esperando = false; atualizarSetas(); });
    }, { passive: true });
    window.addEventListener("resize", atualizarSetas);
    atualizarSetas();
  }

  /* ---------- 3. Orçamento pelo WhatsApp ---------- */
  var orc = $("#orc");
  var enviar = $("#orc-enviar");
  if (orc && enviar) {
    var copiar = $("#orc-copiar");
    var aviso = $("#orc-status");
    var mensagemAtual = CONTATO.mensagem;

    var valor = function (nome) {
      var el = orc.elements[nome];
      return el ? String(el.value || "").trim() : "";
    };

    /* Só entram na mensagem os campos que a pessoa preencheu.
       O produto de exemplo das fichas nunca entra: é só demonstração. */
    montarMensagem = function () {
      var linhas = [];
      if (valor("nome")) linhas.push("Nome: " + valor("nome"));
      if (valor("data")) linhas.push("Data ou período: " + valor("data"));
      if (valor("cidade")) linhas.push("Cidade: " + valor("cidade"));
      if (valor("maquinas")) linhas.push("Máquinas: " + valor("maquinas"));
      if (valor("evento")) linhas.push("Nome do evento nas fichas: " + valor("evento").toUpperCase()); /* o sistema grava em maiúsculas */
      if (valor("rodape")) linhas.push("Rodapé das fichas: " + valor("rodape"));
      if (valor("modelo")) linhas.push("Modelo de ficha: Modelo " + valor("modelo"));
      if (valor("obs")) linhas.push("Observações: " + valor("obs"));
      mensagemAtual = CONTATO.mensagem + (linhas.length ? "\n\n" + linhas.join("\n") : "");
      enviar.href = linkZap(mensagemAtual);
      if (aviso) aviso.textContent = "";
    };

    orc.addEventListener("input", function (e) { atualizar(e.target); });
    orc.addEventListener("change", function (e) { atualizar(e.target); });
    orc.addEventListener("submit", function (e) { e.preventDefault(); });
    /* Enter num campo leva ao botão de enviar (não abre o WhatsApp sozinho). */
    orc.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); enviar.focus(); }
    });
    if (botaoLimpar && !monte) botaoLimpar.hidden = true;
    atualizar(null);

    /* alternativa ao WhatsApp: copiar a mensagem para colar onde quiser */
    if (copiar && aviso) {
      copiar.hidden = false;
      var copiou = function () { aviso.textContent = "Mensagem copiada. Cole no WhatsApp ou onde preferir."; };
      var copiarPeloCampo = function () {
        var campo = document.createElement("textarea");
        campo.value = mensagemAtual;
        campo.setAttribute("readonly", "");
        campo.style.cssText = "position:fixed;left:0;top:0;opacity:0";
        document.body.appendChild(campo);
        campo.select();
        var deu = false;
        try { deu = document.execCommand("copy"); } catch (erro) { deu = false; }
        document.body.removeChild(campo);
        if (deu) copiou();
        else aviso.textContent = "Não deu para copiar neste aparelho. Use o botão do WhatsApp ou ligue para " + CONTATO.telefone + ".";
        copiar.focus();
      };
      copiar.addEventListener("click", function () {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(mensagemAtual).then(copiou, copiarPeloCampo);
        } else {
          copiarPeloCampo();
        }
      });
    }
  }

  /* ---------- 4. Menu e barra fixa do celular ---------- */
  var menu = $(".menu");
  if (menu) {
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) menu.removeAttribute("open");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.open) { menu.removeAttribute("open"); $("summary", menu).focus(); }
    });
    document.addEventListener("click", function (e) {
      if (menu.open && !menu.contains(e.target)) menu.removeAttribute("open");
    });
  }

  /* A barra some enquanto já existe um botão de orçamento na tela (o do início
     e a seção de orçamento) e enquanto a pessoa digita, para não cobrir o campo
     nem disputar espaço com o teclado do celular. */
  var barra = $("#barra");
  if (barra) {
    var visiveis = new Set();
    var digitando = false;
    var atualizarBarra = function () {
      barra.classList.toggle("barra--fora", visiveis.size > 0 || digitando);
    };
    if ("IntersectionObserver" in window) {
      var olho = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target);
        });
        atualizarBarra();
      }, { threshold: 0.05 });
      [$(".heroi .acoes"), $("#orcamento")].filter(Boolean).forEach(function (a) { olho.observe(a); });
    }
    document.addEventListener("focusin", function (e) {
      var el = e.target;
      digitando = (el.tagName === "INPUT" && el.type !== "radio") || el.tagName === "TEXTAREA" || el.tagName === "SELECT";
      atualizarBarra();
    });
    document.addEventListener("focusout", function () { digitando = false; atualizarBarra(); });
  }

  /* ---------- 5. Ampliação de fotos, telas e comprovante ---------- */
  /* Sem JavaScript (ou sem <dialog>), o link abre a imagem direto. */
  var amplia = $("#amplia");
  if (amplia && typeof amplia.showModal === "function") {
    var grande = $("#amplia-img");
    var legenda = $("#amplia-legenda");
    document.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a[data-amplia]") : null;
      if (!link || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      var pequena = $("img", link);
      amplia.classList.remove("amplia--alta");
      grande.onload = function () { amplia.classList.toggle("amplia--alta", grande.naturalHeight > grande.naturalWidth * 1.5); };
      grande.alt = pequena ? pequena.alt : "";
      grande.src = link.href;
      legenda.textContent = link.getAttribute("data-legenda") || "";
      amplia.showModal(); /* ao fechar, o navegador devolve o foco ao link que abriu */
    });
    /* toque fora da imagem (no fundo escuro) fecha */
    amplia.addEventListener("click", function (e) { if (e.target === amplia) amplia.close(); });
  }

  /* ---------- 6. Detalhes ---------- */
  /* marcadores da foto: destacam junto com o item da lista */
  $$(".anatomia__lista li[data-marco]").forEach(function (li) {
    var marco = $('.anatomia__foto .marco[data-marco="' + li.getAttribute("data-marco") + '"]');
    if (!marco) return;
    li.addEventListener("pointerenter", function () { marco.classList.add("ativo"); });
    li.addEventListener("pointerleave", function () { marco.classList.remove("ativo"); });
  });

  $$("[data-ano]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
