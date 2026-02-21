// Escreve no terminal
const pentestLines = ["> BOOTING...", "> SIGNAL_REAPER_LABS", "> STATUS: ONLINE"];
let lineIdx = 0;

function runTerminal() {
    const content = document.getElementById("terminal-content");
    if (content && lineIdx < pentestLines.length) {
        content.innerHTML += `<div>${pentestLines[lineIdx]}</div>`;
        lineIdx++;
        setTimeout(runTerminal, 600);
    }
}

// Entra no site
function iniciarLab() {
    document.getElementById('welcome-screen').style.transform = 'translateY(-100%)';
    document.getElementById('main-site').classList.add('show-site');
    // Remove do DOM após a animação para não travar cliques
    setTimeout(() => {
        document.getElementById('welcome-screen').classList.add('hidden');
    }, 800);
}

// Alterna o Card
function toggleDetails(card) {
    card.classList.toggle('active');
}

// WhatsApp
function contatoWhatsApp(produto) {
    const msg = encodeURIComponent(`Tenho interesse no ${produto}`);
    window.open(`https://wa.me/55179XXXXXXXX?text=${msg}`, '_blank');
}

window.onload = runTerminal;
