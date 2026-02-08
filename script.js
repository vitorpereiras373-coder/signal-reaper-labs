function entrarNoLab() {
    const screen = document.getElementById('welcome-screen');
    const main = document.getElementById('main-site');
    
    screen.style.opacity = '0';
    setTimeout(() => {
        screen.style.display = 'none';
        main.classList.remove('hidden');
    }, 1000);
}
