// Game Page JavaScript

// Welcome Notification System
function showWelcomeNotification() {
    const notification = document.getElementById('welcomeNotification');
    if (notification) {
        const hasSeenNotification = localStorage.getItem('avox_welcome_seen');
        if (!hasSeenNotification) {
            notification.style.display = 'block';
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
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(showWelcomeNotification, 1000);
});

// Order Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('orderModal');
    const orderButtons = document.querySelectorAll('.btn-order');
    const closeModal = document.querySelector('.close-modal');
    const orderForm = document.getElementById('orderForm');
    const selectedPlanInput = document.getElementById('selectedPlan');

    // Redirect to login/signup page when order button is clicked
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'https://client.avox-hosting.com/index.php?rp=/login';
        });
    });

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(orderForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Show success message
            const submitButton = orderForm.querySelector('.btn-submit');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;
            
            // Simulate order processing
            setTimeout(() => {
                submitButton.textContent = '✓ Order Placed!';
                submitButton.style.background = 'linear-gradient(135deg, #00AA00 0%, #008800 100%)';
                
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    orderForm.reset();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.background = '';
                    
                    // Show success notification
                    showNotification('Order placed successfully! You will receive an email confirmation shortly.', 'success');
                }, 2000);
            }, 1500);
        });
    }

    // Animate elements on scroll
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

    // Observe pricing cards and feature items
    document.querySelectorAll('.pricing-card, .feature-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to pricing cards
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.08) translateY(-10px)' 
                : 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = this.classList.contains('featured') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
        });
    });
});

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00AA00 0%, #008800 100%)' : 'linear-gradient(135deg, var(--primary-red) 0%, #A00000 100%)'};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for anchor links
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

// Add parallax effect to game hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.game-hero');
    const particles = document.querySelector('.game-particles');
    
    if (hero && particles && scrolled < window.innerHeight) {
        particles.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to game title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add counter animation to pricing
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

