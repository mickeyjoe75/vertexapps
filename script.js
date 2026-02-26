/* =========================================
   Vertex Apps — Script
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // --- Network Canvas Background ---
    const canvas = document.getElementById('network-canvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initNodes() {
        nodes = [];
        const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 25000));
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                r: Math.random() * 1.5 + 0.5
            });
        }
    }

    function drawNetwork() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const maxDist = 180;

        // Move nodes
        nodes.forEach(n => {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
            if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
        });

        // Draw connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = (1 - dist / maxDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw nodes
        nodes.forEach(n => {
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
            ctx.fill();
        });

        animFrame = requestAnimationFrame(drawNetwork);
    }

    resizeCanvas();
    initNodes();
    drawNetwork();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initNodes();
    });

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // --- Mobile nav ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // --- Animated counters ---
    const counters = document.querySelectorAll('.metric');
    let countersStarted = false;

    function animateCounters() {
        counters.forEach(metric => {
            const target = parseInt(metric.dataset.count);
            const el = metric.querySelector('.counter');
            const bar = metric.querySelector('.metric-bar span');
            const duration = 2000;
            const start = performance.now();

            bar.style.width = '100%';

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.round(target * eased);
                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    }

    // --- Skill bars ---
    let skillsAnimated = false;
    function animateSkills() {
        document.querySelectorAll('.skill-row').forEach((row, i) => {
            const level = row.dataset.level;
            const fill = row.querySelector('.skill-fill');
            setTimeout(() => { fill.style.width = level + '%'; }, i * 80);
        });
    }

    // --- Intersection Observer ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Counters
            if (entry.target.classList.contains('hero-metrics') && !countersStarted) {
                countersStarted = true;
                animateCounters();
            }

            // Skills
            if (entry.target.id === 'expertise' && !skillsAnimated) {
                skillsAnimated = true;
                animateSkills();
            }

            // Cards
            if (entry.target.classList.contains('service-card') || entry.target.classList.contains('exp-card')) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Observe
    document.querySelectorAll('.hero-metrics, #expertise, .service-card, .exp-card').forEach(el => {
        observer.observe(el);
    });

    // Stagger service cards
    document.querySelectorAll('.service-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.08) + 's';
        card.style.transitionDuration = '0.5s';
        card.style.transitionProperty = 'opacity, transform, border-color, box-shadow';
    });

    // Stagger experience cards
    document.querySelectorAll('.exp-card').forEach((card, i) => {
        card.style.transitionDelay = (i * 0.08) + 's';
        card.style.transitionDuration = '0.5s';
        card.style.transitionProperty = 'opacity, transform, border-color';
    });

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
