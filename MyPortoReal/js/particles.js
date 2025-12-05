// ===== CLEAN PARTICLE BACKGROUND =====
(function() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(canvas);

    let particles = [];
    let mouseX = null;
    let mouseY = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 20000));
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around edges
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(96, 165, 250, ${p.opacity})`;
            ctx.fill();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }

            // Mouse interaction
            if (mouseX !== null && mouseY !== null) {
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.2 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }

    // Events
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('mouseout', () => { mouseX = null; mouseY = null; });

    // Init
    resize();
    animate();

    // Add gradient orbs
    const orbs = [
        { size: 500, x: '5%', y: '10%', color1: 'rgba(96, 165, 250, 0.07)', color2: 'transparent' },
        { size: 400, x: '85%', y: '60%', color1: 'rgba(139, 92, 246, 0.05)', color2: 'transparent' }
    ];

    orbs.forEach(orb => {
        const el = document.createElement('div');
        el.className = 'bg-orb';
        el.style.cssText = `
            position: absolute;
            width: ${orb.size}px;
            height: ${orb.size}px;
            left: ${orb.x};
            top: ${orb.y};
            background: radial-gradient(circle, ${orb.color1} 0%, ${orb.color2} 70%);
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            animation: orbFloat 25s ease-in-out infinite;
        `;
        container.appendChild(el);
    });

    // Add orb animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes orbFloat {
            0%, 100% { transform: translate(0, 0); }
            50% { transform: translate(30px, -20px); }
        }
    `;
    document.head.appendChild(style);
})();
