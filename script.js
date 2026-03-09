// =============================================
// SIGNAL REAPER LABS — SCRIPT v3
// Comentários em português para facilitar o aprendizado
// =============================================


// ---- CURSOR CUSTOMIZADO ----
// Protege caso o elemento não exista (ex.: modo touch)
const cursorDot  = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;  // Posição atual do mouse
let ringX  = 0, ringY  = 0;  // Posição atual do anel (com delay)

if (cursorDot && cursorRing) {
    // Atualiza posição do ponto imediatamente ao mover o mouse
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
    });

    // Anel segue o mouse com leve atraso (interpolação linear)
    function animateCursor() {
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Anel cresce sobre elementos clicáveis
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest('a, button, .project-card, .feature-card, #welcome-screen')) {
            cursorDot.classList.add('is-hover');
            cursorRing.classList.add('is-hover');
        } else {
            cursorDot.classList.remove('is-hover');
            cursorRing.classList.remove('is-hover');
        }
    });
}


// ---- PARTÍCULAS NO BANNER ----
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createParticle() {
        return {
            x:  Math.random() * canvas.width,
            y:  Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            size: Math.random() * 1.4 + 0.4
        };
    }

    // 70 partículas — equilibrio entre visual e performance
    for (let i = 0; i < 70; i++) particles.push(createParticle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            // Volta pelo lado oposto quando sai da tela
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width)  p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,130,0,0.4)';
            ctx.fill();

            // Desenha linhas entre partículas próximas
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const d  = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (d < 110) {
                    const alpha = (1 - d / 110) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(255,130,0,${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}


// ---- TERMINAL BOOT ----
const terminalContent = document.getElementById('terminal-content');
const bootCursor      = document.getElementById('boot-cursor');

const getDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');
};

const randomIP = () =>
    `192.168.${Math.floor(Math.random() * 254) + 1}.${Math.floor(Math.random() * 254) + 1}`;

const bootLines = [
    `> BOOT_SEQUENCE: ${getDateTime()}`,
    `> LOCAL_HOST_IP: ${randomIP()}`,
    '> MOUNTING ESP32_MARAUDER... <span style="color:var(--accent)">OK</span>',
    '> INTERFACE: wlan0mon (MONITOR MODE)',
    '> SCANNING FREQUENCIES [433MHz / 2.4GHz]...',
    '> PACKET_INJECTION: <span style="color:var(--accent)">ENABLED</span>',
    '> SIGNAL_REAPER v2.0.26 <span style="color:var(--accent)">ONLINE</span>',
    '> <span style="color:var(--accent)">READY — Digite "help" para comandos.</span>',
];

let lineIdx = 0;

function runBootSequence() {
    if (!terminalContent || !bootCursor) return;

    if (lineIdx < bootLines.length) {
        const div = document.createElement('div');
        div.innerHTML = bootLines[lineIdx];
        div.style.marginBottom = '2px';
        terminalContent.appendChild(div);
        lineIdx++;

        // Scroll automático para o final do terminal
        const box = document.getElementById('terminal-box');
        if (box) box.scrollTop = box.scrollHeight;

        setTimeout(runBootSequence, 480);
    } else {
        // Boot terminado: mostra input interativo
        if (bootCursor) bootCursor.style.display = 'none';
        const inputLine = document.getElementById('terminal-input-line');
        if (inputLine) {
            inputLine.style.display = 'flex';
            const inp = document.getElementById('terminal-input');
            if (inp) inp.focus();
        }
    }
}

window.addEventListener('load', runBootSequence);


// ---- TERMINAL INTERATIVO ----
const terminalInput = document.getElementById('terminal-input');

const commands = {
    help: () => [
        '<span style="color:var(--accent)">Comandos disponíveis:</span>',
        '  whoami   → identidade do operador',
        '  projects → lista de projetos',
        '  skills   → habilidades técnicas',
        '  start    → entrar no site',
        '  clear    → limpar o terminal',
    ],
    whoami: () => [
        '> OPERADOR: <span style="color:var(--accent)">SIGNAL_REAPER</span>',
        '> NOME    : Vitor Pereira',
        '> CURSO   : Eng. Controle e Automação — IFSP',
    ],
    projects: () => [
        '<span style="color:var(--accent)">[ PROJECT_LOG ]</span>',
        '  01. Command CC1101  — RF Analysis 433 MHz',
        '  02. Marauder CYD   — WiFi/BT Audit ESP32',
        '  03. LoRa SX1278    — Long Range Telemetry',
    ],
    skills: () => [
        '<span style="color:var(--accent)">[ SKILL_MATRIX ]</span>',
        '  C++ / Embedded  ████████░░  75%',
        '  RF / Analysis   ██████░░░░  65%',
        '  Python          █████░░░░░  50%',
        '  HTML/CSS/JS     ██████░░░░  60%',
        '  Electronics     ████████░░  80%',
    ],
    start: () => {
        setTimeout(iniciarLab, 350);
        return ['> Iniciando lab...'];
    },
    clear: () => {
        if (terminalContent) terminalContent.innerHTML = '';
        return [];
    },
};

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;

        const cmd = terminalInput.value.trim().toLowerCase();
        terminalInput.value = '';

        // Ecoa o comando digitado
        const echo = document.createElement('div');
        echo.style.marginBottom = '2px';
        echo.innerHTML = `<span style="color:var(--accent)">&#x276F;</span> ${cmd}`;
        if (terminalContent) terminalContent.appendChild(echo);

        // Executa o comando
        const fn = commands[cmd];
        const output = fn ? fn() : [`> Não encontrado: "${cmd}". Digite "help".`];

        if (Array.isArray(output)) {
            output.forEach(text => {
                const div = document.createElement('div');
                div.style.marginBottom = '2px';
                div.innerHTML = text;
                if (terminalContent) terminalContent.appendChild(div);
            });
        }

        const box = document.getElementById('terminal-box');
        if (box) box.scrollTop = box.scrollHeight;
    });
}


// ---- TRANSIÇÃO: sair da tela de entrada ----
function iniciarLab() {
    const screen = document.getElementById('welcome-screen');
    const main   = document.getElementById('main-site');
    if (!screen || !main) return;

    screen.style.transform = 'translateY(-100%)';
    screen.style.opacity   = '0';

    setTimeout(() => {
        screen.classList.add('hidden');
        main.classList.add('show-site');
        window.scrollTo(0, 0);
    }, 950);
}

const welcomeScreen = document.getElementById('welcome-screen');
if (welcomeScreen) {
    welcomeScreen.addEventListener('click', (e) => {
        // Clique dentro do terminal não dispara a transição
        if (e.target.closest('.terminal-box')) return;
        iniciarLab();
    });
}


// ---- NAVBAR: brilho ao rolar ----
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
}


// ---- NAVBAR: menu mobile ----
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', String(open));
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}


// ---- NAVBAR: destaca link ativo ao rolar ----
const sections = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

if (sections.length && navAnchors.length) {
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navAnchors.forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
                });
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => spy.observe(s));
}


// ---- ANIMATE ENTRY: aparece ao rolar ----
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.animate-entry').forEach(el => observer.observe(el));


// ---- SKILL BARS: anima ao entrar na viewport ----
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fill  = entry.target.querySelector('.skill-bar-fill');
            if (fill) {
                fill.style.width = fill.dataset.width + '%';
                skillObserver.unobserve(entry.target); // Anima só uma vez
            }
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.skill-item').forEach(item => skillObserver.observe(item));