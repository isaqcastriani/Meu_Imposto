/* =========================================================================
   Landing page — interacoes e animacoes
   - Header que muda ao rolar
   - Menu mobile
   - Reveal no scroll (IntersectionObserver)
   - Counters animados
   - Glow que segue o mouse nos cards
   - FAQ accordion
   - Anel de teto animado
   - Ano no footer
   ========================================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header ao rolar ---- */
  var header = document.querySelector(".lp-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Menu mobile ---- */
  var burger = document.querySelector(".lp-burger");
  var mobile = document.querySelector(".lp-mobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      mobile.classList.toggle("aberto");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("aberto");
      });
    });
  }

  /* ---- Smooth scroll para ancoras ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var alvo = document.querySelector(a.getAttribute("href"));
      if (!alvo) return;
      e.preventDefault();
      alvo.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---- Reveal no scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("visivel"); });
  } else {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("visivel");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Counters animados ---- */
  function animarNumero(el) {
    var alvo = parseFloat(el.getAttribute("data-num"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var prefixo = el.getAttribute("data-pre") || "";
    var sufixo = el.getAttribute("data-suf") || "";
    var dur = 1500;
    var ini = performance.now();
    function fmt(v) {
      return v.toLocaleString("pt-BR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
    }
    if (prefersReduced) { el.textContent = prefixo + fmt(alvo) + sufixo; return; }
    function tick(now) {
      var p = Math.min((now - ini) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefixo + fmt(alvo * eased) + sufixo;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefixo + fmt(alvo) + sufixo;
    }
    requestAnimationFrame(tick);
  }
  var contadores = document.querySelectorAll("[data-num]");
  if (!("IntersectionObserver" in window)) {
    contadores.forEach(animarNumero);
  } else {
    var ioNum = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            animarNumero(en.target);
            ioNum.unobserve(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    contadores.forEach(function (el) { ioNum.observe(el); });
  }

  /* ---- Glow seguindo o mouse ---- */
  if (!prefersReduced) {
    document.querySelectorAll(".glow-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

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
      if (!aberto) {
        item.classList.add("aberto");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* ---- Anel de teto anima ao aparecer ---- */
  var ring = document.querySelector(".teto-ring");
  if (ring) {
    var alvoPct = parseFloat(ring.getAttribute("data-pct") || "0");
    function animarRing() {
      if (prefersReduced) { ring.style.setProperty("--pct", alvoPct); return; }
      var ini = performance.now();
      function tick(now) {
        var p = Math.min((now - ini) / 1400, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        ring.style.setProperty("--pct", (alvoPct * eased).toFixed(1));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if ("IntersectionObserver" in window) {
      var ioRing = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animarRing(); ioRing.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      ioRing.observe(ring);
    } else {
      animarRing();
    }
  }

  /* ---- Ano ---- */
  var ano = document.getElementById("ano");
  if (ano) ano.textContent = new Date().getFullYear();
})();
