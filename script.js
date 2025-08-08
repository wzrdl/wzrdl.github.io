// ===== CYBERPUNK AI ENGINEER PORTFOLIO - INTERACTIVE SYSTEMS =====

// Global state management
const AppState = {
    isLoaded: false,
    currentSection: 'hero',
    particles: [],
    mouse: { x: 0, y: 0 },
    animations: {
        particleSystem: null,
        typewriter: null,
        skillBars: null
    }
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    console.log('> INITIALIZING CYBERPUNK PORTFOLIO SYSTEM...');
    
    // Initialize core systems
    initCustomCursor();
    initParticleSystem();
    initSmoothScrolling();
    initNavigationSystem();
    initSkillAnimations();
    initProjectModals();
    initTypewriterEffect();
    initGlitchEffects();
    initScrollAnimations();
    
    // Initialize external libraries
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        offset: 100
    });
    
    AppState.isLoaded = true;
    console.log('> SYSTEM INITIALIZATION COMPLETE');
    
    // Add loading complete class
    document.body.classList.add('loaded');
}

// ===== CUSTOM CURSOR SYSTEM =====
function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!cursor || !cursorTrail) return;
    
    let mouseX = 0, mouseY = 0;
    let lastMouseX = 0, lastMouseY = 0;
    let velocityX = 0, velocityY = 0;
    
    // Use pointer events for better performance
    document.addEventListener('pointermove', (e) => {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Calculate velocity for smooth trail
        velocityX = mouseX - lastMouseX;
        velocityY = mouseY - lastMouseY;
        
        AppState.mouse.x = mouseX;
        AppState.mouse.y = mouseY;
    }, { passive: true });
    
    function updateCursor() {
        // Main cursor follows mouse directly with no delay
        cursor.style.left = mouseX - 10 + 'px';
        cursor.style.top = mouseY - 10 + 'px';
        
        // Trail follows with minimal delay using velocity-based prediction
        const trailOffsetX = velocityX * 0.3;
        const trailOffsetY = velocityY * 0.3;
        cursorTrail.style.left = (mouseX - 20 + trailOffsetX) + 'px';
        cursorTrail.style.top = (mouseY - 20 + trailOffsetY) + 'px';
        
        // Decay velocity for smooth movement
        velocityX *= 0.8;
        velocityY *= 0.8;
        
        requestAnimationFrame(updateCursor);
    }
    
    updateCursor();
    
    // Cursor interactions with optimized event handling
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .nav-link');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorTrail.style.transform = 'scale(1.2)';
            cursor.style.backgroundColor = '#FF007A';
        }, { passive: true });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorTrail.style.transform = 'scale(1)';
            cursor.style.backgroundColor = '#03D8F3';
        }, { passive: true });
    });
}

// ===== PARTICLE SYSTEM =====
function initParticleSystem() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);
    
    // Canvas setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.connections = [];
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Boundary collision
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            // Mouse interaction
            const dx = AppState.mouse.x - this.x;
            const dy = AppState.mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx += dx * force * 0.001;
                this.vy += dy * force * 0.001;
            }
            
            // Velocity dampening
            this.vx *= 0.99;
            this.vy *= 0.99;
        }
        
        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#03D8F3';
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#03D8F3';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
    
    // Create particles
    for (let i = 0; i < 100; i++) {
        AppState.particles.push(new Particle());
    }
    
    // Connection system
    function drawConnections(ctx) {
        for (let i = 0; i < AppState.particles.length; i++) {
            for (let j = i + 1; j < AppState.particles.length; j++) {
                const dx = AppState.particles[i].x - AppState.particles[j].x;
                const dy = AppState.particles[i].y - AppState.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const opacity = (150 - distance) / 150 * 0.3;
                    ctx.save();
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = '#03D8F3';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(AppState.particles[i].x, AppState.particles[i].y);
                    ctx.lineTo(AppState.particles[j].x, AppState.particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        AppState.particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });
        
        // Draw connections
        drawConnections(ctx);
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// ===== SMOOTH SCROLLING SYSTEM =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation
                updateActiveNavigation(this.getAttribute('href').substring(1));
            }
        });
    });
}

// ===== NAVIGATION SYSTEM =====
function initNavigationSystem() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Intersection Observer for active section detection
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateActiveNavigation(entry.target.id);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    
    function updateActiveNavigation(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === activeId) {
                link.classList.add('active');
            }
        });
        AppState.currentSection = activeId;
    }
}

