document.addEventListener('DOMContentLoaded', () => {

    // PARTICLES
    (function initParticles() {
        const canvas = document.getElementById('particlesCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w, h, particles = [];
        function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);
        class Particle {
            constructor() { this.reset(); }
            reset() { this.x = Math.random() * w; this.y = Math.random() * h; this.size = Math.random() * 2 + 0.5; this.speedX = (Math.random() - 0.5) * 0.5; this.speedY = (Math.random() - 0.5) * 0.5; this.opacity = Math.random() * 0.5 + 0.1; }
            update() { this.x += this.speedX; this.y += this.speedY; if (this.x < 0 || this.x > w) this.speedX *= -1; if (this.y < 0 || this.y > h) this.speedY *= -1; }
            draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0, 212, 170, ' + this.opacity + ')'; ctx.fill(); }
        }
        for (let i = 0; i < 80; i++) particles.push(new Particle());
        function animate() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }
        animate();
    })();

    // BUBBLES BG
    (function() {
        const c = document.getElementById('bubbleContainer');
        if (!c) return;
        for (let i = 0; i < 12; i++) {
            const b = document.createElement('div');
            b.className = 'bubble-bg';
            const s = Math.random() * 80 + 30;
            b.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + (Math.random() * 100) + '%;animation-duration:' + (Math.random() * 10 + 12) + 's;animation-delay:' + (Math.random() * 15) + 's;';
            c.appendChild(b);
        }
    })();

    // NAVBAR
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navLinksC = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        sections.forEach(s => { const top = s.offsetTop - 150; if (window.scrollY >= top) current = s.getAttribute('id'); });
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
    });

    if (navToggle) {
        navToggle.addEventListener('click', () => { navToggle.classList.toggle('active'); navLinksC.classList.toggle('open'); });
        navLinks.forEach(l => l.addEventListener('click', () => { navToggle.classList.remove('active'); navLinksC.classList.remove('open'); }));
    }

    // THEME
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    const saved = localStorage.getItem('aquanexus-theme') || 'dark';
    html.setAttribute('data-theme', saved);
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('aquanexus-theme', next);
        });
    }

    // COUNTERS
    function animateCounters() {
        document.querySelectorAll('.stat-number').forEach(c => {
            const target = parseInt(c.getAttribute('data-target'));
            if (!target) return;
            let curr = 0;
            const inc = target / 40;
            (function update() {
                curr += inc;
                if (curr < target) { c.textContent = Math.floor(curr) + '+'; requestAnimationFrame(update); }
                else c.textContent = target + '+';
            })();
        });
    }
    const heroObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { animateCounters(); heroObs.disconnect(); } });
    }, { threshold: 0.3 });
    const hero = document.querySelector('.hero');
    if (hero) heroObs.observe(hero);

    // PRODUCTS STAGGER
    const prodObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), (parseInt(e.target.getAttribute('data-delay') || '0')) * 150);
                prodObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.produto-card').forEach(c => prodObs.observe(c));

    // FORM
    const form = document.getElementById('contatoForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.btn-submit');
            btn.innerHTML = '<i class="fas fa-check"></i> <span>Mensagem Enviada!</span>';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Enviar Mensagem</span>'; btn.style.background = ''; form.reset(); }, 3000);
        });
    }

    // ====== AQUAGAME ======
    (function() {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let fish = [], food = [], score = 0, timeLeft = 30, gameRunning = false, gameInterval = null, animFrame = null;
        const scoreEl = document.getElementById('gameScore');
        const fishEl = document.getElementById('gameFish');
        const timerEl = document.getElementById('gameTimer');
        const startBtn = document.getElementById('startGameBtn');

        class Fish {
            constructor() {
                this.x = Math.random() * (canvas.width - 60) + 30;
                this.y = Math.random() * (canvas.height - 60) + 30;
                this.size = Math.random() * 14 + 12;
                this.sx = (Math.random() - 0.5) * 2;
                this.sy = (Math.random() - 0.5) * 1.2;
                this.color = 'hsl(' + (Math.random() * 60 + 140) + ', 70%, 50%)';
                this.color2 = 'hsl(' + (Math.random() * 60 + 160) + ', 60%, 40%)';
                this.fed = false;
                this.wobble = Math.random() * Math.PI * 2;
                this.dir = 1;
            }
            update() {
                this.wobble += 0.02;
                this.x += this.sx;
                this.y += this.sy + Math.sin(this.wobble) * 0.5;
                if (this.x < 20 || this.x > canvas.width - 20) { this.sx *= -1; this.dir *= -1; }
                if (this.y < 20 || this.y > canvas.height - 20) this.sy *= -1;
                if (!this.fed && food.length > 0) {
                    let closest = null, minDist = 200;
                    food.forEach(f => { const d = Math.sqrt((f.x - this.x) ** 2 + (f.y - this.y) ** 2); if (d < minDist) { minDist = d; closest = f; } });
                    if (closest) {
                        const dx = closest.x - this.x, dy = closest.y - this.y, dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > 5) {
                            this.sx += (dx / dist) * 0.08;
                            this.sy += (dy / dist) * 0.08;
                            const spd = Math.sqrt(this.sx * this.sx + this.sy * this.sy);
                            if (spd > 3) { this.sx = (this.sx / spd) * 3; this.sy = (this.sy / spd) * 3; }
                            this.dir = dx > 0 ? 1 : -1;
                        } else {
                            this.fed = true;
                            const idx = food.indexOf(closest);
                            if (idx > -1) food.splice(idx, 1);
                            score += 10;
                            updateHUD();
                            setTimeout(() => { this.fed = false; }, 2000);
                        }
                    }
                }
                this.sx *= 0.99;
                this.sy *= 0.99;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.dir, 1);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.7, 0);
                ctx.lineTo(-this.size * 1.3, -this.size * 0.5);
                ctx.lineTo(-this.size * 1.3, this.size * 0.5);
                ctx.closePath();
                ctx.fillStyle = this.color2;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.size * 0.4, -this.size * 0.1, this.size * 0.2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.size * 0.5, -this.size * 0.1, this.size * 0.1, 0, Math.PI * 2);
                ctx.fillStyle = '#111';
                ctx.fill();
                ctx.restore();
            }
        }

        class Food {
            constructor(x, y) { this.x = x; this.y = y; this.size = 4; this.life = 1; }
            update() { this.y += 0.3; this.life -= 0.003; if (this.life < 0) this.life = 0; }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(245, 158, 11, ' + this.life + ')';
                ctx.fill();
            }
        }

        function drawBg() {
            const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
            g.addColorStop(0, 'rgba(0, 212, 170, 0.08)');
            g.addColorStop(0.6, 'rgba(0, 212, 170, 0.03)');
            g.addColorStop(1, 'rgba(10, 14, 23, 0.6)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(0, 212, 170, 0.08)';
            ctx.beginPath();
            ctx.ellipse(canvas.width / 2, canvas.height - 10, canvas.width * 0.5, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            // Seaweed
            function seaweed(x, h, col, off) {
                ctx.beginPath();
                ctx.moveTo(x, canvas.height);
                for (let y = canvas.height; y > canvas.height - h; y -= 4) {
                    const sway = Math.sin((canvas.height - y) * 0.03 + Date.now() * 0.002 + off) * 8;
                    ctx.lineTo(x + sway, y);
                }
                ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.stroke();
            }
            seaweed(100, 80, 'rgba(0, 212, 170, 0.3)', 0);
            seaweed(250, 110, 'rgba(14, 165, 233, 0.25)', 1.5);
            seaweed(550, 90, 'rgba(0, 212, 170, 0.2)', -1);
            seaweed(700, 130, 'rgba(14, 165, 233, 0.2)', 2.5);
        }

        function initFish(n) { fish = []; for (let i = 0; i < n; i++) fish.push(new Fish()); }
        function updateHUD() { if (scoreEl) scoreEl.textContent = score; if (fishEl) fishEl.textContent = fish.length; if (timerEl) timerEl.textContent = timeLeft + 's'; }

        function gameOver() {
            gameRunning = false;
            if (gameInterval) { clearInterval(gameInterval); gameInterval = null; }
            if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 40px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = '24px Inter, sans-serif';
            ctx.fillStyle = '#00d4aa';
            ctx.fillText('Pontuacao Final: ' + score, canvas.width / 2, canvas.height / 2 + 30);
            if (startBtn) { startBtn.innerHTML = '<i class="fas fa-redo"></i> <span>Jogar Novamente</span>'; startBtn.disabled = false; }
        }

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBg();
            fish.forEach(f => { f.update(); f.draw(); });
            food = food.filter(f => f.life > 0 && f.y < canvas.height);
            food.forEach(f => { f.update(); f.draw(); });
            animFrame = requestAnimationFrame(gameLoop);
        }

        function startTimer() {
            if (gameInterval) clearInterval(gameInterval);
            gameInterval = setInterval(() => { timeLeft--; updateHUD(); if (timeLeft <= 0) { clearInterval(gameInterval); gameInterval = null; gameOver(); } }, 1000);
        }

        function startGame() {
            score = 0; timeLeft = 30; gameRunning = true; food = [];
            initFish(5);
            if (startBtn) { startBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Jogando...</span>'; startBtn.disabled = true; }
            updateHUD();
            if (animFrame) cancelAnimationFrame(animFrame);
            startTimer();
            gameLoop();
        }

        canvas.addEventListener('click', (e) => {
            if (!gameRunning) return;
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) * (canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (canvas.height / rect.height);
            for (let i = 0; i < 3; i++) food.push(new Food(x + (Math.random() - 0.5) * 20, y + (Math.random() - 0.5) * 10));
        });

        if (startBtn) startBtn.addEventListener('click', startGame);

        // Initial render
        initFish(5);
        function renderInit() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawBg();
            fish.forEach(f => { f.update(); f.draw(); });
            animFrame = requestAnimationFrame(renderInit);
        }
        renderInit();
    })();

    // SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    console.log('AquaNexus - Pronto!');
});