// ===== PORTFOLIO MAIN SCRIPT =====
(function() {
    'use strict';

    // Elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    const typedText = document.getElementById('typed-text');

    // ===== TYPING EFFECT =====
    const phrases = ['Discord Bot Developer', 'Web Developer', 'Minecraft Server Admin'];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        if (!typedText) return;
        
        const current = phrases[phraseIndex];
        
        typedText.textContent = isDeleting 
            ? current.substring(0, charIndex--)
            : current.substring(0, charIndex++);
        
        let delay = isDeleting ? 40 : 100;
        
        if (!isDeleting && charIndex > current.length) {
            delay = 2000;
            isDeleting = true;
            charIndex = current.length;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }
        
        setTimeout(type, delay);
    }

    // ===== SCROLL HANDLER =====
    function onScroll() {
        const scrollY = window.scrollY;
        
        // Navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        
        // Back to top
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollY > 400);
        }
        
        // Animate skill bars
        document.querySelectorAll('.skill-bar').forEach(bar => {
            if (bar.dataset.animated) return;
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                bar.style.width = bar.dataset.width;
                bar.dataset.animated = 'true';
            }
        });

        // Fade in elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });

        // Update active nav
        document.querySelectorAll('section[id]').forEach(section => {
            const top = section.offsetTop - 100;
            const id = section.id;
            if (scrollY >= top) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    // ===== MOBILE MENU =====
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        document.querySelectorAll('.nav-link-mobile').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // ===== BACK TO TOP =====
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== PROJECT FILTER =====
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            document.querySelectorAll('.project-card').forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? 'block' : 'none';
            });
        });
    });

    // ===== CONTACT FORM =====
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;
            
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-check"></i> Terkirim!';
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', () => {
        // Start typing
        type();
        
        // Setup animated elements
        document.querySelectorAll('.skill-card, .project-card, .contact-item').forEach(el => {
            el.setAttribute('data-animate', 'true');
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s, transform 0.5s';
        });
        
        // Initial scroll check
        onScroll();
    });

    // ===== EVENTS =====
    window.addEventListener('scroll', onScroll, { passive: true });

})();
