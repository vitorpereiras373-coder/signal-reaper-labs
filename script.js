// =============================================
// SIGNAL REAPER LABS — SCRIPT PRINCIPAL
// Comentários em português para facilitar aprendizado
// =============================================


// ---- CURSOR CUSTOMIZADO ----
// Pega os dois elementos do cursor
const cursorDot  = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

// Posições atuais do anel (com delay)
let ringX = 0, ringY = 0;
// Posições alvo (onde o mouse está)
let mouseX = 0, mouseY = 0;

// Atualiza posição do ponto imediatamente
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // O ponto segue instantaneamente
    cursorDot.style.left  = mouseX + 'px';
    cursorDot.style.top   = mouseY + 'px';
});

// O anel segue com animação suave (lerp = interpolação linear)
function animateCursor() {
    // Aproxima o anel ao mouse a cada frame (fator 0.12 = leveza do arrasto)
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';

    requestAnimationFrame(animateCursor); // Loop de animação
}
animateCursor();

// Expande o anel ao passar sobre elementos clicáveis
document.querySelectorAll('a, button, .card, #welcome-screen').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.width  = '50px';
        cursorRing.style.height = '50px';
        cursorRing.style.borderColor = 'rgba(255, 130, 0, 0.9)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.width  = '32px';
        cursorRing.style.height = '32px';
        cursorRing.style.borderColor = 'rgba(255, 130, 0, 0.6)';
    });
});


// ---- PARTÍCULAS NO BANNER ----
const canvas  = document.getElementById('particle-canvas');
const ctx     = canvas.getContext('2d');
let particles = [];

// Ajusta o canvas ao tamanho da janela
function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Cria uma partícula com posição e velocidade aleatórias
function createParticle() {
    return {
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5, // Velocidade suave
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5  // Tamanho 0.5 a 2px
    };
}

// Inicializa 80 partículas
for (let i = 0; i < 80; i++) particles.push(createParticle());