// ===== SKILL BAR ANIMATIONS =====
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.getAttribute('data-progress');
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// ===== PROJECT MODAL SYSTEM =====
function initProjectModals() {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const closeBtn = document.querySelector('.modal-close');
    const projectLinks = document.querySelectorAll('.project-link');
    
    // Project data
    const projectData = {
        'medical-optimizer': {
            title: 'Medical Prompt Optimizer',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Designed an advanced algorithm for automatically optimizing medical prompts using text-based gradient descent and momentum with Bayesian reverse validation. This system significantly boosts LLM performance on medical Q&A datasets.</p>
                    
                    <h4>Technical Architecture</h4>
                    <ul>
                        <li><strong>Optimization Engine:</strong> Text-based gradient descent with momentum</li>
                        <li><strong>Validation System:</strong> Bayesian reverse validation for robustness</li>
                        <li><strong>LangChain Integration:</strong> Advanced prompt-engineering patterns</li>
                        <li><strong>Production API:</strong> Flask REST API with versioned prompt history</li>
                        <li><strong>Frontend Dashboard:</strong> Next.js dashboard with live streaming</li>
                    </ul>
                    
                    <h4>Key Achievements</h4>
                    <ul>
                        <li><span class="highlight">20% relative improvement</span> over CoT baseline on MedQA & PubMedQA</li>
                        <li>Production-grade AI microservice deployment</li>
                        <li>Dynamic system/instruction templates with function-calling</li>
                        <li>RAG fallback mechanisms for enhanced reliability</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">LangChain</span>
                        <span class="tech-tag">PyTorch</span>
                        <span class="tech-tag">Flask</span>
                        <span class="tech-tag">Next.js</span>
                        <span class="tech-tag">Bayesian Optimization</span>
                    </div>
                </div>
            `
        },
        'btree-db': {
            title: 'B+Tree Database Engine',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Designed and implemented a comprehensive mini-RDBMS in C++ featuring an order-3 B+Tree storage engine, buffer pool management, secondary indexes, and Write-Ahead Logging (WAL) for ACID compliance.</p>
                    
                    <h4>Core Components</h4>
                    <ul>
                        <li><strong>B+Tree Storage Engine:</strong> Order-3 B+Tree for O(log n) query performance</li>
                        <li><strong>Buffer Pool Manager:</strong> Efficient memory management with LRU eviction</li>
                        <li><strong>WAL System:</strong> Write-Ahead Logging for crash recovery</li>
                        <li><strong>Query Processor:</strong> SQL-style query execution engine</li>
                        <li><strong>Secondary Indexes:</strong> Multiple index support for complex queries</li>
                    </ul>
                    
                    <h4>Features</h4>
                    <ul>
                        <li>Interactive SQL shell with 15 SQL-style commands</li>
                        <li>Support for SELECT, JOIN, INSERT, UPDATE, DELETE operations</li>
                        <li>Python ETL pipeline for bulk-loading CSV data</li>
                        <li>Reproducible Makefile builds with comprehensive testing</li>
                        <li><span class="highlight">90%+ unit test coverage</span></li>
                    </ul>
                    
                    <h4>Performance Characteristics</h4>
                    <ul>
                        <li>O(log n) point and range queries</li>
                        <li>Efficient bulk loading from Google Maps CSV data</li>
                        <li>ACID transaction support with crash recovery</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">C++</span>
                        <span class="tech-tag">B+Tree</span>
                        <span class="tech-tag">SQL</span>
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">CMake</span>
                    </div>
                </div>
            `
        },
        'cuda-kmeans': {
            title: 'CUDA K-Means GPU Accelerator',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Built an open-source GPU kernel K-means accelerator in CUDA, achieving massive performance improvements by refactoring distance operations into sparse SpMM/SpMV operations using cuBLAS and cuSPARSE libraries.</p>
                    
                    <h4>Technical Innovation</h4>
                    <ul>
                        <li><strong>Sparse Matrix Operations:</strong> Converted distance calculations to sparse matrix multiplications</li>
                        <li><strong>GPU Memory Optimization:</strong> Efficient memory coalescing and bank conflict avoidance</li>
                        <li><strong>Library Integration:</strong> Leveraged cuBLAS and cuSPARSE for optimized operations</li>
                        <li><strong>Kernel Optimization:</strong> Custom CUDA kernels for centroid updates</li>
                    </ul>
                    
                    <h4>Performance Results</h4>
                    <ul>
                        <li><span class="highlight">1,000× speedup</span> compared to CPU implementation</li>
                        <li><span class="highlight">2.6× improvement</span> over dense CUDA baseline</li>
                        <li>Tested on MNIST and CIFAR-10 datasets</li>
                        <li>Scalable to large-scale clustering problems</li>
                    </ul>
                    
                    <h4>Optimization Techniques</h4>
                    <ul>
                        <li>Sparse matrix representation for distance calculations</li>
                        <li>Shared memory optimization for centroid caching</li>
                        <li>Warp-level primitives for efficient reductions</li>
                        <li>Stream-based processing for overlapped computation</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">CUDA</span>
                        <span class="tech-tag">cuBLAS</span>
                        <span class="tech-tag">cuSPARSE</span>
                        <span class="tech-tag">C++</span>
                        <span class="tech-tag">NVIDIA GPU</span>
                    </div>
                </div>
            `
        },
        'liars-bar': {
            title: "Liar's Bar: Bayesian Reinforcement Learning",
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Modeled Liar's Bar as an imperfect-information Bayesian game, solved for subgame-perfect Nash equilibria, and used those policies to warm-start a DQN agent for superior performance in multiplayer gaming scenarios.</p>
                    
                    <h4>Game Theory Foundation</h4>
                    <ul>
                        <li><strong>Bayesian Game Modeling:</strong> Imperfect information game representation</li>
                        <li><strong>Nash Equilibria:</strong> Computed subgame-perfect equilibrium strategies</li>
                        <li><strong>Belief State Tracking:</strong> Probabilistic opponent modeling</li>
                        <li><strong>Strategy Integration:</strong> Nash policies as DQN initialization</li>
                    </ul>
                    
                    <h4>Reinforcement Learning</h4>
                    <ul>
                        <li><strong>DQN Architecture:</strong> Deep Q-Network with experience replay</li>
                        <li><strong>Warm-Start Training:</strong> Nash equilibrium policy initialization</li>
                        <li><strong>Opponent Modeling:</strong> Adaptive strategies for multiple players</li>
                        <li><strong>Reward Engineering:</strong> Shaped rewards for strategic gameplay</li>
                    </ul>
                    
                    <h4>Production System</h4>
                    <ul>
                        <li>Flask + PostgreSQL microservice architecture</li>
                        <li>Kubernetes auto-scaling for multiplayer sessions</li>
                        <li>Real-time game state synchronization</li>
                        <li><span class="highlight">12% win-rate improvement</span> over baseline bots in 10k simulations</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">Deep Q-Networks</span>
                        <span class="tech-tag">Bayesian Games</span>
                        <span class="tech-tag">Flask</span>
                        <span class="tech-tag">PostgreSQL</span>
                        <span class="tech-tag">Kubernetes</span>
                    </div>
                </div>
            `
        },
        'yolo-aimbot': {
            title: 'YOLO Aimbot System',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Developed a high-performance real-time object detection system using YOLOv8 optimized with TensorRT and CUDA Graphs for gaming applications, achieving exceptional frame rates and accuracy.</p>
                    
                    <h4>Performance Optimization</h4>
                    <ul>
                        <li><strong>TensorRT Integration:</strong> Deep learning inference optimization</li>
                        <li><strong>CUDA Graphs:</strong> GPU kernel launch overhead reduction</li>
                        <li><strong>Memory Management:</strong> Zero-copy operations and pinned memory</li>
                        <li><strong>Pipeline Optimization:</strong> Asynchronous processing workflows</li>
                    </ul>
                    
                    <h4>System Architecture</h4>
                    <ul>
                        <li><strong>Real-time Capture:</strong> High-speed screen capture system</li>
                        <li><strong>Object Detection:</strong> YOLOv8 with custom training on game data</li>
                        <li><strong>Target Tracking:</strong> Kalman filter-based trajectory prediction</li>
                        <li><strong>Desktop Overlay:</strong> Lightweight visualization system</li>
                    </ul>
                    
                    <h4>Performance Metrics</h4>
                    <ul>
                        <li><span class="highlight">60 FPS</span> sustained performance on RTX 3060</li>
                        <li><span class="highlight">&lt;10ms</span> end-to-end latency</li>
                        <li><span class="highlight">0.89 mAP</span> accuracy on 1k test frames</li>
                        <li>Real-time target acquisition and tracking</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">YOLOv8</span>
                        <span class="tech-tag">TensorRT</span>
                        <span class="tech-tag">CUDA Graphs</span>
                        <span class="tech-tag">OpenCV</span>
                        <span class="tech-tag">Computer Vision</span>
                    </div>
                </div>
            `
        },
        'asset-optimizer': {
            title: 'Asset Allocation Optimizer',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Reformulated the Markowitz mean-variance problem into an L1-regularized SSMP model and solved it using a novel combination of Particle Swarm Optimization for global search and proximal fixed-point gradient methods for local refinement.</p>
                    
                    <h4>Mathematical Framework</h4>
                    <ul>
                        <li><strong>Problem Reformulation:</strong> L1-regularized Sharpe ratio maximization</li>
                        <li><strong>Dual Optimization:</strong> Global PSO + local gradient descent</li>
                        <li><strong>Risk Management:</strong> VaR and CVaR constraint integration</li>
                        <li><strong>Regularization:</strong> Sparsity-inducing penalties for portfolio concentration</li>
                    </ul>
                    
                    <h4>Optimization Strategy</h4>
                    <ul>
                        <li><strong>Particle Swarm Phase:</strong> Global exploration of solution space</li>
                        <li><strong>Fixed-Point Refinement:</strong> Local convergence to optimal solutions</li>
                        <li><strong>Constraint Handling:</strong> Penalty methods for investment constraints</li>
                        <li><strong>Multi-objective Optimization:</strong> Return vs. risk trade-off analysis</li>
                    </ul>
                    
                    <h4>Backtesting Results</h4>
                    <ul>
                        <li><span class="highlight">2.6× return improvement</span> vs. vanilla MV solver</li>
                        <li>5-year historical backtesting period</li>
                        <li>Superior risk-adjusted returns (Sharpe ratio)</li>
                        <li>Reduced portfolio turnover and transaction costs</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">Particle Swarm Optimization</span>
                        <span class="tech-tag">Fixed Point Methods</span>
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">NumPy</span>
                        <span class="tech-tag">Quantitative Finance</span>
                    </div>
                </div>
            `
        }
    };
    
    // Open modal
    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const project = projectData[projectId];
            
            if (project) {
                modalTitle.textContent = project.title;
                modalBody.innerHTML = project.content;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                
                // Add glitch effect to modal title
                modalTitle.classList.add('glitch');
                modalTitle.setAttribute('data-text', project.title);
            }
        });
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== TYPEWRITER EFFECT =====
function initTypewriterEffect() {
    const typewriterElement = document.querySelector('.typewriter-text');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            typewriterElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    // Start typewriter effect after a delay
    setTimeout(typeWriter, 1000);
}

