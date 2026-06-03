/* ============================================================
   Cliente de API do Meu Imposto (frontend estatico -> backend Express)
   Uso:
     api.login(email, senha) -> salva token e retorna { token, usuario }
     api.get('/financeiro/resumo')
     api.post('/lancamentos', { ... })
   O token JWT fica no localStorage. Configure a URL base abaixo.
   ============================================================ */
var API = (function () {
  // Resolucao da URL base:
  //  - window.API_BASE_URL definido -> usa ele (override manual)
  //  - rodando local (localhost/127.0.0.1) -> backend de dev em :4000
  //  - producao (GitHub Pages) -> API hospedada no Render
  // OBS: confirme esta URL no painel do Render apos o primeiro deploy.
  var _isLocal = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var PROD_API = 'https://meu-imposto-api.onrender.com/api';
  var BASE_URL = (window.API_BASE_URL) || (_isLocal ? 'http://localhost:4000/api' : PROD_API);
  var TOKEN_KEY = 'mi_token';
  var USER_KEY = 'mi_user';

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function setSession(token, usuario) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (usuario) localStorage.setItem(USER_KEY, JSON.stringify(usuario));
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch (e) { return null; }
  }
  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  async function request(method, path, body) {
    var headers = { 'Content-Type': 'application/json' };
    var token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    var res = await fetch(BASE_URL + path, {
      method: method,
      headers: headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    var data = null;
    try { data = await res.json(); } catch (e) { /* sem corpo */ }
    if (!res.ok) {
      var msg = (data && data.erro) ? data.erro : ('Erro ' + res.status);
      var err = new Error(msg);
      err.status = res.status;
      err.detalhes = data && data.detalhes;
      if (res.status === 401) { logout(); }
      throw err;
    }
    return data;
  }

  async function login(email, senha) {
    var data = await request('POST', '/auth/login', { email: email, senha: senha });
    setSession(data.token, data.usuario);
    return data;
  }
  async function register(dados) {
    var data = await request('POST', '/auth/register', dados);
    setSession(data.token, data.usuario);
    return data;
  }

  // Redireciona para login se nao autenticado. Chame no topo de paginas internas.
  function exigirLogin() {
    if (!getToken()) { window.location.href = 'login.html'; return false; }
    return true;
  }

  return {
    BASE_URL: BASE_URL,
    get: function (p) { return request('GET', p); },
    post: function (p, b) { return request('POST', p, b); },
    put: function (p, b) { return request('PUT', p, b); },
    patch: function (p, b) { return request('PATCH', p, b); },
    del: function (p) { return request('DELETE', p); },
    login: login,
    register: register,
    logout: logout,
    getUser: getUser,
    getToken: getToken,
    exigirLogin: exigirLogin,
  };
})();
window.api = API;
