/* =====================================================================
   BC Fichas — site.js
   Sem bibliotecas e sem rastreadores. A página funciona inteira sem este
   arquivo; ele só acrescenta:
     1. o número do WhatsApp num lugar só (CONTATO);
     2. as fichas de exemplo com o nome do evento, o rodapé e a data de agora,
        os contadores de letras e as setas do carrossel dos 7 modelos;
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

  /* ---------- 2. Fichas de exemplo ---------- */
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

  /* O nome do produto ocupa a largura da ficha, como na impressão. */
  var medidor = document.createElement("canvas").getContext("2d");

  function ajustarProduto(el) {
    var texto = (el.textContent || "").trim();
    if (!texto || !medidor) return;
    medidor.font = "700 100px " + getComputedStyle(el).fontFamily;
    var largura = medidor.measureText(texto).width || 1;
    var tam = Math.min(23, (90 * 100) / largura);
    el.style.setProperty("--tam", tam.toFixed(2));
  }

  function ajustarTodos() { $$(".f-produto").forEach(ajustarProduto); }
  ajustarTodos();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarTodos);

  var monte = $("#monte");
  if (monte) {
    var campoEvento = $("#monte-evento");
    var campoRecado = $("#monte-recado");
    var padrao = campoEvento.getAttribute("placeholder") || "FESTA JUNINA";
    var recadoPadrao = (campoRecado && campoRecado.getAttribute("placeholder")) || "";

    /* contador de letras: o limite é o mesmo do sistema (40 no nome, 80 no rodapé) */
    var contar = function (campo) {
      var alvo = campo && $("#" + campo.id + "-cont");
      if (!alvo) return;
      var limite = campo.maxLength;
      var usadas = campo.value.length;
      alvo.textContent = usadas ? usadas + " de " + limite + " letras" : "até " + limite + " letras";
    };

    var pintar = function () {
      var evento = (campoEvento.value || "").trim().toUpperCase() || padrao;
      var escolhido = $('input[name="produto"]:checked', monte);
      var partes = (escolhido ? escolhido.value : "PASTEL|10,00").split("|");
      var recado = ((campoRecado && campoRecado.value) || "").trim().toUpperCase() || recadoPadrao;
      $$("#rolo [data-evento]").forEach(function (el) { el.textContent = evento; });
      $$("#rolo [data-recado]").forEach(function (el) { el.textContent = recado; });
      $$("#rolo [data-valor]").forEach(function (el) { el.textContent = "R$ " + partes[1]; });
      $$("#rolo [data-produto]").forEach(function (el) { el.textContent = partes[0]; ajustarProduto(el); });
      contar(campoEvento);
      contar(campoRecado);
    };

    monte.addEventListener("input", pintar);
    monte.addEventListener("change", pintar);
    [campoEvento, campoRecado].forEach(function (campo) {
      if (campo) campo.addEventListener("keydown", function (e) { if (e.key === "Enter") campo.blur(); });
    });
  }

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

    /* Só entram na mensagem os campos que a pessoa preencheu. */
    var montarMensagem = function () {
      var linhas = [];
      if (valor("nome")) linhas.push("Nome: " + valor("nome"));
      if (valor("tipo")) linhas.push("Evento: " + valor("tipo"));
      if (valor("data")) linhas.push("Data ou período: " + valor("data"));
      if (valor("cidade")) linhas.push("Cidade: " + valor("cidade"));
      if (valor("publico")) linhas.push("Público estimado: " + valor("publico"));
      if (valor("maquinas")) linhas.push("Máquinas: " + valor("maquinas"));
      if (valor("obs")) linhas.push("Observações: " + valor("obs"));
      mensagemAtual = CONTATO.mensagem + (linhas.length ? "\n\n" + linhas.join("\n") : "");
      enviar.href = linkZap(mensagemAtual);
      if (aviso) aviso.textContent = "";
    };

    orc.addEventListener("input", montarMensagem);
    orc.addEventListener("change", montarMensagem);
    orc.addEventListener("submit", function (e) { e.preventDefault(); });
    /* Enter num campo leva ao botão de enviar (não abre o WhatsApp sozinho). */
    orc.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); enviar.focus(); }
    });
    montarMensagem();

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
