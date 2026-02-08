document.getElementById('welcome-screen').addEventListener('click', function() {
    this.style.opacity = '0';
    setTimeout(() => {
        this.style.display = 'none';
        document.getElementById('main-content').classList.remove('hidden');
    }, 500);
});
