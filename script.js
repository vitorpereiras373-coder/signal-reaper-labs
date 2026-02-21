// Função para obter data e hora formatada
const getDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString('pt-BR') + " " + now.toLocaleTimeString('pt-BR');
};

// Gera um IP aleatório para simular um scan
const randomIP = () => {
    return `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
};

// Conteúdo que será digitado no terminal
const pentestLines = [
    `> BOOT_SEQUENCE: ${getDateTime()}`,
    `> LOCAL_HOST_IP: ${randomIP()}`,
    "> MOUNTING MARAUDER... OK",
    "> INTERFACE: wlan0mon (MONITOR MODE)",
    "> SCANNING FREQUENCIES [2.4GHz]...",
    "> PACKET_INJECTION: ENABLED",
    "> TUNNELING ENCRYPTED SESSION...",
    "> STATUS: SYSTEM ONLINE.",
    "> READY_FOR_EXPLOIT."
];

let lineIdx = 0;

// Função que escreve as linhas uma a uma
function runTerminal() {
    const content = document.getElementById("terminal-content");
    if (content && lineIdx < pentestLines.length) {
        const line = document.createElement("div");
        line.style.marginBottom = "4px";
        line.innerHTML = pentestLines[lineIdx];
        content.appendChild(line);
        lineIdx++;
        
        const box = document.querySelector(".terminal-box");
        box.scrollTop = box.scrollHeight;

        setTimeout(runTerminal, 600); 
    }
}

// Função para fazer a transição de tela ao clicar
function iniciarLab() {
    const screen = document.getElementById('welcome-screen');
    const main = document.getElementById('main-site');
    
    // Animação de subida
    screen.style.transform = 'translateY(-100%)';
    
    setTimeout(() => {
        screen.classList.add('hidden');
        main.classList.add('show-site');
        window.scrollTo(0, 0);
    }, 800);
}

// Inicia o terminal ao carregar a janela
window.onload = runTerminal;
