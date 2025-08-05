// Projects Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Projects page loading...');
    
    // Filter functionality
    const filterChips = document.querySelectorAll('.filter-chip');
    const projectCards = document.querySelectorAll('.square-card');
    const projectGallery = document.querySelector('.project-gallery');
    
    console.log('Found filter chips:', filterChips.length);
    console.log('Found project cards:', projectCards.length);
    console.log('Found project gallery:', projectGallery);

    // Initialize filtering
    function initFiltering() {
        filterChips.forEach(chip => {
            chip.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                console.log('Filter clicked:', filter);
                
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
        console.log('Filtering by category:', category);
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-categories').split(',');
            const isVisible = category === 'all' || categories.includes(category);
            
            console.log('Card categories:', categories, 'Visible:', isVisible);
            
            if (isVisible) {
                card.style.display = 'block';
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        console.log('Visible projects:', visibleCount);
    }

    // Initialize filtering
    initFiltering();

    // Add project card interactions with expand/collapse functionality
    function addProjectInteractions() {
        projectCards.forEach(card => {
            // Add click to expand functionality
            const header = card.querySelector('.project-header');
            const description = card.querySelector('.project-description');
            
            if (header && description) {
                header.style.cursor = 'pointer';
                console.log('Adding expand functionality to card');
                
                header.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Header clicked, expanding/collapsing');
                    
                    // Check if this card is already expanded
                    const isExpanded = card.classList.contains('expanded');
                    
                    // First, collapse all other cards
                    projectCards.forEach(otherCard => {
                        if (otherCard !== card) {
                            collapseCard(otherCard);
                        }
                    });
                    
                    // Then toggle this card
                    if (isExpanded) {
                        collapseCard(card);
                    } else {
                        expandCard(card);
                    }
                });
            } else {
                console.log('Header or description not found for card');
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

    // 移除FLIP动画相关函数

    // Function to expand a card
    function expandCard(card) {
        const description = card.querySelector('.project-description');
        const projectGallery = document.querySelector('.project-gallery');
        
        card.classList.add('expanded');
        description.style.maxHeight = 'none';
        description.style.opacity = '1';
        
        // Move expanded card to the top-left position
        if (projectGallery && projectGallery.firstChild !== card) {
            projectGallery.insertBefore(card, projectGallery.firstChild);
        }
    }

    // Function to collapse a card
    function collapseCard(card) {
        const description = card.querySelector('.project-description');
        const projectGallery = document.querySelector('.project-gallery');
        
        card.classList.remove('expanded');
        description.style.maxHeight = '120px';
        description.style.opacity = '0.8';
        
        // Restore original order when collapsing
        const cardsArray = Array.from(projectGallery.children);
        cardsArray.sort((a, b) => {
            return parseInt(a.getAttribute('data-original-index') || '0') - parseInt(b.getAttribute('data-original-index') || '0');
        });
        cardsArray.forEach(cardEl => projectGallery.appendChild(cardEl));
        
        console.log('Card collapsed');
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

    // Add minimal CSS for functionality
    const additionalStyles = document.createElement('style');
    additionalStyles.textContent = `
        .hidden {
            display: none !important;
        }
    `;
    document.head.appendChild(additionalStyles);

    // Set original index for each card to restore order when collapsing
    projectCards.forEach((card, idx) => {
        card.setAttribute('data-original-index', idx);
    });

    console.log('Projects page initialized successfully!');
}); 