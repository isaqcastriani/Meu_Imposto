/* =========================================================================
   Landing page — interacoes e animacoes
   - Header on-scroll, menu mobile, smooth scroll
   - Reveal no scroll (IntersectionObserver)
   - Counters animados + anel de teto
   - Glow seguindo o mouse (pilares)
   - Carrossel arrastavel (recursos / depoimentos)
   - FAQ accordion
   - Back to top + ano no footer
   - Respeita prefers-reduced-motion
   ========================================================================= */
(function () {
  "use strict";
  var reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header ao rolar ---- */
  var header = document.querySelector(".lp-header");
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 12); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var burger = document.querySelector(".lp-burger");
  var mobile = document.querySelector(".lp-mobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () { mobile.classList.toggle("aberto"); });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobile.classList.remove("aberto"); });
    });
  }

  /* ---- Smooth scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var alvo = document.querySelector(a.getAttribute("href"));
      if (!alvo) return;
      e.preventDefault();
      alvo.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---- Reveal no scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (reduzir || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("visivel"); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Counters ---- */
  function animarNumero(el) {
    var alvo = parseFloat(el.getAttribute("data-num"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var pre = el.getAttribute("data-pre") || "";
    var suf = el.getAttribute("data-suf") || "";
    function fmt(v) { return v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
    if (reduzir) { el.textContent = pre + fmt(alvo) + suf; return; }
    var ini = performance.now(), dur = 1500;
    (function tick(now) {
      var p = Math.min((now - ini) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(alvo * e) + suf;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = pre + fmt(alvo) + suf;
    })(ini);
  }
  var contadores = document.querySelectorAll("[data-num]");
  if (!("IntersectionObserver" in window)) { contadores.forEach(animarNumero); }
  else {
    var ioN = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { animarNumero(en.target); ioN.unobserve(en.target); } });
    }, { threshold: 0.6 });
    contadores.forEach(function (el) { ioN.observe(el); });
  }

  /* ---- Anel de teto ---- */
  var ring = document.querySelector(".teto-ring");
  if (ring) {
    var pctAlvo = parseFloat(ring.getAttribute("data-pct") || "0");
    function animarRing() {
      if (reduzir) { ring.style.setProperty("--pct", pctAlvo); return; }
      var ini = performance.now();
      (function tick(now) {
        var p = Math.min((now - ini) / 1400, 1), e = 1 - Math.pow(1 - p, 3);
        ring.style.setProperty("--pct", (pctAlvo * e).toFixed(1));
        if (p < 1) requestAnimationFrame(tick);
      })(ini);
    }
    if ("IntersectionObserver" in window) {
      var ioR = new IntersectionObserver(function (es) {
        es.forEach(function (en) { if (en.isIntersecting) { animarRing(); ioR.unobserve(en.target); } });
      }, { threshold: 0.5 });
      ioR.observe(ring);
    } else { animarRing(); }
  }

  /* ---- Glow seguindo o mouse ---- */
  if (!reduzir) {
    document.querySelectorAll(".pilar").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---- Carrossel arrastavel ---- */
  document.querySelectorAll(".drag-row").forEach(function (row) {
    var down = false, startX = 0, startScroll = 0, moved = false;
    row.addEventListener("pointerdown", function (e) {
      down = true; moved = false; startX = e.clientX; startScroll = row.scrollLeft;
      row.setPointerCapture(e.pointerId);
    });
    row.addEventListener("pointermove", function (e) {
      if (!down) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 6) { moved = true; row.classList.add("dragging"); }
      row.scrollLeft = startScroll - dx;
    });
    function up() { down = false; row.classList.remove("dragging"); }
    row.addEventListener("pointerup", up);
    row.addEventListener("pointercancel", up);
    row.addEventListener("pointerleave", up);
    // evita clique-fantasma apos arrastar
    row.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var aberto = item.classList.contains("aberto");
      document.querySelectorAll(".faq-item.aberto").forEach(function (o) {
        o.classList.remove("aberto");
        o.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!aberto) { item.classList.add("aberto"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });

  /* ---- Back to top ---- */
  var topBtn = document.querySelector(".top-link");
  if (topBtn) topBtn.addEventListener("click", function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  });

  /* ---- Form (sem backend: feedback simples) ---- */
  var form = document.querySelector(".cta-form");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button");
    if (btn) { btn.textContent = "Recebido! Vamos te chamar 🎉"; btn.disabled = true; }
  });

  /* ---- Ano ---- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