// Loop de animação das partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o frame anterior

    particles.forEach((p, i) => {
        // Move a partícula
        p.x += p.vx;
        p.y += p.vy;

        // Se sair da tela, volta pelo outro lado
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Desenha a partícula
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 130, 0, 0.45)';
        ctx.fill();

        // Conecta partículas próximas com uma linha
        for (let j = i + 1; j < particles.length; j++) {
            const p2   = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);

            if (dist < 100) {
                // Quanto mais perto, mais opaca a linha
                const alpha = (1 - dist / 100) * 0.25;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 130, 0, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();


// ---- TERMINAL BOOT ----
const getDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
};

const randomIP = () =>
    `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

// Mensagens que aparecem durante o boot
const bootLines = [
    `> BOOT_SEQUENCE: ${getDateTime()}`,
    `> LOCAL_HOST_IP: ${randomIP()}`,
    '> MOUNTING ESP32_MARAUDER... <span style="color:var(--orange)">OK</span>',
    '> INTERFACE: wlan0mon (MONITOR MODE)',
    '> SCANNING FREQUENCIES [2.4GHz]...',
    '> PACKET_INJECTION: <span style="color:var(--orange)">ENABLED</span>',
    '> TUNNELING ENCRYPTED SESSION...',
    '> STATUS: <span style="color:var(--orange)">SYSTEM ONLINE.</span>',
    '> <span style="color:var(--orange)">READY. Digite "help" para ver os comandos.</span>'
];

let lineIdx = 0;
const terminalContent = document.getElementById('terminal-content');
const bootCursor      = document.getElementById('boot-cursor');

// Digita as linhas de boot uma a uma
function runBootSequence() {
    if (lineIdx < bootLines.length) {
        const line      = document.createElement('div');
        line.style.marginBottom = '3px';
        line.innerHTML  = bootLines[lineIdx];
        terminalContent.appendChild(line);
        lineIdx++;

        // Scroll automático para o final
        const box = document.querySelector('.terminal-box');
        box.scrollTop = box.scrollHeight;

        setTimeout(runBootSequence, 500);
    } else {
        // Boot finalizado — ativa o input interativo
        bootCursor.style.display = 'none';
        const inputLine = document.getElementById('terminal-input-line');
        inputLine.style.display = 'flex';
        document.getElementById('terminal-input').focus();
    }
}

window.onload = runBootSequence;


// ---- TERMINAL INTERATIVO (comandos) ----
const terminalInput = document.getElementById('terminal-input');

// Respostas dos comandos disponíveis
const commands = {
    help: () => [
        '<span style="color:var(--orange)">Comandos disponíveis:</span>',
        '  whoami   → identidade do operador',
        '  projects → lista de projetos',
        '  skills   → habilidades',
        '  start    → entrar no site',
        '  clear    → limpar terminal',
    ],
    whoami: () => [
        '> OPERADOR: <span style="color:var(--orange)">SIGNAL_REAPER</span>',
        '> NOME: Vitor Pereira',
        '> IFSP — Engenharia de Controle e Automação',
    ],
    projects: () => [
        '<span style="color:var(--orange)">[ PROJECT_LOG ]</span>',
        '  01. Command CC1101   — RF Analysis 433MHz',
        '  02. Marauder CYD     — WiFi/BT Audit ESP32',
        '  03. LoRa SX1278      — Long Range Telemetry',
    ],
    skills: () => [
        '<span style="color:var(--orange)">[ SKILL_MATRIX ]</span>',
        '  C++ / Embedded   ████████░░  75%',
        '  RF / Analysis    ██████░░░░  65%',
        '  Python           █████░░░░░  50%',
        '  HTML/CSS/JS      ██████░░░░  60%',
        '  Electronics      ████████░░  80%',
    ],
    start: () => {
        setTimeout(iniciarLab, 400);
        return ['> Iniciando lab...'];
    },
    clear: () => {
        terminalContent.innerHTML = '';
        return [];
    },
};

// Escuta Enter no input do terminal
terminalInput.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    const cmd = terminalInput.value.trim().toLowerCase();
    terminalInput.value = '';

    // Mostra o comando digitado
    const echoed = document.createElement('div');
    echoed.style.marginBottom = '3px';
    echoed.innerHTML = `<span style="color:var(--orange)">&gt;</span> ${cmd}`;
    terminalContent.appendChild(echoed);

    // Executa o comando ou mostra erro
    const fn = commands[cmd];
    const lines = fn ? fn() : [`> Comando não encontrado: "${cmd}". Digite "help".`];

    lines.forEach(text => {
        const div = document.createElement('div');
        div.style.marginBottom = '3px';
        div.innerHTML = text;
        terminalContent.appendChild(div);
    });

    const box = document.querySelector('.terminal-box');
    box.scrollTop = box.scrollHeight;
});


// ---- TRANSIÇÃO AO CLICAR NA TELA DE ENTRADA ----
function iniciarLab() {
    const screen = document.getElementById('welcome-screen');
    const main   = document.getElementById('main-site');

    // Sobe a tela para fora da viewport
    screen.style.transform = 'translateY(-100%)';
    screen.style.opacity   = '0';

    setTimeout(() => {
        screen.classList.add('hidden');
        main.classList.add('show-site');
        window.scrollTo(0, 0);
    }, 900);
}

// Clique em qualquer parte da tela de entrada (exceto terminal)
document.getElementById('welcome-screen').addEventListener('click', (e) => {
    // Não aciona se o clique for dentro do terminal
    if (e.target.closest('.terminal-box')) return;
    iniciarLab();
});


// ---- NAVBAR: brilho ao rolar ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// ---- NAVBAR: hamburger mobile ----
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});


// ---- INTERSECTION OBSERVER: animações de entrada ----
// Observa todos os elementos com classe animate-entry
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 }); // Ativa quando 15% do elemento está visível

document.querySelectorAll('.animate-entry').forEach(el => observer.observe(el));


// ---- SKILL BARS: anima ao entrar na viewport ----
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Pega o valor alvo do data-width e aplica como largura CSS
            const fill  = entry.target.querySelector('.skill-bar-fill');
            const width = fill.dataset.width;
            fill.style.width = width + '%';
            skillObserver.unobserve(entry.target); // Anima só uma vez
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-item').forEach(item => skillObserver.observe(item));
