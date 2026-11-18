/* =========================================================
   VOZATIVA - JAVASCRIPT GERAL
   ========================================================= */


/* =========================================================
   NAVEGAÇÃO ENTRE PÁGINAS E SEÇÕES
   ========================================================= */

   function navigateTo(page) {

    /* Páginas que possuem arquivo próprio */
    var paginasExternas = {
        noticias: "noticias.html",
        denuncias: "denuncias.html",
        mapa: "mapa.html",
        chat: "assistente.html"
    };

    /* Seções que ficam dentro do index.html */
    var secoesHome = {
        home: "page-home",
        ajuda: "page-ajuda",
        psicologico: "page-psicologico",
        faq: "page-faq",
        historias: "page-historias",
        contatos: "page-contatos",
        materiais: "page-materiais",
        estatisticas: "page-estatisticas",
        campanhas: "page-campanhas"
    };


    /* ---------------------------------------------------------
       PÁGINAS EXTERNAS
       --------------------------------------------------------- */

    // ATUALIZAÇÃO 18/11 - solicitar login apenas para o formulário de denúncia.
    // Informações públicas, emergência e canais de ajuda permanecem acessíveis.
    if (page === "denuncias" && !obterUsuarioDemo()) {
        solicitarLoginDemo("denuncias.html");
        return;
    }

    if (paginasExternas[page]) {

        fecharMenuMobile();

        /*
         * replace() substitui a página atual
         * e não cria uma nova entrada no histórico.
         */
        window.location.replace(paginasExternas[page]);

        return;
    }


    /* ---------------------------------------------------------
       SEÇÕES DO INDEX
       --------------------------------------------------------- */

    if (secoesHome[page]) {

        var secaoId = secoesHome[page];

        /*
         * Se já estamos no index.html,
         * mostra a seção diretamente.
         */
        var secaoExiste = document.getElementById(secaoId);

        if (secaoExiste) {

            mostrarSecao(secaoId);

            fecharMenuMobile();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }


        /*
         * Se estamos em outra página,
         * salva qual seção deve aparecer
         * quando o index.html abrir.
         */
        sessionStorage.setItem(
            "vozativa_secao",
            secaoId
        );
        // ATUALIZAÇÃO 18/11 - permitir abrir seção pública sem sessão.
        sessionStorage.setItem("vozativa_public_navigation_once", "1");

        fecharMenuMobile();

        /*
         * replace() para não adicionar ao histórico.
         */
        window.location.replace("index.html");

        return;
    }


    /* ---------------------------------------------------------
       CASO NÃO ENCONTRE A PÁGINA
       --------------------------------------------------------- */

    console.warn("Página não encontrada:", page);

    fecharMenuMobile();
}


/* =========================================================
   MOSTRAR UMA SEÇÃO DO INDEX
   ========================================================= */

function mostrarSecao(secaoId) {

    /*
     * Pega todas as seções que possuem a classe .page
     */
    var secoes = document.querySelectorAll("main .page");


    /*
     * Esconde todas
     */
    secoes.forEach(function (secao) {
        secao.classList.add("hidden");
    });


    /*
     * Mostra somente a escolhida
     */
    var secao = document.getElementById(secaoId);

    if (secao) {

        secao.classList.remove("hidden");

    } else {

        console.warn(
            "A seção não foi encontrada:",
            secaoId
        );
    }
}


/* =========================================================
   ABRIR SEÇÃO SALVA AO CARREGAR O INDEX
   ========================================================= */

function carregarSecaoSalva() {

    var secaoSalva = sessionStorage.getItem(
        "vozativa_secao"
    );


    if (secaoSalva) {

        /*
         * Remove primeiro para não abrir novamente
         * em um próximo acesso ao index.
         */
        sessionStorage.removeItem(
            "vozativa_secao"
        );


        mostrarSecao(secaoSalva);


        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        return;
    }


    /*
     * Se nenhuma seção foi escolhida,
     * mostra a página inicial.
     */
    var home = document.getElementById("page-home");

    if (home) {

        mostrarSecao("page-home");

    }
}


/* =========================================================
   MENU "MAIS"
   ========================================================= */

function toggleMore(event) {

    if (event) {
        event.stopPropagation();
    }

    var menu = document.getElementById("moreMenu");

    if (!menu) {
        return;
    }

    menu.classList.toggle("hidden");
}


/* Fecha o menu "Mais" quando clicar fora */
document.addEventListener("click", function (event) {

    var dropdown = document.querySelector(".dropdown");

    var menu = document.getElementById("moreMenu");

    if (!dropdown || !menu) {
        return;
    }


    if (!dropdown.contains(event.target)) {

        menu.classList.add("hidden");

    }

});


