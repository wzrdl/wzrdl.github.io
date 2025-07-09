// Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation functionality
    const menuButton = document.getElementById('menuButton');
    const closeButton = document.getElementById('closeButton');
    const navDrawer = document.getElementById('navDrawer');
    const navDrawerOverlay = document.getElementById('navDrawerOverlay');

    // Open mobile navigation
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            navDrawer.classList.add('open');
            navDrawerOverlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile navigation
    function closeNavDrawer() {
        navDrawer.classList.remove('open');
        navDrawerOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    if (closeButton) {
        closeButton.addEventListener('click', closeNavDrawer);
    }

    if (navDrawerOverlay) {
        navDrawerOverlay.addEventListener('click', closeNavDrawer);
    }

    // Close navigation on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navDrawer.classList.contains('open')) {
            closeNavDrawer();
        }
    });

    // Smooth scrolling for anchor links
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

    // Active navigation highlighting
    function updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link, .nav-drawer-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    updateActiveNav();

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add loading animation for page transitions
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Page was loaded from back-forward cache
            document.body.style.opacity = '1';
        }
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project-card, .service-card, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple effect to all buttons
    document.querySelectorAll('.btn-filled, .btn-outlined').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .btn-filled, .btn-outlined {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Add scroll-based navigation highlighting
    let lastScrollTop = 0;
    const topAppBar = document.getElementById('topAppBar');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            if (topAppBar) {
                topAppBar.style.transform = 'translateY(-100%)';
            }
        } else {
            // Scrolling up
            if (topAppBar) {
                topAppBar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // Add loading state for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            // Add a small delay to show loading state
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(event) {
        // Tab navigation for accessibility
        if (event.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });

    // Add focus styles for keyboard navigation
    const focusStyle = document.createElement('style');
    focusStyle.textContent = `
        .keyboard-navigation .nav-link:focus,
        .keyboard-navigation .btn-filled:focus,
        .keyboard-navigation .btn-outlined:focus {
            outline: 2px solid var(--md-primary);
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(focusStyle);

    // Initialize tooltips for better UX
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            document.body.appendChild(tooltip);

            element.addEventListener('mouseenter', function(e) {
                const rect = element.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
                tooltip.style.opacity = '1';
            });

            element.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
            });
        });
    }

    // Add tooltip styles
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tooltip {
            position: fixed;
            background: var(--md-on-surface);
            color: var(--md-surface);
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10000;
            white-space: nowrap;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: var(--md-on-surface) transparent transparent transparent;
        }
    `;
    document.head.appendChild(tooltipStyle);

    // Initialize tooltips
    initTooltips();

    console.log('Portfolio website initialized successfully!');
}); 