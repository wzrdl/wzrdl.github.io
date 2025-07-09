// Experience Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize experience page functionality
    initExperiencePage();
});

function initExperiencePage() {
    // Add intersection observer for animations
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

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe education cards
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Observe certification cards
    const certificationCards = document.querySelectorAll('.certification-card');
    certificationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Add hover effects for experience cards
    addExperienceCardInteractions();

    // Add education card interactions
    addEducationCardInteractions();

    // Add certification card interactions
    addCertificationCardInteractions();

    // Add timeline progress indicator
    addTimelineProgress();

    // Add smooth scrolling for section navigation
    addSectionNavigation();

    // Add print functionality
    addPrintFunctionality();

    console.log('Experience page initialized successfully!');
}

function addExperienceCardInteractions() {
    const experienceCards = document.querySelectorAll('.experience-card');
    
    experienceCards.forEach(card => {
        // Add click to expand functionality for achievements
        const achievementsList = card.querySelector('.achievements-list');
        if (achievementsList && achievementsList.children.length > 3) {
            const expandButton = document.createElement('button');
            expandButton.className = 'expand-button btn-text';
            expandButton.innerHTML = '<span class="material-symbols-outlined">expand_more</span> Show More';
            
            // Hide achievements beyond the first 3
            const achievements = Array.from(achievementsList.children);
            achievements.slice(3).forEach(item => {
                item.style.display = 'none';
            });
            
            achievementsList.parentNode.appendChild(expandButton);
            
            expandButton.addEventListener('click', function() {
                const hiddenItems = achievements.slice(3);
                const isExpanded = card.classList.contains('expanded');
                
                if (isExpanded) {
                    hiddenItems.forEach(item => {
                        item.style.display = 'none';
                    });
                    expandButton.innerHTML = '<span class="material-symbols-outlined">expand_more</span> Show More';
                    card.classList.remove('expanded');
                } else {
                    hiddenItems.forEach(item => {
                        item.style.display = 'block';
                    });
                    expandButton.innerHTML = '<span class="material-symbols-outlined">expand_less</span> Show Less';
                    card.classList.add('expanded');
                }
            });
        }

        // Add tech chip hover effects
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

function addEducationCardInteractions() {
    const educationCards = document.querySelectorAll('.education-card');
    
    educationCards.forEach(card => {
        // Add click to expand functionality for highlights
        const highlights = card.querySelectorAll('.highlight-chip');
        if (highlights.length > 3) {
            const expandButton = document.createElement('button');
            expandButton.className = 'expand-highlights btn-text';
            expandButton.innerHTML = '<span class="material-symbols-outlined">expand_more</span> More';
            
            const highlightsContainer = card.querySelector('.education-highlights');
            highlights.slice(3).forEach(chip => {
                chip.style.display = 'none';
            });
            
            highlightsContainer.appendChild(expandButton);
            
            expandButton.addEventListener('click', function() {
                const hiddenChips = highlights.slice(3);
                const isExpanded = card.classList.contains('highlights-expanded');
                
                if (isExpanded) {
                    hiddenChips.forEach(chip => {
                        chip.style.display = 'none';
                    });
                    expandButton.innerHTML = '<span class="material-symbols-outlined">expand_more</span> More';
                    card.classList.remove('highlights-expanded');
                } else {
                    hiddenChips.forEach(chip => {
                        chip.style.display = 'inline-block';
                    });
                    expandButton.innerHTML = '<span class="material-symbols-outlined">expand_less</span> Less';
                    card.classList.add('highlights-expanded');
                }
            });
        }

        // Add highlight chip hover effects
        const highlightChips = card.querySelectorAll('.highlight-chip');
        highlightChips.forEach(chip => {
            chip.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            chip.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    });
}

function addCertificationCardInteractions() {
    const certificationCards = document.querySelectorAll('.certification-card');
    
    certificationCards.forEach(card => {
        // Add click to view details functionality
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const issuer = this.querySelector('p').textContent;
            const date = this.querySelector('.certification-date').textContent;
            
            showCertificationDetails(title, issuer, date);
        });
        
        card.style.cursor = 'pointer';
    });
}

function showCertificationDetails(title, issuer, date) {
    // Create modal for certification details
    const modal = document.createElement('div');
    modal.className = 'certification-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <p><strong>Issuer:</strong> ${issuer}</p>
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Status:</strong> <span class="status-verified">Verified</span></p>
                </div>
                <div class="modal-footer">
                    <button class="btn-outlined">Download Certificate</button>
                    <button class="btn-filled">Verify Online</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .certification-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }
        
        .modal-content {
            background: var(--md-surface);
            border-radius: var(--radius-large);
            padding: var(--spacing-4);
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            z-index: 1;
            box-shadow: var(--md-elevation-3);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-3);
            padding-bottom: var(--spacing-2);
            border-bottom: 1px solid var(--md-outline-variant);
        }
        
        .close-modal {
            background: none;
            border: none;
            padding: var(--spacing-1);
            border-radius: var(--radius-medium);
            cursor: pointer;
            color: var(--md-on-surface);
        }
        
        .close-modal:hover {
            background-color: var(--md-state-hover);
        }
        
        .modal-body {
            margin-bottom: var(--spacing-3);
        }
        
        .modal-body p {
            margin-bottom: var(--spacing-2);
        }
        
        .status-verified {
            color: #4caf50;
            font-weight: 500;
        }
        
        .modal-footer {
            display: flex;
            gap: var(--spacing-2);
            justify-content: flex-end;
        }
        
        @media (max-width: 768px) {
            .modal-footer {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    // Close modal functionality
    const closeButton = modal.querySelector('.close-modal');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.remove();
        modalStyles.remove();
    }
    
    closeButton.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function addTimelineProgress() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // Create progress indicator
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'timeline-progress';
    timeline.appendChild(progressIndicator);
    
    // Add progress styles
    const progressStyles = document.createElement('style');
    progressStyles.textContent = `
        .timeline-progress {
            position: absolute;
            left: 20px;
            top: 0;
            width: 2px;
            background: var(--md-primary);
            transition: height 0.3s ease;
            z-index: 1;
        }
    `;
    document.head.appendChild(progressStyles);
    
    // Update progress on scroll
    function updateTimelineProgress() {
        const timelineRect = timeline.getBoundingClientRect();
        const timelineHeight = timelineRect.height;
        const scrollTop = window.pageYOffset;
        const timelineTop = timeline.offsetTop;
        
        const progress = Math.max(0, Math.min(1, (scrollTop - timelineTop + window.innerHeight) / timelineHeight));
        progressIndicator.style.height = `${progress * 100}%`;
    }
    
    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();
}

function addSectionNavigation() {
    // Create section navigation
    const sections = document.querySelectorAll('section');
    const navContainer = document.createElement('div');
    navContainer.className = 'section-nav';
    
    sections.forEach(section => {
        const navItem = document.createElement('button');
        navItem.className = 'section-nav-item';
        navItem.textContent = section.querySelector('h2').textContent;
        
        navItem.addEventListener('click', function() {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
        
        navContainer.appendChild(navItem);
    });
    
    // Insert navigation after the main heading
    const mainHeading = document.querySelector('.main-content h1');
    mainHeading.parentNode.insertBefore(navContainer, mainHeading.nextSibling);
    
    // Add navigation styles
    const navStyles = document.createElement('style');
    navStyles.textContent = `
        .section-nav {
            display: flex;
            gap: var(--spacing-2);
            margin-bottom: var(--spacing-4);
            flex-wrap: wrap;
        }
        
        .section-nav-item {
            background: var(--md-surface-container);
            border: 1px solid var(--md-outline-variant);
            padding: var(--spacing-1) var(--spacing-3);
            border-radius: var(--radius-full);
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            border: none;
        }
        
        .section-nav-item:hover {
            background: var(--md-state-hover);
            color: var(--md-on-surface);
        }
        
        .section-nav-item.active {
            background: var(--md-primary-container);
            color: var(--md-on-primary-container);
            border-color: var(--md-primary);
        }
        
        @media (max-width: 768px) {
            .section-nav {
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(navStyles);
    
    // Update active section on scroll
    function updateActiveSection() {
        const navItems = navContainer.querySelectorAll('.section-nav-item');
        const scrollTop = window.pageYOffset + 100;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionBottom) {
                navItems.forEach(item => item.classList.remove('active'));
                navItems[index].classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
}

function addPrintFunctionality() {
    // Add print button
    const printButton = document.createElement('button');
    printButton.className = 'print-button btn-outlined';
    printButton.innerHTML = '<span class="material-symbols-outlined">print</span> Print CV';
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(printButton, mainContent.firstChild);
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    // Add print button styles
    const printButtonStyles = document.createElement('style');
    printButtonStyles.textContent = `
        .print-button {
            margin-bottom: var(--spacing-4);
        }
        
        @media print {
            .print-button,
            .section-nav,
            .nav-rail,
            .top-app-bar,
            .nav-drawer,
            .footer {
                display: none !important;
            }
            
            .main-content {
                margin-left: 0 !important;
                padding: 0 !important;
            }
        }
    `;
    document.head.appendChild(printButtonStyles);
} 