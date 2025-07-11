// Skills Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills page functionality
    initSkillsPage();
});

function initSkillsPage() {
    // Add search functionality
    addSearchFunctionality();
    
    // Add skill filtering
    addSkillFiltering();
    
    // Add skill chip interactions
    addSkillChipInteractions();
    
    // Add learning path animations
    addLearningPathAnimations();
    
    // Add skill level indicators
    addSkillLevelIndicators();
    
    // Add intersection observer for animations
    addIntersectionObserver();
    
    // Add skill statistics
    addSkillStatistics();
    
    console.log('Skills page initialized successfully!');
}

function addSearchFunctionality() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'skills-search';
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search skills...';
    searchInput.className = 'search-input';
    
    searchContainer.appendChild(searchInput);
    
    // Insert search after the overview section
    const overviewSection = document.querySelector('.skills-overview');
    overviewSection.parentNode.insertBefore(searchContainer, overviewSection.nextSibling);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const skillChips = document.querySelectorAll('.skill-chip');
        
        skillChips.forEach(chip => {
            const skillName = chip.textContent.toLowerCase();
            const matches = skillName.includes(searchTerm);
            
            if (matches) {
                chip.style.display = 'inline-block';
                chip.style.opacity = '1';
            } else {
                chip.style.display = 'none';
                chip.style.opacity = '0';
            }
        });
        
        // Update category visibility
        updateCategoryVisibility();
    });
}

function addSkillFiltering() {
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'skills-filter';
    
    const filterButtons = [
        { text: 'All', category: 'all' },
        { text: 'Primary', category: 'primary' },
        { text: 'Languages', category: 'languages' },
        { text: 'AI/ML', category: 'ai-ml' },
        { text: 'Backend', category: 'backend' },
        { text: 'Frontend', category: 'frontend' }
    ];
    
    filterButtons.forEach(button => {
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-button';
        filterBtn.textContent = button.text;
        filterBtn.setAttribute('data-filter', button.category);
        
        if (button.category === 'all') {
            filterBtn.classList.add('active');
        }
        
        filterBtn.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.filter-button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Filter skills
            filterSkills(button.category);
        });
        
        filterContainer.appendChild(filterBtn);
    });
    
    // Insert filter after search
    const searchContainer = document.querySelector('.skills-search');
    searchContainer.parentNode.insertBefore(filterContainer, searchContainer.nextSibling);
}

function filterSkills(category) {
    const skillChips = document.querySelectorAll('.skill-chip');
    
    skillChips.forEach(chip => {
        let shouldShow = false;
        
        switch (category) {
            case 'all':
                shouldShow = true;
                break;
            case 'primary':
                shouldShow = chip.classList.contains('primary');
                break;
            case 'languages':
                shouldShow = isLanguageSkill(chip.textContent);
                break;
            case 'ai-ml':
                shouldShow = isAIMLSkill(chip.textContent);
                break;
            case 'backend':
                shouldShow = isBackendSkill(chip.textContent);
                break;
            case 'frontend':
                shouldShow = isFrontendSkill(chip.textContent);
                break;
        }
        
        if (shouldShow) {
            chip.style.display = 'inline-block';
            chip.style.opacity = '1';
        } else {
            chip.style.display = 'none';
            chip.style.opacity = '0';
        }
    });
    
    updateCategoryVisibility();
}

function isLanguageSkill(skillName) {
    const languages = ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL', 'R'];
    return languages.includes(skillName);
}

function isAIMLSkill(skillName) {
    const aiMlSkills = ['TensorFlow', 'PyTorch', 'Scikit-learn', 'OpenCV', 'NLP', 'LLM', 'LangChain', 'FAISS', 'Neo4j', 'Evolutionary Algorithms', 'Game Theory', 'Reinforcement Learning', 'Hypothesis Testing', 'RAG', 'Knowledge Graphs', 'Computer Vision', 'Deep Learning', 'Statistical Modeling', 'Time Series Analysis'];
    return aiMlSkills.includes(skillName);
}

function isBackendSkill(skillName) {
    const backendSkills = ['Flask', 'FastAPI', 'Spring Boot', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'REST API', 'GraphQL', 'Docker', 'Kubernetes', 'Microservices', 'API Design'];
    return backendSkills.includes(skillName);
}

