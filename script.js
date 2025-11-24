// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Button click handlers (Ripple Effect)
document.querySelectorAll('.btn-primary, .btn-plan, .btn-feature, .btn-login').forEach(button => {
    button.addEventListener('click', function (e) {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.plan-card, .feature-card, .auto-install-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Mobile menu toggle (for future mobile menu implementation)
const createMobileMenu = () => {
    if (window.innerWidth <= 768) {
        // Mobile menu can be added here if needed
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Support Chat Functions
function openSupportChat() {
    const chat = document.getElementById('supportChat');
    if (chat) {
        chat.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
    }
}
function closeSupportChat() {
    const chat = document.getElementById('supportChat');
    if (chat) {
        chat.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Welcome Notification System
function showWelcomeNotification() {
    const notification = document.getElementById('welcomeNotification');
    if (notification) {
        // Check if user has already seen the notification
        const hasSeenNotification = localStorage.getItem('avox_welcome_seen');
        if (!hasSeenNotification) {
            notification.style.display = 'block';
            // Mark as seen after 10 seconds
            setTimeout(() => {
                localStorage.setItem('avox_welcome_seen', 'true');
            }, 10000);
        }
    }
}

function closeWelcomeNotification() {
    const notification = document.getElementById('welcomeNotification');
    if (notification) {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.style.display = 'none';
            localStorage.setItem('avox_welcome_seen', 'true');
        }, 300);
    }
}

// Show notification on page load
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(showWelcomeNotification, 1000);
});

// Form handling and Redirects
const handleLoginClick = () => {
    window.location.href = 'https://client.avox-hosting.com/index.php?rp=/login';
};

document.querySelectorAll('.btn-login').forEach(btn => {
    btn.addEventListener('click', handleLoginClick);
});

// Make feature buttons redirect to panel as "Order/Install" actions
document.querySelectorAll('.btn-feature').forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = 'https://client.avox-hosting.com/index.php?rp=/login';
    });
});

// Optimized Parallax effect and Header Scroll
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroBg = document.querySelector('.hero-bg-image');

            if (heroBg && scrolled < window.innerHeight) {
                heroBg.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 + scrolled * 0.0005})`;
            }

            // Header scroll effect merged here for performance
            const header = document.querySelector('.header');
            if (header) {
                if (scrolled > 100) {
                    header.style.backgroundColor = 'rgba(10, 10, 10, 0.98)';
                    header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
                } else {
                    header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
                    header.style.boxShadow = 'none';
                }
            }

            ticking = false;
        });
        ticking = true;
    }
});

// Stats Counter Animation
const animateStats = () => {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseFloat(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps

        let current = 0;
        const updateCount = () => {
            current += step;
            if (current < target) {
                stat.innerText = Math.ceil(current).toLocaleString();
                requestAnimationFrame(updateCount);
            } else {
                stat.innerText = target.toLocaleString();
            }
        };

        updateCount();
    });
};

// Trigger stats animation when in view
const statsSection = document.querySelector('.stats-section');
let statsAnimated = false;

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Control Panel Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.panel-slide');

function showSlide(n) {
    if (slides.length === 0) return;
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function moveSlide(n) {
    showSlide(currentSlide + n);
}

// Auto-advance slider every 5 seconds
if (slides.length > 0) {
    setInterval(() => {
        moveSlide(1);
    }, 5000);
}
