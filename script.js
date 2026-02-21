// Funções de Inicialização e Terminal (Mantidas)
const getDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR') + " " + now.toLocaleTimeString('pt-BR');
};

const pentestLines = [
    `> BOOT_SEQUENCE: ${getDateTime()}`,
    "> STATUS: ENCRYPTED_ACCESS",
    "> READY_FOR_INTERACTION."
];

let lineIdx = 0;
function runTerminal() {
    const content = document.getElementById("terminal-content");
    if (content && lineIdx < pentestLines.length) {
        const line = document.createElement("div");
        line.innerHTML = pentestLines[lineIdx];
        content.appendChild(line);
        lineIdx++;
        setTimeout(runTerminal, 600); 
    }
}

function iniciarLab() {
    const screen = document.getElementById('welcome-screen');
    const main = document.getElementById('main-site');
    screen.style.transform = 'translateY(-100%)';
    setTimeout(() => {
        screen.classList.add('hidden');
        main.classList.add('show-site');
    }, 800);
}

// --- NOVAS FUNÇÕES ---

// Função para revelar detalhes ao clicar (Ideal para Mobile)
function toggleDetails(card) {
    // Se o card já estiver ativo, ele fecha. Se não, ele abre e fecha os outros.
    const isActive = card.classList.contains('active');
    document.querySelectorAll('.product-card').forEach(c => c.classList.remove('active'));
    
    if (!isActive) {
        card.classList.add('active');
    }
}

// Função de Contato
function contatoWhatsApp(produto) {
    const numero = "55179XXXXXXXX"; // Seu número
    const msg = encodeURIComponent(`Olá Vitor! Tenho interesse no projeto: ${produto}`);
    window.open(`https://wa.me/${numero}?text=${msg}`, '_blank');
}

window.onload = runTerminal;