/* =========================================================
   MENU HAMBÚRGUER
   ========================================================= */

function toggleMobileMenu() {

    var navLinks = document.getElementById("navLinks");

    var menuToggle = document.getElementById("menuToggle");

    if (!navLinks || !menuToggle) {
        return;
    }


    navLinks.classList.toggle("menu-aberto");


    if (navLinks.classList.contains("menu-aberto")) {

        menuToggle.innerHTML = "✕";
        menuToggle.setAttribute(
            "aria-label",
            "Fechar menu"
        );

    } else {

        menuToggle.innerHTML = "☰";
        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

        var moreMenu = document.getElementById("moreMenu");

        if (moreMenu) {
            moreMenu.classList.add("hidden");
        }
    }
}


/* =========================================================
   FECHAR MENU MOBILE
   ========================================================= */

function fecharMenuMobile() {

    var navLinks = document.getElementById("navLinks");

    var menuToggle = document.getElementById("menuToggle");

    var moreMenu = document.getElementById("moreMenu");


    if (navLinks) {

        navLinks.classList.remove("menu-aberto");

    }


    if (menuToggle) {

        menuToggle.innerHTML = "☰";

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menu"
        );

    }


    if (moreMenu) {

        moreMenu.classList.add("hidden");

    }
}


/* =========================================================
   ESC FECHA MENU MOBILE
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }


    var navLinks = document.getElementById("navLinks");

    if (
        navLinks &&
        navLinks.classList.contains("menu-aberto")
    ) {

        fecharMenuMobile();

    }

});


/* =========================================================
   CRIAR BOTÃO DO MENU MOBILE
   ========================================================= */

function criarBotaoMenuMobile() {

    /*
     * Não cria outro botão se já existir.
     */
    if (document.getElementById("menuToggle")) {
        return;
    }


    var navRight = document.querySelector(".nav-right");

    var navLinks = document.getElementById("navLinks");


    if (!navRight || !navLinks) {
        return;
    }


    var botao = document.createElement("button");

    botao.type = "button";

    botao.id = "menuToggle";

    botao.className = "menu-toggle";

    botao.innerHTML = "☰";

    botao.setAttribute(
        "aria-label",
        "Abrir menu"
    );


    botao.addEventListener(
        "click",
        toggleMobileMenu
    );


    navRight.insertBefore(
        botao,
        navRight.firstChild
    );
}


/* =========================================================
   FECHAR MENU AO REDIMENSIONAR
   ========================================================= */

window.addEventListener("resize", function () {

    if (window.innerWidth > 900) {

        fecharMenuMobile();

    }

});


/* =========================================================
   TEMA CLARO / ESCURO
   ========================================================= */

function aplicarTema() {

    var tema = localStorage.getItem("theme");


    if (tema !== "dark" && tema !== "light") {

        tema = "light";

    }


    document.documentElement.setAttribute(
        "data-theme",
        tema
    );


    document.body.setAttribute(
        "data-theme",
        tema
    );
}


function toggleTheme() {

    var temaAtual =
        document.documentElement.getAttribute(
            "data-theme"
        );


    var novoTema =
        temaAtual === "dark"
            ? "light"
            : "dark";


    localStorage.setItem(
        "theme",
        novoTema
    );


    aplicarTema();
}


/* =========================================================
   MARCAR BOTÃO DA PÁGINA ATUAL
   ========================================================= */

function marcarPaginaAtual() {

    var paginaAtual =
        document.body.dataset.page;


    if (!paginaAtual) {
        return;
    }


    var botoes =
        document.querySelectorAll(
            ".nav-links button[data-page]"
        );


    botoes.forEach(function (botao) {

        botao.classList.remove("active");


        if (
            botao.dataset.page === paginaAtual
        ) {

            botao.classList.add("active");

        }

    });
}


/* =========================================================
   SAÍDA RÁPIDA
   ========================================================= */

function quickExit() {

    /*
     * replace() impede que a página atual
     * fique como página anterior no histórico.
     */
    window.location.replace(
        "https://www.google.com/search?q=tempo&oq=tempo&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTINCAEQABiSAxiABBiKBTINCAIQABiSAxiABBiKBTINCAMQABiDARixAxiABDIKCAQQABixAxiABDINCAUQABiDARixAxiABDINCAYQABiDARixAxiABDINCAcQABiDARixAxiABDINCAgQABiDARixAxiABDIHCAkQABiPAtIBCDIzMDdqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8&safe=active&ssui=on"
    );
}


