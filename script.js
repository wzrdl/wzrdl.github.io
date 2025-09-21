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
        'recommendation-service': {
            title: 'Recommendation Service',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Built a Java Spring Boot (WebFlux) microservice for real-time recommendation with Apache Kafka streaming and Redis caching.</p>
                    
                    <h4>Technical Architecture</h4>
                    <ul>
                        <li><strong>Backend:</strong> Java Spring Boot (WebFlux) for reactive programming</li>
                        <li><strong>Streaming:</strong> Apache Kafka for real-time data processing</li>
                        <li><strong>Caching:</strong> Redis for low-latency feature storage</li>
                        <li><strong>ML Model:</strong> XGBoost4J with hot reload capability</li>
                    </ul>
                    
                    <h4>Infrastructure & Deployment</h4>
                    <ul>
                        <li>Containerized with Docker and deployed on Kubernetes using Helm</li>
                        <li>HPA (Horizontal Pod Autoscaling) enabled for dynamic scaling</li>
                        <li>Health probes and structured JSON logging</li>
                        <li>Metrics exported via Micrometer to Prometheus and visualized in Grafana</li>
                    </ul>
                    
                    <h4>CI/CD Pipeline</h4>
                    <ul>
                        <li>GitHub Actions CI/CD with Maven</li>
                        <li>Unit and integration tests using JUnit 5 and Testcontainers</li>
                        <li>Images built with Jib and shipped to container registry</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">Spring Boot</span>
                        <span class="tech-tag">Kafka</span>
                        <span class="tech-tag">Redis</span>
                        <span class="tech-tag">Kubernetes</span>
                        <span class="tech-tag">XGBoost4J</span>
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
        'kernel-kmeans': {
            title: 'Kernel K-Means GPU Accelerator',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Refactored kernel-Kmeans to sparse linear algebra, casting core steps as SpMM/SpMV operations, offloading to cuSPARSE/cuBLAS for massive performance gains.</p>
                    
                    <h4>Technical Innovation</h4>
                    <ul>
                        <li><strong>Sparse Matrix Operations:</strong> Converted distance calculations to sparse matrix multiplications</li>
                        <li><strong>GPU Memory Optimization:</strong> Efficient memory coalescing and bank conflict avoidance</li>
                        <li><strong>Library Integration:</strong> Leveraged cuBLAS and cuSPARSE for optimized operations</li>
                        <li><strong>Performance Tuning:</strong> Memory throughput and occupancy optimization</li>
                    </ul>
                    
                    <h4>Performance Results</h4>
                    <ul>
                        <li><span class="highlight">1000×</span> faster than CPU baseline</li>
                        <li><span class="highlight">2.6×</span> improvement over dense-GPU baselines</li>
                        <li>Tested on MNIST and CIFAR-10 datasets</li>
                        <li>Optimized for memory throughput and occupancy</li>
                    </ul>
                    
                    <h4>Implementation Details</h4>
                    <ul>
                        <li>Coalesced global memory accesses for optimal bandwidth</li>
                        <li>Shared memory tiling for data reuse</li>
                        <li>Register and SM balance optimization</li>
                        <li>Custom CUDA kernels for sparse operations</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">CUDA</span>
                        <span class="tech-tag">cuSPARSE</span>
                        <span class="tech-tag">cuBLAS</span>
                        <span class="tech-tag">C++</span>
                        <span class="tech-tag">GPU Computing</span>
                    </div>
                </div>
            `
        },
        'medical-optimizer': {
            title: 'Medical Prompt Optimizer',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Built a text-gradient + momentum prompt optimizer with Bayesian reverse validation for medical Q&A, improving MedQA/PubMedQA accuracy by 20% vs Chain-of-Thought.</p>
                    
                    <h4>Core Innovation</h4>
                    <ul>
                        <li><strong>Text-Gradient Optimization:</strong> Gradient-based prompt engineering</li>
                        <li><strong>Momentum Integration:</strong> Improved convergence stability</li>
                        <li><strong>Bayesian Validation:</strong> Reverse validation for robustness</li>
                        <li><strong>Medical Focus:</strong> Specialized for MedQA/PubMedQA datasets</li>
                    </ul>
                    
                    <h4>RAG Integration</h4>
                    <ul>
                        <li><strong>Hybrid Retrieval:</strong> BM25 + dense embeddings with RRF</li>
                        <li><strong>Cross-Encoder Reranker:</strong> Tightened answer relevance</li>
                        <li><strong>LangChain Service:</strong> Flask API + Next.js frontend</li>
                        <li><strong>Fallback System:</strong> Pragmatic RAG when optimization fails</li>
                    </ul>
                    
                    <h4>Evaluation & Monitoring</h4>
                    <ul>
                        <li><strong>RAGAS Metrics:</strong> Faithfulness, context precision/recall</li>
                        <li><strong>LangSmith Integration:</strong> Datasets and traces</li>
                        <li><strong>OpenTelemetry:</strong> Latency/QPS/errors dashboards</li>
                        <li><strong>gRPC Scoring:</strong> Low-latency path for critical calls</li>
                    </ul>
                    
                    <h4>Performance Results</h4>
                    <ul>
                        <li><span class="highlight">20% accuracy improvement</span> vs CoT baselines</li>
                        <li>Validated on MedQA and PubMedQA benchmarks</li>
                        <li>Robust performance across different medical domains</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">LangChain</span>
                        <span class="tech-tag">Flask API</span>
                        <span class="tech-tag">Next.js</span>
                        <span class="tech-tag">gRPC</span>
                        <span class="tech-tag">RAGAS</span>
                    </div>
                </div>
            `
        },
        'graphrag-pipeline': {
            title: 'GraphRAG Pipeline',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Architected a GraphRAG pipeline integrating Neo4j (Cypher) with FAISS dense retrieval via LangChain for neurology FAQ benchmark, achieving significant performance improvements.</p>
                    
                    <h4>Technical Architecture</h4>
                    <ul>
                        <li><strong>Graph Database:</strong> Neo4j with Cypher queries for structured data</li>
                        <li><strong>Vector Search:</strong> FAISS for dense retrieval operations</li>
                        <li><strong>Integration Layer:</strong> LangChain for seamless pipeline orchestration</li>
                        <li><strong>Evaluation Framework:</strong> RAGAS metrics for comprehensive assessment</li>
                    </ul>
                    
                    <h4>Data Pipeline</h4>
                    <ul>
                        <li><strong>Python ETL:</strong> Large-scale hypothesis testing on 10k+ patient records</li>
                        <li><strong>Vectorized Processing:</strong> Efficient ETL and hypothesis testing</li>
                        <li><strong>Statistical Analysis:</strong> Shapiro–Wilk, Chi-square testing</li>
                        <li><strong>Data Quality:</strong> De-identified patient record processing</li>
                    </ul>
                    
                    <h4>Model Integration</h4>
                    <ul>
                        <li><strong>LLM Fine-tuning:</strong> LLaMA-3 & Mistral-7B with LoRA</li>
                        <li><strong>Quantization:</strong> 8-bit quantized artifacts for inference</li>
                        <li><strong>Hugging Face Stack:</strong> Modern ML workflow integration</li>
                        <li><strong>Performance:</strong> +20% F1 on de-identified brain-science Q&A</li>
                    </ul>
                    
                    <h4>Performance Results</h4>
                    <ul>
                        <li><span class="highlight">+32% EM improvement</span> on neurology FAQ benchmark</li>
                        <li>RAGAS faithfulness and answer-relevance validation</li>
                        <li>Mean±95% CI confidence intervals</li>
                        <li>Cross-center validation for robustness</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">Neo4j</span>
                        <span class="tech-tag">FAISS</span>
                        <span class="tech-tag">LangChain</span>
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">RAGAS</span>
                    </div>
                </div>
            `
        },
        'ppo-seizure': {
            title: 'PPO Seizure Prediction',
            content: `
                <div class="modal-project-content">
                    <h4>Project Overview</h4>
                    <p>Built a custom RL environment and trained PPO for multi-step seizure-trajectory prediction, delivering superior performance compared to clinician-derived baselines.</p>
                    
                    <h4>Reinforcement Learning Approach</h4>
                    <ul>
                        <li><strong>PPO Algorithm:</strong> Proximal Policy Optimization for stable training</li>
                        <li><strong>Custom Environment:</strong> Specialized RL environment for seizure prediction</li>
                        <li><strong>Multi-step Prediction:</strong> Trajectory-based seizure forecasting</li>
                        <li><strong>Reward Engineering:</strong> Clinically-relevant reward functions</li>
                    </ul>
                    
                    <h4>Technical Implementation</h4>
                    <ul>
                        <li><strong>Environment Design:</strong> Custom gym-compatible RL environment</li>
                        <li><strong>State Representation:</strong> Patient data and temporal features</li>
                        <li><strong>Action Space:</strong> Seizure prediction and intervention recommendations</li>
                        <li><strong>Training Pipeline:</strong> Stable PPO implementation with hyperparameter tuning</li>
                    </ul>
                    
                    <h4>Performance Results</h4>
                    <ul>
                        <li><span class="highlight">+17% higher cumulative reward</span> vs clinician baselines</li>
                        <li>Improved seizure prediction accuracy</li>
                        <li>Better temporal prediction capabilities</li>
                        <li>Validated on real patient data</li>
                    </ul>
                    
                    <h4>Clinical Integration</h4>
                    <ul>
                        <li><strong>Baseline Comparison:</strong> Clinician-derived prediction methods</li>
                        <li><strong>Medical Validation:</strong> Real-world clinical data testing</li>
                        <li><strong>Interpretability:</strong> Explainable AI for medical decision support</li>
                        <li><strong>Safety Considerations:</strong> Robust prediction with uncertainty quantification</li>
                    </ul>
                    
                    <h4>Technologies Used</h4>
                    <div class="tech-stack">
                        <span class="tech-tag">PPO</span>
                        <span class="tech-tag">Reinforcement Learning</span>
                        <span class="tech-tag">Python</span>
                        <span class="tech-tag">PyTorch</span>
                        <span class="tech-tag">Custom RL Environment</span>
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
