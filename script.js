// --- Lógica de Navegação entre Páginas ---
function mostrarPagina(idPagina) {
    // 1. Esconde todas as páginas
    document.querySelectorAll('.pagina').forEach(pagina => {
        pagina.classList.remove('ativa');
    });

    // 2. Mostra a página desejada
    const paginaAtiva = document.getElementById(idPagina);
    if (paginaAtiva) {
        paginaAtiva.classList.add('ativa');
    }
}

// Inicializa mostrando a página principal ao carregar
document.addEventListener('DOMContentLoaded', () => {
    mostrarPagina('principal');
});


// --- Lógica Simples do Temporizador (Pomodoro 25min) ---
let tempoTotalEmSegundos = 25 * 60; // 25 minutos
let segundosRestantes = tempoTotalEmSegundos;
let intervalId = null;
const displayTempo = document.getElementById('tempo-restante');
const botaoIniciarPausar = document.getElementById('iniciar-pausar');
const botaoResetar = document.getElementById('resetar');
const statusTimer = document.getElementById('status-timer');

function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    // Adiciona um zero à esquerda se for menor que 10
    return `${minutos < 10 ? '0' : ''}${minutos}:${segs < 10 ? '0' : ''}${segs}`;
}

function atualizarDisplay() {
    displayTempo.textContent = formatarTempo(segundosRestantes);
}

function iniciarTemporizador() {
    if (intervalId !== null) {
        return; // Já está rodando
    }

    intervalId = setInterval(() => {
        if (segundosRestantes > 0) {
            segundosRestantes--;
            atualizarDisplay();
        } else {
            // Fim do tempo
            clearInterval(intervalId);
            intervalId = null;
            botaoIniciarPausar.textContent = 'Iniciar';
            statusTimer.textContent = 'FIM! Hora da Pausa!';
            // Tocar um som ou notificação aqui seria ideal
            alert('Tempo de Foco Encerrado!');
        }
    }, 1000); // 1000 milissegundos = 1 segundo

    botaoIniciarPausar.textContent = 'Pausar';
    statusTimer.textContent = 'Foco em Andamento...';
}

function pausarTemporizador() {
    clearInterval(intervalId);
    intervalId = null;
    botaoIniciarPausar.textContent = 'Continuar';
    statusTimer.textContent = 'Pausado';
}

function resetarTemporizador() {
    pausarTemporizador();
    segundosRestantes = tempoTotalEmSegundos;
    atualizarDisplay();
    statusTimer.textContent = 'Tempo de Foco';
    botaoIniciarPausar.textContent = 'Iniciar';
}

// Event Listeners para os botões do Temporizador
botaoIniciarPausar.addEventListener('click', () => {
    if (intervalId) {
        pausarTemporizador();
    } else {
        iniciarTemporizador();
    }
});

botaoResetar.addEventListener('click', resetarTemporizador);

// Atualiza o display inicial
atualizarDisplay();


// -------------------------------------------------------------------
// --- NOVO: Lógica de Bloqueio de Sites (Simulação de Interface) ---
// -------------------------------------------------------------------

const textareaBloqueio = document.querySelector('#bloqueio textarea');
const checkboxBloqueio = document.querySelector('#bloqueio input[type="checkbox"]');
const botaoSalvarBloqueio = document.querySelector('#bloqueio button');

const LS_SITES_KEY = 'focusFlowBlockedSites';
const LS_STATUS_KEY = 'focusFlowBlockStatus';

// 1. Carrega dados do Local Storage ao iniciar
function carregarConfiguracoesBloqueio() {
    // Carrega a lista de sites (texto)
    const sitesSalvos = localStorage.getItem(LS_SITES_KEY);
    if (sitesSalvos) {
        textareaBloqueio.value = sitesSalvos;
    } else {
        // Exemplo inicial, se não houver nada salvo
        textareaBloqueio.value = 'facebook.com\nyoutube.com\ninstagram.com';
    }

    // Carrega o status do bloqueio (ligado/desligado)
    const statusSalvo = localStorage.getItem(LS_STATUS_KEY) === 'true';
    checkboxBloqueio.checked = statusSalvo;
    
    // Atualiza o botão de salvar para refletir o estado
    atualizarBotaoBloqueio(statusSalvo);
}

// 2. Salva a lista e o status no Local Storage
function salvarConfiguracoesBloqueio() {
    const sites = textareaBloqueio.value.trim();
    const status = checkboxBloqueio.checked;

    // Salva o texto da textarea
    localStorage.setItem(LS_SITES_KEY, sites);
    
    // Salva o status booleano
    localStorage.setItem(LS_STATUS_KEY, status);

    atualizarBotaoBloqueio(status);
    
    // Alerta de confirmação. Na extensão real, esta é a parte que notifica o 'background.js'
    alert(`Configurações de Bloqueio Salvas! Status: ${status ? 'ATIVO' : 'INATIVO'}`);
}

// 3. Atualiza o texto e a cor do botão com base no status do checkbox
function atualizarBotaoBloqueio(status) {
    if (status) {
        botaoSalvarBloqueio.textContent = 'Bloqueio ATIVO | Salvar Alterações';
        botaoSalvarBloqueio.style.backgroundColor = '#e74c3c'; // Vermelho para 'ativo/bloqueando'
    } else {
        botaoSalvarBloqueio.textContent = 'Bloqueio INATIVO | Salvar Configurações';
        botaoSalvarBloqueio.style.backgroundColor = '#3498db'; // Azul padrão
    }
}

// Event Listener para o botão de salvar
botaoSalvarBloqueio.addEventListener('click', salvarConfiguracoesBloqueio);

// Carrega as configurações ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    mostrarPagina('principal');
    carregarConfiguracoesBloqueio(); // Chama a nova função
});