/* =========================================================
   ESC - SAÍDA RÁPIDA
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }


    var navLinks =
        document.getElementById("navLinks");


    /*
     * Se o menu estiver aberto,
     * o primeiro ESC apenas fecha o menu.
     */
    if (
        navLinks &&
        navLinks.classList.contains("menu-aberto")
    ) {

        return;
    }


    quickExit();

});


/* =========================================================
   MODAL DE EMERGÊNCIA
   ========================================================= */

function openEmergency() {

    var modal =
        document.getElementById(
            "emergencyModal"
        );


    if (modal) {

        modal.classList.add("open");

    }
}


function closeEmergency() {

    var modal =
        document.getElementById(
            "emergencyModal"
        );


    if (modal) {

        modal.classList.remove("open");

    }
}


/* Fecha emergência clicando fora */
document.addEventListener("click", function (event) {

    var modal =
        document.getElementById(
            "emergencyModal"
        );


    if (!modal) {
        return;
    }


    if (
        event.target === modal
    ) {

        closeEmergency();

    }

});


/* =========================================================
   LOGIN
   ========================================================= */

   function openLogin() {
    window.location.href = "entrar.html";
}


/* =========================================================
   ESC PARA FECHAR MODAIS
   ========================================================= */

document.addEventListener("keydown", function (event) {

    if (event.key !== "Escape") {
        return;
    }


    closeEmergency();


    var loginModal =
        document.getElementById(
            "loginModal"
        );


    if (loginModal) {

        loginModal.classList.remove("open");

    }

});


/* =========================================================
   CARREGAMENTO INICIAL
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Aplica o tema salvo.
         */
        aplicarTema();


        /*
         * Marca o botão correspondente
         * à página atual.
         */
        marcarPaginaAtual();


        /*
         * Cria o botão do menu hambúrguer.
         */
        criarBotaoMenuMobile();


        /*
         * Abre a seção correta do index,
         * caso tenha vindo de outra página.
         */
        carregarSecaoSalva();

    }
);

// =========================================================
// ATUALIZAÇÃO 16/11 — ÁREA DE PERFIL DIDÁTICA
// Usa somente nome/e-mail da sessão de demonstração existente.
// Não consulta nem altera banco.sql, JSON ou senhas.
// Não é autenticação nem proteção de páginas ou dados reais.
// =========================================================
function obterUsuarioDemo() {
    try {
        const valor = sessionStorage.getItem("vozativa_demo_usuario");
        const usuario = valor ? JSON.parse(valor) : null;
        if (usuario && typeof usuario.nome === "string" &&
            typeof usuario.email === "string") return usuario;
        // Compatibilidade com o login demonstrativo anterior.
        const nomeAntigo = sessionStorage.getItem("vozativa_demo_nome");
        return nomeAntigo ? { nome: nomeAntigo, email: "" } : null;
    } catch (erro) {
        return null;
    }
}

function sairDaContaDemo() {
    sessionStorage.removeItem("vozativa_demo_usuario");
    sessionStorage.removeItem("vozativa_demo_nome");
    sessionStorage.removeItem("vozativa_after_login");
    // ATUALIZAÇÃO 18/11 - Sair volta à tela de login, sem deixar a página aberta.
    window.location.replace("entrar.html");
}

function solicitarLoginDemo(destino) {
    if (destino) sessionStorage.setItem("vozativa_after_login", destino);
    window.location.href = "entrar.html";
}

function atualizarMenuUsuarioDemo() {
    const usuario = obterUsuarioDemo();
    // Atualiza a barra de navegação presente em todas as páginas.
    document.querySelectorAll(".nav-right .login-btn").forEach(function(botao) {
        if (!usuario) return;
        botao.textContent = "Minha conta: " + usuario.nome.split(" ")[0];
        botao.removeAttribute("onclick");
        botao.setAttribute("aria-label", "Abrir meu perfil de demonstração");
        botao.onclick = function() { window.location.href = "perfil.html"; };
    });

    // O botão Sair é criado somente para quem fez login.
    document.querySelectorAll(".nav-right").forEach(function(barra) {
        if (!usuario || barra.querySelector("[data-vozativa-sair]")) return;
        const sair = document.createElement("button");
        sair.type = "button";
        sair.dataset.vozativaSair = "";
        sair.className = "login-btn";
        sair.textContent = "Sair";
        // ATUALIZAÇÃO 18/11 - espaçamento controlado pelo layout do cabeçalho.
        sair.style.backgroundColor = "transparent";
        sair.style.border = "1px solid currentColor";
        sair.addEventListener("click", sairDaContaDemo);
        barra.appendChild(sair);
    });

    // Os campos só existem na nova página perfil.html.
    const campoNome = document.getElementById("perfilNomeDemo");
    const campoEmail = document.getElementById("perfilEmailDemo");
    const aviso = document.getElementById("perfilAvisoDemo");
    if (campoNome) campoNome.textContent = usuario ? usuario.nome : "Nenhum usuário conectado";
    if (campoEmail) campoEmail.textContent = usuario && usuario.email ? usuario.email : "—";
    if (aviso) aviso.textContent = usuario
        ? "Você está usando uma conta de demonstração."
        : "Entre com uma conta fictícia para ver seu perfil.";
}

