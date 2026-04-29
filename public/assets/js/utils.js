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
  return new Date(iso).toLocaleDateString("pt-BR");
}