// ===== GLITCH EFFECTS =====
function initGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        // Add random glitch intervals
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                element.style.animation = 'glitch 0.3s ease-in-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            }
        }, 2000);
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElement = document.querySelector('.particle-background');
        
        if (parallaxElement) {
            parallaxElement.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
        
        // Update navigation transparency
        const nav = document.querySelector('.nav-container');
        if (nav) {
            const opacity = Math.min(scrolled / 100, 0.95);
            nav.style.backgroundColor = `rgba(16, 20, 36, ${opacity})`;
        }
        
        // Floating animation for scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator && scrolled > 100) {
            scrollIndicator.style.opacity = '0';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ===== PERFORMANCE MONITORING =====
function initPerformanceMonitoring() {
    // FPS counter for development
    let frames = 0;
    let lastTime = performance.now();
    
    function countFPS() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            console.log(`FPS: ${Math.round((frames * 1000) / (currentTime - lastTime))}`);
            frames = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(countFPS);
    }
    
    // Only run in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        countFPS();
    }
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Reduced motion support
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        document.body.classList.add('reduced-motion');
        // Disable particle system for reduced motion
        AppState.particles = [];
    }
    
    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('click', () => {
        document.body.classList.remove('keyboard-nav');
    });
    
    // Focus management for modal
    const modal = document.getElementById('project-modal');
    if (modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusableElement = focusableElements[0];
        const lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
    // Could send to error tracking service in production
});