// ATUALIZAÇÃO 16/11 — monta o menu no carregamento de cada página.
// ATUALIZAÇÃO 18/11 - primeiro acesso: mostrar login antes do conteúdo inicial.
// O menu e as páginas informativas continuam públicos.
(function iniciarPeloLogin() {
    const nomeArquivo = location.pathname.split("/").pop().toLowerCase();
    const inicial = nomeArquivo === "index.html" || nomeArquivo === "";
    if (!inicial || obterUsuarioDemo()) return;
    const navegacaoPublica = sessionStorage.getItem("vozativa_public_navigation_once") === "1";
    sessionStorage.removeItem("vozativa_public_navigation_once");
    if (!navegacaoPublica) window.location.replace("entrar.html");
})();

document.addEventListener("DOMContentLoaded", atualizarMenuUsuarioDemo);

// ATUALIZAÇÃO 18/11 - organização visual do menu e barras de segurança.
// CSS injetado no JS comum para preservar os arquivos originais de cada página.
(function ajustarCabecalhoVozAtiva() {
    if (document.getElementById("vozativa-cabecalho-18-11")) return;
    const estilo = document.createElement("style");
    estilo.id = "vozativa-cabecalho-18-11";
    estilo.textContent = `
      /* Mantém a barra de emergência visível sem sobrepor ou cortar o menu. */
      body { padding-top: 0 !important; }
      .safety-bar { position: relative !important; top: auto !important; left:auto; right:auto; z-index:1001; }
      .mainnav { position: sticky !important; top:0 !important; left:auto; right:auto; z-index:1000; }
      .safety-inner { width:min(1520px,calc(100% - 40px)) !important; max-width:1520px !important;
        padding:10px 14px !important; gap:14px 24px !important; }
      .safety-msg { flex:1 1 360px; line-height:1.35; font-size:13px; }
      .safety-actions { gap:10px; flex-wrap:wrap; }
      .nav-inner { width:min(1520px,calc(100% - 40px)) !important; max-width:1520px !important;
        padding:12px 14px !important; gap:18px !important; }
      .brand { flex-shrink:0; white-space:nowrap; }
      .nav-links { flex:1 1 auto; justify-content:center; gap:3px !important;
        flex-wrap:nowrap !important; }
      .nav-links > button, .nav-links .dropdown > button { font-size:14px; padding:10px 11px; }
      .nav-right { gap:10px !important; flex-shrink:0; }
      .nav-right .login-btn { white-space:nowrap; font-size:13px; }
      @media (max-width:1350px) {
        .nav-inner { position:relative; gap:12px !important; }
        .menu-toggle { display:flex !important; order:2; }
        .brand { order:1; margin-right:auto; }
        .nav-right { order:3; }
        .mainnav .nav-links { display:none !important; position:absolute; top:100%; left:12px; right:12px;
          width:auto; z-index:2000; padding:12px; background:var(--card,#fff);
          border:1px solid rgba(0,0,0,.1); border-radius:14px;
          box-shadow:0 12px 32px rgba(0,0,0,.15);
          flex-direction:column; align-items:stretch; gap:4px; max-height:70vh; overflow-y:auto; }
        .mainnav .nav-links.menu-aberto { display:flex !important; }
        .mainnav .nav-links > button, .mainnav .nav-links .dropdown > button {
          width:100%; text-align:left; padding:12px 15px; }
        .mainnav .nav-links .dropdown-menu {position:static; width:100%;box-shadow:none;}
      }
      @media (max-width:650px) {
        .safety-inner,.nav-inner {width:100% !important;padding:10px 14px !important;}
        .safety-msg { flex-basis:100%; font-size:12px; }
        .safety-actions {width:100%;display:flex;}
        .safety-actions button {flex:1;min-width:135px;}
        .nav-right .login-btn { max-width:150px;overflow:hidden;text-overflow:ellipsis; }
      }
    `;
    document.head.appendChild(estilo);
})();

