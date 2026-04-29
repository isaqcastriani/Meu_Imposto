var MENU_MEI = [
  {
    titulo: "Principal",
    itens: [
      { url: "dashboard.html", icone: "layout-dashboard", label: "Dashboard" },
      { url: "financeiro.html", icone: "wallet", label: "Financeiro" },
      { url: "das.html", icone: "calculator", label: "DAS" },
      { url: "calendario.html", icone: "calendar", label: "Calendario" }
    ]
  },
  {
    titulo: "Ferramentas",
    itens: [
      { url: "simulador.html", icone: "trending-up", label: "Simulador" },
      { url: "nfse.html", icone: "file-text", label: "NFS-e" },
      { url: "beneficios.html", icone: "heart-handshake", label: "Beneficios" },
      { url: "relatorios.html", icone: "bar-chart-3", label: "Relatorios" },
      { url: "cnpj.html", icone: "search", label: "Consultar CNPJ" }
    ]
  },
  {
    titulo: "Ajuda",
    itens: [
      { url: "tutoriais.html", icone: "book-open", label: "Tutoriais" },
      { url: "atalhos.html", icone: "external-link", label: "Atalhos Gov.br" }
    ]
  }
];
var MENU_ADMIN = [
  {
    titulo: "Administracao",
    itens: [
      { url: "admin.html", icone: "layout-dashboard", label: "Painel" },
      { url: "admin-usuarios.html", icone: "users", label: "Usuarios" },
      { url: "admin-tutoriais.html", icone: "book-open", label: "Tutoriais" },
      { url: "admin-atalhos.html", icone: "external-link", label: "Atalhos" },
      { url: "admin-metricas.html", icone: "bar-chart-3", label: "Metricas" }
    ]
  }
];
function montarSidebar(paginaAtiva, ehAdmin) {
  var menu = ehAdmin ? MENU_ADMIN : MENU_MEI;
  var html = '';
  html += '<div class="sidebar-topo">';
  html += '<a class="logo" href="' + (ehAdmin ? 'admin.html' : 'dashboard.html') + '">';
  html += '<img src="assets/img/logo.png" alt="Meu Imposto">';
  html += '<span class="logo-texto"><span class="logo-titulo">Meu Imposto</span><span class="logo-subtitulo">MEI sem complicacao</span></span>';
  html += '</a>';
  html += '</div>';
  if (!ehAdmin) {
    html += '<div class="sidebar-user">';
    html += '<div class="avatar">MS</div>';
    html += '<div class="info"><div class="nome">' + usuarioMEI.razaoSocial + '</div><div class="cnpj tabular">' + usuarioMEI.cnpj + '</div></div>';
    html += '</div>';
  }
  html += '<nav class="sidebar-nav">';
  for (var g = 0; g < menu.length; g++) {
    var grupo = menu[g];
    html += '<div class="sidebar-grupo">';
    html += '<div class="sidebar-grupo-titulo">' + grupo.titulo + '</div>';
    for (var i = 0; i < grupo.itens.length; i++) {
      var item = grupo.itens[i];
      var ativo = item.url === paginaAtiva ? ' ativo' : '';
      html += '<a class="sidebar-link' + ativo + '" href="' + item.url + '">';
      html += '<i data-lucide="' + item.icone + '"></i>' + item.label;
      html += '</a>';
    }
    html += '</div>';
  }
  html += '</nav>';
  html += '<div class="sidebar-rodape">';
  if (ehAdmin) {
    html += '<a class="sidebar-link" href="dashboard.html"><i data-lucide="shield"></i>Modo MEI</a>';
  } else {
    html += '<a class="sidebar-link" href="perfil.html"><i data-lucide="user"></i>Perfil</a>';
  }
  html += '<a class="sidebar-link" href="login.html" style="color: var(--vermelho)"><i data-lucide="log-out"></i>Sair</a>';
  html += '</div>';
  return html;
}
function montarTopbar(titulo, ehAdmin) {
  var html = '';
  html += '<button class="btn btn-ghost btn-icon" onclick="toggleSidebar()" style="display:none" id="btnMenu"><i data-lucide="menu"></i></button>';
  if (ehAdmin) {
    html += '<div class="admin-bar"><i data-lucide="shield" style="width:12px;height:12px"></i> Painel administrativo</div>';
    html += '<div class="flex-1"></div>';
  } else {
    html += '<nav class="breadcrumb"><span>Inicio</span><span>›</span><span class="atual">' + titulo + '</span></nav>';
    html += '<div class="busca"><i data-lucide="search"></i><input class="input" placeholder="Buscar lancamentos, tutoriais, NFS-e..."></div>';
    html += '<button class="btn btn-ghost btn-icon sino" onclick="abrirNotificacoes()"><i data-lucide="bell"></i><span class="ponto">' + alertas.length + '</span></button>';
    html += '<button class="btn btn-ghost" style="padding:4px 12px 4px 4px;border-radius:999px"><span class="avatar" style="width:30px;height:30px;border-radius:50%;background:var(--roxo);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;margin-right:6px">MS</span>Maria</button>';
  }
  return html;
}
function renderShell(opts) {
  if (opts.admin) document.documentElement.classList.add('admin-tema');
  var sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.innerHTML = montarSidebar(opts.pagina, opts.admin);
  var topbar = document.getElementById('topbar');
  if (topbar) topbar.innerHTML = montarTopbar(opts.titulo, opts.admin);
  if (window.innerWidth < 1024) {
    var bm = document.getElementById('btnMenu');
    if (bm) bm.style.display = 'inline-flex';
  }
  if (window.lucide) lucide.createIcons();
}
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('aberta');
}
function abrirNotificacoes() {
  for (var i = 0; i < Math.min(alertas.length, 2); i++) {
    var a = alertas[i];
    toast(a.titulo, { desc: a.desc, tipo: a.tipo === 'warning' ? 'erro' : 'info' });
  }
}
