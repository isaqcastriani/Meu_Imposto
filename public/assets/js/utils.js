function brl(n) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function numero(n) {
  return n.toLocaleString("pt-BR");
}
function pct(n, casas) {
  if (casas === undefined) casas = 1;
  return n.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + "%";
}
function mascaraCNPJ(v) {
  v = v.replace(/\D/g, "").slice(0, 14);
  v = v.replace(/^(\d{2})(\d)/, "$1.$2");
  v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
  v = v.replace(/(\d{4})(\d)/, "$1-$2");
  return v;
}
function mascaraCPF(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return v;
}
function mascaraTelefone(v) {
  v = v.replace(/\D/g, "").slice(0, 11);
  v = v.replace(/(\d{2})(\d)/, "($1) $2");
  v = v.replace(/(\d{5})(\d)/, "$1-$2");
  return v;
}
function toast(msg, opts) {
  opts = opts || {};
  var caixa = document.getElementById("toasts");
  if (!caixa) {
    caixa = document.createElement("div");
    caixa.id = "toasts";
    caixa.className = "toasts";
    document.body.appendChild(caixa);
  }
  var t = document.createElement("div");
  t.className = "toast " + (opts.tipo || "");
  var html = '<div class="titulo">' + msg + '</div>';
  if (opts.desc) html += '<div class="desc">' + opts.desc + '</div>';
  t.innerHTML = html;
  caixa.appendChild(t);
  setTimeout(function() {
    t.style.opacity = "0";
    t.style.transition = "opacity .3s";
    setTimeout(function() { t.remove(); }, 300);
  }, 3500);
}
function getParam(nome) {
  var p = new URLSearchParams(window.location.search);
  return p.get(nome);
}
function dataBR(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("pt-BR");
}
// Tempo relativo simples a partir de uma data ISO (ex.: "ha 2 dias").
function tempoRelativo(iso) {
  if (!iso) return "";
  var diff = Date.now() - new Date(iso).getTime();
  var min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return "ha " + min + " min";
  var h = Math.floor(min / 60);
  if (h < 24) return "ha " + h + "h";
  var d = Math.floor(h / 24);
  if (d === 1) return "ontem";
  if (d < 30) return "ha " + d + " dias";
  var meses = Math.floor(d / 30);
  return "ha " + meses + (meses === 1 ? " mes" : " meses");
}
// Dias inteiros entre hoje e uma data ISO (positivo = futuro).
function diasAte(iso) {
  if (!iso) return 0;
  var hoje = new Date(); hoje.setHours(0, 0, 0, 0);
  var alvo = new Date(iso); alvo.setHours(0, 0, 0, 0);
  return Math.round((alvo - hoje) / 86400000);
}
// Mostra um estado de erro amigavel num container e dispara toast.
function erroCarregar(el, err) {
  var msg = (err && err.message) ? err.message : "Falha ao carregar";
  if (el) el.innerHTML = '<div class="card" style="text-align:center;color:var(--vermelho)">⚠ ' + msg + '</div>';
  if (typeof toast === "function") toast("Erro ao carregar dados", { desc: msg, tipo: "erro" });
}