function isFrontendSkill(skillName) {
    const frontendSkills = ['Vue.js', 'React Native', 'Next.js', 'Redux', 'Material-UI', 'React', 'Angular', 'Bootstrap', 'Tailwind CSS', 'Responsive Design', 'UI/UX Design'];
    return frontendSkills.includes(skillName);
}

function updateCategoryVisibility() {
    const categories = document.querySelectorAll('.skill-category');
    
    categories.forEach(category => {
        const visibleSkills = category.querySelectorAll('.skill-chip[style*="display: inline-block"]');
        const totalSkills = category.querySelectorAll('.skill-chip');
        
        if (visibleSkills.length === 0) {
            category.style.opacity = '0.3';
        } else {
            category.style.opacity = '1';
        }
    });
}

function addSkillChipInteractions() {
    const skillChips = document.querySelectorAll('.skill-chip');
    
    skillChips.forEach(chip => {
        // Add click to show details
        chip.addEventListener('click', function() {
            showSkillDetails(this.textContent);
        });
        
        // Add hover effects
        chip.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });
        
        chip.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add keyboard navigation
        chip.setAttribute('tabindex', '0');
        chip.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function showSkillDetails(skillName) {
    // Create skill details modal
    const modal = document.createElement('div');
    modal.className = 'skill-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${skillName}</h3>
                    <button class="close-modal">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="skill-info">
                        <p><strong>Category:</strong> ${getSkillCategory(skillName)}</p>
                        <p><strong>Proficiency:</strong> ${getSkillProficiency(skillName)}</p>
                        <p><strong>Experience:</strong> ${getSkillExperience(skillName)}</p>
                    </div>
                    <div class="skill-description">
                        <p>${getSkillDescription(skillName)}</p>
                    </div>
                    <div class="skill-projects">
                        <h4>Related Projects</h4>
                        <ul>
                            ${getRelatedProjects(skillName)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.textContent = `
        .skill-modal {
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
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .modal-content {
            background: var(--md-surface);
            border-radius: var(--radius-large);
            padding: var(--spacing-4);
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            z-index: 10001;
            box-shadow: var(--md-elevation-3);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
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
        
        .skill-info {
            margin-bottom: var(--spacing-3);
        }
        
        .skill-info p {
            margin-bottom: var(--spacing-1);
        }
        
        .skill-description {
            margin-bottom: var(--spacing-3);
        }
        
        .skill-projects h4 {
            margin-bottom: var(--spacing-2);
            color: var(--md-on-surface);
        }
        
        .skill-projects ul {
            list-style: none;
            padding: 0;
        }
        
        .skill-projects li {
            padding: var(--spacing-1) 0;
            border-bottom: 1px solid var(--md-outline-variant);
        }
        
        .skill-projects li:last-child {
            border-bottom: none;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                margin: var(--spacing-2);
                width: calc(100% - var(--spacing-4));
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

function getSkillCategory(skillName) {
    if (isLanguageSkill(skillName)) return 'Programming Languages';
    if (isAIMLSkill(skillName)) return 'AI & Machine Learning';
    if (isBackendSkill(skillName)) return 'Backend & Databases';
    if (isFrontendSkill(skillName)) return 'Frontend & UI';
    return 'Other';
}

function getSkillProficiency(skillName) {
    const primarySkills = ['Python', 'PyTorch', 'FastAPI', 'Vue.js', 'Docker', 'Pandas'];
    if (primarySkills.includes(skillName)) return 'Expert';
    return 'Intermediate';
}

function getSkillExperience(skillName) {
    const expertSkills = ['Python', 'PyTorch', 'FastAPI'];
    const intermediateSkills = ['Vue.js', 'Docker', 'Pandas', 'TensorFlow', 'Spring Boot'];
    
    if (expertSkills.includes(skillName)) return '3+ years';
    if (intermediateSkills.includes(skillName)) return '1-3 years';
    return 'Less than 1 year';
}

function getSkillDescription(skillName) {
    const descriptions = {
        'Python': 'Primary programming language for AI/ML development, data analysis, and backend services.',
        'PyTorch': 'Deep learning framework for building and training neural networks.',
        'FastAPI': 'Modern, fast web framework for building APIs with Python.',
        'Vue.js': 'Progressive JavaScript framework for building user interfaces.',
        'Docker': 'Containerization platform for deploying applications consistently.',
        'Pandas': 'Data manipulation and analysis library for Python.'
    };
    
    return descriptions[skillName] || 'A valuable skill in my technical toolkit.';
}

function getRelatedProjects(skillName) {
    const projects = {
        'Python': '<li>Automatic Prompt Optimization</li><li>Liar\'s Bar: Bayesian RL</li>',
        'PyTorch': '<li>Liar\'s Bar: Bayesian RL</li><li>NLP Toolkit</li>',
        'FastAPI': '<li>Automatic Prompt Optimization</li><li>E-commerce Recommendation System</li>',
        'Vue.js': '<li>E-commerce Recommendation System</li>',
        'Docker': '<li>Automatic Prompt Optimization</li><li>Time Series Dashboard</li>',
        'Pandas': '<li>Time Series Dashboard</li><li>Data Analysis Projects</li>'
    };
    
    return projects[skillName] || '<li>Various projects utilizing this technology</li>';
}

function addLearningPathAnimations() {
    const learningItems = document.querySelectorAll('.learning-item');
    
    learningItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        item.style.transitionDelay = `${index * 0.2}s`;
        
        // Animate on scroll
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(item);
    });
}

function addSkillLevelIndicators() {
    const skillChips = document.querySelectorAll('.skill-chip');
    
    skillChips.forEach(chip => {
        const skillName = chip.textContent;
        const level = getSkillProficiency(skillName).toLowerCase();
        chip.setAttribute('data-level', level);
    });
}

function addIntersectionObserver() {
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

    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(20px)';
        category.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(category);
    });
}

function addSkillStatistics() {
    // Add skill count to summary
    const skillChips = document.querySelectorAll('.skill-chip');
    const primarySkills = document.querySelectorAll('.skill-chip.primary');
    
    const totalSkills = skillChips.length;
    const primarySkillsCount = primarySkills.length;
    
    // Update summary stats
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[0]) {
        statNumbers[0].textContent = totalSkills;
    }
    
    // Add skill distribution chart (optional)
    addSkillDistributionChart(primarySkillsCount, totalSkills - primarySkillsCount);
}

function addSkillDistributionChart(primaryCount, secondaryCount) {
    const summaryCard = document.querySelector('.summary-card');
    if (!summaryCard) return;
    
    const chartContainer = document.createElement('div');
    chartContainer.className = 'skill-chart';
    chartContainer.innerHTML = `
        <h4>Skill Distribution</h4>
        <div class="chart-bars">
            <div class="chart-bar">
                <div class="bar-fill primary" style="width: ${(primaryCount / (primaryCount + secondaryCount)) * 100}%"></div>
                <span class="bar-label">Primary Skills</span>
            </div>
            <div class="chart-bar">
                <div class="bar-fill secondary" style="width: ${(secondaryCount / (primaryCount + secondaryCount)) * 100}%"></div>
                <span class="bar-label">Secondary Skills</span>
            </div>
        </div>
    `;
    
    summaryCard.appendChild(chartContainer);
    
    // Add chart styles
    const chartStyles = document.createElement('style');
    chartStyles.textContent = `
        .skill-chart {
            margin-top: var(--spacing-4);
            padding-top: var(--spacing-4);
            border-top: 1px solid var(--md-outline-variant);
        }
        
        .skill-chart h4 {
            margin-bottom: var(--spacing-3);
            color: var(--md-on-surface);
        }
        
        .chart-bars {
            display: flex;
            gap: var(--spacing-2);
        }
        
        .chart-bar {
            flex: 1;
            text-align: center;
        }
        
        .bar-fill {
            height: 8px;
            border-radius: var(--radius-full);
            margin-bottom: var(--spacing-1);
            transition: width 1s ease;
        }
        
        .bar-fill.primary {
            background: var(--md-primary);
        }
        
        .bar-fill.secondary {
            background: var(--md-outline);
        }
        
        .bar-label {
            font-size: 12px;
            color: var(--md-on-surface-variant);
        }
    `;
    document.head.appendChild(chartStyles);
} 