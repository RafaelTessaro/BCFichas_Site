/* =====================================================================
   BC Fichas — site.js
   Sem bibliotecas e sem rastreadores. A página funciona inteira sem este
   arquivo; ele só acrescenta:
     1. o número do WhatsApp num lugar só (CONTATO);
     2. as fichas de exemplo com o nome do evento e a data de agora;
     3. o formulário de orçamento, que vira mensagem de WhatsApp;
     4. a barra fixa do celular e o menu.
   ===================================================================== */
(function () {
  "use strict";

  /* Para trocar o número do WhatsApp: mude aqui E no index.html
     (procure por 551930239050; os links de lá valem quando o JavaScript
     não carrega). */
  var CONTATO = {
    whatsapp: "551930239050",
    mensagem: "Olá! Vim pelo site do BC Fichas e quero um orçamento para o meu evento."
  };

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

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
    var padrao = campoEvento.getAttribute("placeholder") || "FESTA JUNINA";

    var pintar = function () {
      var evento = (campoEvento.value || "").trim().toUpperCase() || padrao;
      var escolhido = $('input[name="produto"]:checked', monte);
      var partes = (escolhido ? escolhido.value : "PASTEL|10,00").split("|");
      $$("#rolo [data-evento]").forEach(function (el) { el.textContent = evento; });
      $$("#rolo [data-valor]").forEach(function (el) { el.textContent = "R$ " + partes[1]; });
      $$("#rolo [data-produto]").forEach(function (el) { el.textContent = partes[0]; ajustarProduto(el); });
    };

    monte.addEventListener("input", pintar);
    monte.addEventListener("change", pintar);
    campoEvento.addEventListener("keydown", function (e) { if (e.key === "Enter") campoEvento.blur(); });
  }

  /* ---------- 3. Orçamento pelo WhatsApp ---------- */
  var orc = $("#orc");
  var enviar = $("#orc-enviar");
  if (orc && enviar) {
    var valor = function (nome) {
      var el = orc.elements[nome];
      return el ? String(el.value || "").trim() : "";
    };

    var montarMensagem = function () {
      var linhas = [];
      if (valor("nome")) linhas.push("Nome: " + valor("nome"));
      if (valor("tipo")) linhas.push("Evento: " + valor("tipo"));
      if (valor("data")) linhas.push("Data: " + valor("data"));
      if (valor("cidade")) linhas.push("Cidade: " + valor("cidade"));
      if (valor("caixas")) linhas.push("Caixas: " + valor("caixas"));
      if (valor("obs")) linhas.push("Observações: " + valor("obs"));
      var texto = CONTATO.mensagem;
      if (linhas.length) texto += "\n\n" + linhas.join("\n");
      enviar.href = linkZap(texto);
    };

    orc.addEventListener("input", montarMensagem);
    orc.addEventListener("change", montarMensagem);
    orc.addEventListener("submit", function (e) { e.preventDefault(); });
    orc.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && e.target.tagName === "INPUT") { e.preventDefault(); enviar.focus(); }
    });
    montarMensagem();
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

  /* A barra some enquanto já existe um botão de orçamento na tela
     (o do início e a seção de orçamento). */
  var barra = $("#barra");
  if (barra && "IntersectionObserver" in window) {
    var visiveis = new Set();
    var alvos = [$(".heroi .acoes"), $("#orcamento")].filter(Boolean);
    var olho = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) visiveis.add(en.target); else visiveis.delete(en.target);
      });
      barra.classList.toggle("barra--fora", visiveis.size > 0);
    }, { threshold: 0.05 });
    alvos.forEach(function (a) { olho.observe(a); });
  }

  /* ---------- 5. Detalhes ---------- */
  /* marcadores da foto: destacam junto com o item da lista */
  $$(".anatomia__lista li[data-marco]").forEach(function (li) {
    var marco = $('.anatomia__foto .marco[data-marco="' + li.getAttribute("data-marco") + '"]');
    if (!marco) return;
    li.addEventListener("pointerenter", function () { marco.classList.add("ativo"); });
    li.addEventListener("pointerleave", function () { marco.classList.remove("ativo"); });
  });

  $$("[data-ano]").forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
})();
