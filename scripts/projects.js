// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.project-card');
    const projectGallery = document.querySelector('.project-gallery');

    // Initialize filtering
    function initFiltering() {
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active chip
                filterChips.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                
                // Filter projects
                filterProjects(filter);
            });
        });
    }

    // Filter projects based on category
    function filterProjects(category) {
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-categories').split(',');
            const isVisible = category === 'all' || categories.includes(category);
            
            if (isVisible) {
                card.classList.remove('hidden', 'fade-out');
                card.classList.add('visible');
                visibleCount++;
            } else {
                card.classList.add('fade-out');
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        });
        
        // Update gallery state
        if (visibleCount === 0) {
            projectGallery.classList.add('empty');
        } else {
            projectGallery.classList.remove('empty');
        }
        
        // Add animation delay for visible cards
        const visibleCards = document.querySelectorAll('.project-card:not(.hidden)');
        visibleCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Initialize filtering
    initFiltering();

    // Add search functionality
    function addSearchFunctionality() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search projects...';
        searchInput.className = 'search-input';
        
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.appendChild(searchInput);
        
        const filterBar = document.querySelector('.filter-bar');
        filterBar.appendChild(searchContainer);
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            projectCards.forEach(card => {
                const title = card.querySelector('h2').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const tech = Array.from(card.querySelectorAll('.tech-chip'))
                    .map(chip => chip.textContent.toLowerCase())
                    .join(' ');
                
                const matches = title.includes(searchTerm) || 
                              description.includes(searchTerm) || 
                              tech.includes(searchTerm);
                
                if (matches) {
                    card.classList.remove('hidden', 'fade-out');
                    card.classList.add('visible');
                } else {
                    card.classList.add('fade-out');
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    }

    // Add search functionality
    addSearchFunctionality();

    // Add project card interactions
    function addProjectInteractions() {
        projectCards.forEach(card => {
            // Add click to expand functionality
            const header = card.querySelector('.project-header');
            const description = card.querySelector('.project-description');
            
            if (header && description) {
                header.style.cursor = 'pointer';
                
                header.addEventListener('click', function() {
                    description.style.maxHeight = 
                        description.style.maxHeight ? null : description.scrollHeight + 'px';
                    card.classList.toggle('expanded');
                });
            }
            
            // Add hover effects for tech chips
            const techChips = card.querySelectorAll('.tech-chip');
            techChips.forEach(chip => {
                chip.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.05)';
                });
                
                chip.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        });
    }

    // Add project interactions
    addProjectInteractions();

    // Add keyboard navigation for filtering
    function addKeyboardNavigation() {
        filterChips.forEach((chip, index) => {
            chip.setAttribute('tabindex', '0');
            
            chip.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Add keyboard navigation
    addKeyboardNavigation();

    // Add project statistics
    function addProjectStats() {
        const statsContainer = document.createElement('div');
        statsContainer.className = 'project-stats';
        
        const totalProjects = projectCards.length;
        const categories = {};
        
        projectCards.forEach(card => {
            const cardCategories = card.getAttribute('data-categories').split(',');
            cardCategories.forEach(cat => {
                categories[cat] = (categories[cat] || 0) + 1;
            });
        });
        
        statsContainer.innerHTML = `
            <div class="stat-item">
                <span class="stat-number">${totalProjects}</span>
                <span class="stat-label">Total Projects</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">${Object.keys(categories).length}</span>
                <span class="stat-label">Categories</span>
            </div>
        `;
        
        const filterBar = document.querySelector('.filter-bar');
        filterBar.appendChild(statsContainer);
    }

    // Add project statistics
    addProjectStats();

    // Add CSS for new elements
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .search-container {
            margin-top: var(--spacing-3);
        }
        
        .search-input {
            width: 100%;
            max-width: 300px;
            padding: var(--spacing-2);
            border: 1px solid var(--md-outline-variant);
            border-radius: var(--radius-medium);
            font-size: 14px;
            background-color: var(--md-surface);
            color: var(--md-on-surface);
            transition: border-color 0.2s ease;
        }
        
        .search-input:focus {
            outline: none;
            border-color: var(--md-primary);
        }
        
        .project-stats {
            display: flex;
            gap: var(--spacing-4);
            margin-top: var(--spacing-3);
            padding-top: var(--spacing-3);
            border-top: 1px solid var(--md-outline-variant);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-number {
            display: block;
            font-size: 24px;
            font-weight: 700;
            color: var(--md-primary);
        }
        
        .stat-label {
            font-size: 12px;
            color: var(--md-on-surface-variant);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .project-card.expanded .project-description {
            max-height: none;
        }
        
        .project-description {
            max-height: 120px;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .project-stats {
                justify-content: center;
            }
            
            .search-input {
                max-width: 100%;
            }
        }
    `;
    document.head.appendChild(additionalStyles);

    // Add intersection observer for lazy loading
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe project cards
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add URL hash navigation
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetCard = document.getElementById(hash);
            if (targetCard) {
                setTimeout(() => {
                    targetCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    targetCard.style.animation = 'pulse 1s ease';
                }, 500);
            }
        }
    }

    // Handle hash navigation
    handleHashNavigation();

    // Add pulse animation for hash navigation
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(11, 87, 208, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(11, 87, 208, 0); }
            100% { box-shadow: 0 0 0 0 rgba(11, 87, 208, 0); }
        }
    `;
    document.head.appendChild(pulseStyle);

    console.log('Projects page initialized successfully!');
}); 