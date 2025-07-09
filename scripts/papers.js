// Papers Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Search functionality for publications
    const searchInput = document.querySelector('.search-input');
    const publicationCards = document.querySelectorAll('.publication-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            publicationCards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const authors = card.querySelector('.publication-authors').textContent.toLowerCase();
                const abstract = card.querySelector('.publication-abstract p').textContent.toLowerCase();
                const keywords = Array.from(card.querySelectorAll('.keyword')).map(k => k.textContent.toLowerCase()).join(' ');
                
                const matches = title.includes(searchTerm) || 
                              authors.includes(searchTerm) || 
                              abstract.includes(searchTerm) || 
                              keywords.includes(searchTerm);
                
                if (matches) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.display = 'none';
                    card.style.opacity = '0';
                }
            });
        });
    }

    // Filter functionality by publication type
    const filterButtons = document.querySelectorAll('.filter-button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            publicationCards.forEach(card => {
                const cardType = card.getAttribute('data-type');
                
                if (filterType === 'all' || cardType === filterType) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Add hover effects to publication cards
    publicationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = 'var(--md-elevation-3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'var(--md-elevation-1)';
        });
    });

    // Add click effects to action buttons
    const actionButtons = document.querySelectorAll('.publication-actions .btn-text');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
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
    document.querySelectorAll('.publication-card, .research-area-card, .metric-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add keyboard navigation for publication cards
    publicationCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const firstAction = this.querySelector('.publication-actions .btn-text');
                if (firstAction) {
                    firstAction.click();
                }
            }
        });
    });

    // Add citation metrics animation
    const metricNumbers = document.querySelectorAll('.metric-number');
    metricNumbers.forEach(metric => {
        const finalNumber = metric.textContent;
        const isPercentage = finalNumber.includes('%');
        const numericValue = parseInt(finalNumber.replace(/[^\d]/g, ''));
        
        if (!isNaN(numericValue)) {
            let currentValue = 0;
            const increment = numericValue / 50;
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= numericValue) {
                    currentValue = numericValue;
                    clearInterval(timer);
                }
                metric.textContent = isPercentage ? 
                    Math.floor(currentValue) + '%' : 
                    Math.floor(currentValue) + (finalNumber.includes('+') ? '+' : '');
            }, 30);
        }
    });

    // Add smooth scrolling for anchor links
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

    // Add loading state for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 100);
        });
    });

    // Add tooltip functionality for publication actions
    const tooltipElements = document.querySelectorAll('.publication-actions .btn-text');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.textContent.trim();
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'var(--md-on-surface)';
            tooltip.style.color = 'var(--md-surface)';
            tooltip.style.padding = '8px 12px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.opacity = '0';
            tooltip.style.transition = 'opacity 0.2s ease';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 10);
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });

    // Add responsive behavior for mobile
    function handleMobileLayout() {
        const isMobile = window.innerWidth <= 768;
        const publicationCards = document.querySelectorAll('.publication-card');
        
        publicationCards.forEach(card => {
            if (isMobile) {
                card.style.marginBottom = '24px';
            } else {
                card.style.marginBottom = '32px';
            }
        });
    }

    // Initial call and resize listener
    handleMobileLayout();
    window.addEventListener('resize', handleMobileLayout);

    // Add print styles for publications
    const printStyle = document.createElement('style');
    printStyle.textContent = `
        @media print {
            .nav-rail, .top-app-bar, .nav-drawer, .footer {
                display: none !important;
            }
            
            .main-content {
                margin-left: 0 !important;
                padding: 20px !important;
            }
            
            .publication-card {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .btn-text {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(printStyle);
}); 