// ===== CONSOLE EASTER EGG =====
console.log(`
%c
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║  ░█████╗░██╗      ███████╗███╗   ██╗░██████╗░██╗███╗   ██╗███████╗███████╗██████╗  ║
║  ██╔══██╗██║      ██╔════╝████╗  ██║██╔════╝░██║████╗  ██║██╔════╝██╔════╝██╔══██╗ ║
║  ███████║██║      █████╗░░██╔██╗ ██║██║░░██╗░██║██╔██╗ ██║█████╗░░█████╗░░██████╔╝ ║
║  ██╔══██║██║      ██╔══╝░░██║╚██╗██║██║░░╚██╗██║██║╚██╗██║██╔══╝░░██╔══╝░░██╔══██╗ ║
║  ██║░░██║██║      ███████╗██║░╚████║╚██████╔╝██║██║░╚████║███████╗███████╗██║░░██║ ║
║  ╚═╝░░╚═╝╚═╝      ╚══════╝╚═╝░░╚═══╝░╚═════╝░╚═╝╚═╝░░╚═══╝╚══════╝╚══════╝╚═╝░░╚═╝ ║
║                                                                              ║
║                        ZIRUI WEN - AI ENGINEER PORTFOLIO                     ║
║                     > CYBERPUNK SYSTEMS ONLINE <                             ║
║                                                                              ║
║  Interested in the code? Check out the repository or get in touch!          ║
║  Email: wzrqczj@gmail.com                                                    ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`, 
'color: #03D8F3; font-family: monospace; font-size: 12px; text-shadow: 0 0 10px #03D8F3;'
);

// Initialize accessibility and performance monitoring
initAccessibilityFeatures();
initPerformanceMonitoring();
