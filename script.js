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
        if (e.target.closest('a, button, .project-card, .skill-card, .curso-card')) {
            cursorDot.classList.add('is-hover');
            cursorRing.classList.add('is-hover');
        } else {
            cursorDot.classList.remove('is-hover');
            cursorRing.classList.remove('is-hover');
        }
    });
}


// ---- PARTÍCULAS NO FUNDO ----
const canvas = document.getElementById('bg-canvas');
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

document.querySelectorAll('.skill-card').forEach(item => skillObserver.observe(item));

// ---- TERMINAL MINI BARS: inicializa barrinhas do terminal card ----
document.querySelectorAll('.tc-bar-mini').forEach(bar => {
    const p = bar.dataset.p;
    if (p) bar.style.setProperty('--p', p + '%');
});
