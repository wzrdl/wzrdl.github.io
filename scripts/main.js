// Main JavaScript for Zirui Wen's Personal Website

document.addEventListener('DOMContentLoaded', function() {
// Initialize all features
initLocalTime();
initScrollAnimations();
initSmoothScrolling();
initHeaderScrollEffect();
initTechGalleryDrag();
initVinylPlayer();
initFooterCTA();
initInertialScrolling();
initPreventBottomBounce();
});

// Local Time Display
function initLocalTime() {
    const timeElement = document.getElementById('local-time');
    if (!timeElement) return;

    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }

    // Update immediately and then every second
    updateTime();
    setInterval(updateTime, 1000);
}

// Scroll Animations
function initScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.experience-item, .project-card, .publication-item, .education-item, .tech-category'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}


// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('.header-bar').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header-bar');
    let lastScrollY = window.scrollY;
    
    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class based on scroll position
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }
    
    // Throttle scroll events for better performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    function onScroll() {
        requestTick();
        ticking = false;
    }
    
    window.addEventListener('scroll', onScroll, { passive: true });
}

// Utility Functions
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

// Inertial Scrolling Engine - Physics-based momentum scrolling
function initInertialScrolling() {
    // Check if user prefers reduced motion - disable inertia if true
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        console.log('Inertial scrolling disabled: user prefers reduced motion');
        return;
    }

    // Physics constants - tuned for responsive, controlled feel
    const FRICTION = 0.95;              // Deceleration factor (0.95 = 5% reduction per frame, stops faster)
    const VELOCITY_SCALE = 0.4;         // Multiplier for wheel input sensitivity (reduced for smaller scrolls)
    const MIN_VELOCITY = 0.2;           // Threshold to stop animation (prevents infinite tiny movements)
    const MAX_VELOCITY = 40;            // Cap maximum velocity for control (reduced from 100)
    const VELOCITY_SMOOTHING = 0.1;    // Weight for new velocity (reduced for more immediate response)
    
    // State management
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;
    let velocity = 0;
    let animationId = null;
    let isScrolling = false;
    let lastWheelTime = 0;
    let smoothedVelocity = 0;
    
    // High refresh rate support
    let lastFrameTime = performance.now();
    let deltaTime = 0;
    
    // Scroll bounds helper
    const getMaxScroll = () => {
        return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    };
    
    // Clamp value between min and max
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    
    // Stop ongoing animation
    const stopAnimation = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        isScrolling = false;
        velocity = 0;
        smoothedVelocity = 0;
    };
    
    // Core animation loop - optimized for high refresh rates (60fps+)
    const animate = (currentTime) => {
        // Calculate delta time for frame-rate independence
        deltaTime = currentTime - lastFrameTime;
        lastFrameTime = currentTime;
        
        // Normalize to 60fps baseline (deltaTime in ms, target is ~16.67ms)
        const timeScale = deltaTime / 16.67;
        
        // Apply friction to velocity (frame-rate independent)
        const adjustedFriction = Math.pow(FRICTION, timeScale);
        velocity *= adjustedFriction;
        smoothedVelocity *= adjustedFriction;
        
        // Stop if velocity is negligible
        if (Math.abs(velocity) < MIN_VELOCITY && Math.abs(smoothedVelocity) < MIN_VELOCITY) {
            stopAnimation();
            currentScrollY = Math.round(currentScrollY);
            window.scrollTo(0, currentScrollY);
            return;
        }
        
        // Update position based on velocity (frame-rate independent)
        currentScrollY += smoothedVelocity * timeScale;
        
        // Enforce scroll bounds with elastic resistance at edges
        const maxScroll = getMaxScroll();
        
        if (currentScrollY < 0) {
            // Top boundary - elastic resistance
            currentScrollY = currentScrollY * 0.5;
            velocity *= 0.5;
            smoothedVelocity *= 0.5;
        } else if (currentScrollY > maxScroll) {
            // Bottom boundary - elastic resistance
            const overshoot = currentScrollY - maxScroll;
            currentScrollY = maxScroll + (overshoot * 0.5);
            velocity *= 0.5;
            smoothedVelocity *= 0.5;
        }
        
        // Clamp to valid range
        currentScrollY = clamp(currentScrollY, 0, maxScroll);
        
        // Apply scroll position (optimized: avoid layout thrashing)
        window.scrollTo(0, currentScrollY);
        
        // Continue animation
        animationId = requestAnimationFrame(animate);
    };
    
    // Wheel event handler - captures scroll input
    const handleWheel = (e) => {
        e.preventDefault();
        
        const currentTime = Date.now();
        const timeDelta = currentTime - lastWheelTime;
        lastWheelTime = currentTime;
        
        // Calculate new velocity from wheel delta
        // Use deltaY for vertical scrolling
        let newVelocity = e.deltaY * VELOCITY_SCALE;
        
        // Detect scroll mode (pixel vs line vs page) and normalize
        if (e.deltaMode === 1) {
            // Line mode (Firefox, some trackpads)
            newVelocity *= 16;
        } else if (e.deltaMode === 2) {
            // Page mode
            newVelocity *= window.innerHeight;
        }
        
        // Cap velocity to prevent excessive speeds
        newVelocity = clamp(newVelocity, -MAX_VELOCITY, MAX_VELOCITY);
        
        // Quick successive scrolls should accumulate (feel responsive)
        if (timeDelta < 50) {
            velocity += newVelocity;
            velocity = clamp(velocity, -MAX_VELOCITY * 1.5, MAX_VELOCITY * 1.5);
        } else {
            velocity = newVelocity;
        }
        
        // Smooth velocity using exponential moving average
        smoothedVelocity = smoothedVelocity * (1 - VELOCITY_SMOOTHING) + velocity * VELOCITY_SMOOTHING;
        
        // Update current position to actual scroll position (handles interruptions)
        currentScrollY = window.scrollY;
        
        // Start animation if not already running
        if (!isScrolling) {
            isScrolling = true;
            lastFrameTime = performance.now();
            animationId = requestAnimationFrame(animate);
        }
    };
    
    // User scroll interruption - allows user to grab control
    const handleScroll = () => {
        // Only handle manual scrolls (not our programmatic ones)
        if (isScrolling) {
            const manualScrollDelta = Math.abs(window.scrollY - currentScrollY);
            
            // If user manually scrolled significantly, stop inertia
            if (manualScrollDelta > 5) {
                stopAnimation();
                currentScrollY = window.scrollY;
            }
        }
    };
    
    // Touch support - disable on touch devices to preserve native behavior
    let isTouchDevice = false;
    const detectTouch = () => {
        isTouchDevice = true;
        // Remove wheel listener on touch devices
        window.removeEventListener('wheel', handleWheel);
    };
    
    // Keyboard navigation support
    const handleKeydown = (e) => {
        // Allow keyboard navigation to interrupt inertia
        const scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', 'Space'];
        if (scrollKeys.includes(e.key) || scrollKeys.includes(e.code)) {
            stopAnimation();
        }
    };
    
    // Window resize handler
    const handleResize = debounce(() => {
        // Stop animation and recalculate on resize
        stopAnimation();
        currentScrollY = window.scrollY;
    }, 150);
    
    // Register event listeners
    // Use passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', detectTouch, { passive: true, once: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeydown, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        stopAnimation();
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('keydown', handleKeydown);
        window.removeEventListener('resize', handleResize);
    });
    
    // Performance monitoring (development only)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        let frameCount = 0;
        let lastFpsUpdate = performance.now();
        
        const monitorFPS = () => {
            if (isScrolling) {
                frameCount++;
                const now = performance.now();
                if (now - lastFpsUpdate >= 1000) {
                    console.log(`Scroll FPS: ${frameCount} | Refresh rate optimized`);
                    frameCount = 0;
                    lastFpsUpdate = now;
                }
            }
            requestAnimationFrame(monitorFPS);
        };
        
        monitorFPS();
    }
    
    console.log('Inertial scrolling initialized - high refresh rate optimized (60fps+)');
}

// Prevent elastic overscroll bounce at the very bottom of the page
function initPreventBottomBounce() {
    const isAtBottom = () => window.innerHeight + window.scrollY >= (document.documentElement.scrollHeight || document.body.scrollHeight) - 1;

    // Touch (mobile/iOS) - only prevent on touch devices
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!(e.touches && e.touches.length)) return;
        const dy = touchStartY - e.touches[0].clientY; // >0 means scrolling down
        if (isAtBottom() && dy > 0) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Contact Form Enhancement (if needed in future)
function initContactForm() {
    const contactButtons = document.querySelectorAll('.contact .btn');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Log performance metrics in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Performance:', {
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                    totalTime: perfData.loadEventEnd - perfData.fetchStart
                });
            }, 0);
        });
    }
}

// Error Handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Tech Gallery Manual Scroll with Drag - Seamless Loop
function initTechGalleryDrag() {
    const galleries = document.querySelectorAll('.tech-gallery');
    
    galleries.forEach(gallery => {
        const track = gallery.querySelector('.tech-scroll-track');
        if (!track) return;
        
        let currentX = 0;
        let isDragging = false;
        let isDown = false;
        let startX;
        let dragStartX;
        let trackWidth = 0;
        let itemWidth = 0;
        let totalItems = 0;
        let originalItems = 0;
        
        // Momentum scroll variables
        let velocity = 0;
        let lastX = 0;
        let lastTime = 0;
        let animationId = null;
        let isAnimating = false;
        
        // Initialize track measurements
        function initTrackMeasurements() {
            const items = track.querySelectorAll('.tech-item');
            originalItems = items.length;
            totalItems = originalItems;
            
            if (items.length > 0) {
                // Calculate item width including gap
                const firstItem = items[0];
                const rect = firstItem.getBoundingClientRect();
                const gap = parseFloat(getComputedStyle(track).gap) || 16;
                itemWidth = rect.width + gap;
                
                // Calculate total track width
                trackWidth = itemWidth * originalItems;
                
                // Always duplicate items for seamless infinite scroll
                // This ensures smooth scrolling experience for all categories
                duplicateItems();
            }
        }
        
        // Duplicate items for seamless infinite scroll
        function duplicateItems() {
            const items = track.querySelectorAll('.tech-item');
            const fragment = document.createDocumentFragment();
            
            // Clone all original items
            items.forEach(item => {
                const clone = item.cloneNode(true);
                fragment.appendChild(clone);
            });
            
            track.appendChild(fragment);
            totalItems = track.querySelectorAll('.tech-item').length;
            
            // Debug info (remove in production)
            console.log(`Tech category ${track.classList[1]}: ${originalItems} original items, ${totalItems} total items after duplication`);
        }
        
        // Momentum scroll animation
        function startMomentumScroll() {
            if (isAnimating) return;
            
            isAnimating = true;
            
            function animate() {
                if (Math.abs(velocity) < 0.1) {
                    // Stop animation when velocity is very low
                    isAnimating = false;
                    velocity = 0;
                    return;
                }
                
                // Apply velocity to position
                currentX += velocity;
                
                // Apply friction to reduce velocity
                velocity *= 0.95;
                
                // Normalize position for seamless loop
                while (currentX > 0) {
                    currentX -= trackWidth;
                }
                while (currentX <= -trackWidth) {
                    currentX += trackWidth;
                }
                
                // Update transform
                track.style.transform = `translateX(${currentX}px)`;
                
                // Continue animation
                animationId = requestAnimationFrame(animate);
            }
            
            animate();
        }
        
        // Stop momentum scroll
        function stopMomentumScroll() {
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            isAnimating = false;
            velocity = 0;
        }
        
        // Initialize measurements with a small delay to ensure DOM is ready
        setTimeout(() => {
            initTrackMeasurements();
        }, 100);
        
        // Recalculate measurements on window resize
        window.addEventListener('resize', debounce(() => {
            initTrackMeasurements();
        }, 250));
        
        // Mouse events for drag
        gallery.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = true;
            gallery.classList.add('active');
            startX = e.clientX;
            dragStartX = currentX;
            
            // Stop any existing momentum scroll
            stopMomentumScroll();
            
            // Reset velocity tracking
            lastX = e.clientX;
            lastTime = Date.now();
            velocity = 0;
            
            e.preventDefault();
        });
        
        gallery.addEventListener('mouseleave', () => {
            if (isDown) {
                isDown = false;
                isDragging = false;
                gallery.classList.remove('active');
                updatePositionAfterDrag();
            }
        });
        
        gallery.addEventListener('mouseup', () => {
            if (isDown) {
                isDown = false;
                isDragging = false;
                gallery.classList.remove('active');
                updatePositionAfterDrag();
                
                // Start momentum scroll if there's enough velocity
                if (Math.abs(velocity) > 0.5) {
                    startMomentumScroll();
                }
            }
        });
        
        gallery.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const newX = dragStartX + deltaX;
            track.style.transform = `translateX(${newX}px)`;
            
            // Calculate velocity for momentum scroll
            const currentTime = Date.now();
            const timeDelta = currentTime - lastTime;
            
            if (timeDelta > 0) {
                const distanceDelta = e.clientX - lastX;
                velocity = distanceDelta / timeDelta * 16; // Scale for smooth animation
                
                lastX = e.clientX;
                lastTime = currentTime;
            }
        });
        
        // Touch events for mobile
        gallery.addEventListener('touchstart', (e) => {
            isDown = true;
            isDragging = true;
            startX = e.touches[0].clientX;
            dragStartX = currentX;
            
            // Stop any existing momentum scroll
            stopMomentumScroll();
            
            // Reset velocity tracking
            lastX = e.touches[0].clientX;
            lastTime = Date.now();
            velocity = 0;
            
            e.preventDefault();
        });
        
        gallery.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const deltaX = e.touches[0].clientX - startX;
            const newX = dragStartX + deltaX;
            track.style.transform = `translateX(${newX}px)`;
            
            // Calculate velocity for momentum scroll
            const currentTime = Date.now();
            const timeDelta = currentTime - lastTime;
            
            if (timeDelta > 0) {
                const distanceDelta = e.touches[0].clientX - lastX;
                velocity = distanceDelta / timeDelta * 16; // Scale for smooth animation
                
                lastX = e.touches[0].clientX;
                lastTime = currentTime;
            }
        });
        
        gallery.addEventListener('touchend', () => {
            if (isDown) {
                isDown = false;
                isDragging = false;
                updatePositionAfterDrag();
                
                // Start momentum scroll if there's enough velocity
                if (Math.abs(velocity) > 0.5) {
                    startMomentumScroll();
                }
            }
        });
        
        // Update position after drag ends with seamless loop handling
        function updatePositionAfterDrag() {
            const transform = track.style.transform;
            const match = transform.match(/translateX\(([^)]+)px\)/);
            if (match) {
                currentX = parseFloat(match[1]);
                
                // Normalize position to stay within one complete loop
                while (currentX > 0) {
                    currentX -= trackWidth;
                }
                while (currentX <= -trackWidth) {
                    currentX += trackWidth;
                }
                
                track.style.transform = `translateX(${currentX}px)`;
            }
        }
        
        // Clean up animation on page unload
        window.addEventListener('beforeunload', () => {
            stopMomentumScroll();
        });
        
    });
}

// Enhanced Album Player with GSAP - Sample Work Section
function initVinylPlayer() {
    const vinylSection = document.querySelector('.projects-vinyl');
    if (!vinylSection) return;

    const projectItems = document.querySelectorAll('.project-item-vinyl');
    const albumItems = document.querySelectorAll('.album-item');
    
    if (projectItems.length === 0 || albumItems.length === 0) return;

    let currentActiveIndex = -1; // 初始化为-1，表示没有激活的项目
    let isTransitioning = false;

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // GSAP performance optimizations
    gsap.config({
        nullTargetWarn: false,
        trialWarn: false
    });
    
    // Set default ease for better performance
    gsap.defaults({
        ease: "power2.out"
    });

    // Rectangle card stack positions data
    const stackPositions = [
        { x: -10, y: -10, rotation: -2.5, z: 1 },
        { x: -6, y: -6, rotation: -1.2, z: 2 },
        { x: -3, y: -3, rotation: 0, z: 3 },
        { x: 0, y: 0, rotation: 1.2, z: 4 }
    ];

    // Initialize album stack with GSAP - all cards in stack position
    albumItems.forEach((item, index) => {
        const pos = stackPositions[index];
        gsap.set(item, {
            x: pos.x,
            y: pos.y,
            rotation: pos.rotation,
            zIndex: pos.z,
            scale: 1,
            filter: 'brightness(1)'
        });
    });

    // 活页夹式展开/收起动画 - 检测Sample Work区域
    const albumStack = document.querySelector('.album-stack');
    let isBinderOpen = false;
    
    ScrollTrigger.create({
        trigger: vinylSection,
        start: "top 50%",  // 当section顶部到达视口80%时
        end: "bottom 50%", // 当section底部离开视口20%时
        onEnter: () => {
            // 进入Sample Work区域 - 展开活页夹
            if (!isBinderOpen && albumStack) {
                albumStack.classList.remove('binder-closing');
                albumStack.classList.add('binder-opening', 'visible');
                isBinderOpen = true;
            }
        },
        onLeave: () => {
            // 向下离开Sample Work区域 - 收起活页夹
            if (isBinderOpen && albumStack) {
                albumStack.classList.remove('binder-opening', 'visible');
                albumStack.classList.add('binder-closing');
                isBinderOpen = false;
            }
        },
        onEnterBack: () => {
            // 向上返回Sample Work区域 - 展开活页夹
            if (!isBinderOpen && albumStack) {
                albumStack.classList.remove('binder-closing');
                albumStack.classList.add('binder-opening', 'visible');
                isBinderOpen = true;
            }
        },
        onLeaveBack: () => {
            // 向上离开Sample Work区域 - 收起活页夹
            if (isBinderOpen && albumStack) {
                albumStack.classList.remove('binder-opening', 'visible');
                albumStack.classList.add('binder-closing');
                isBinderOpen = false;
            }
        }
    });

    // Set up ScrollTrigger for each project
    // 激活区域：视口的20%-30%之间
    projectItems.forEach((item, index) => {
        ScrollTrigger.create({
            trigger: item,
            start: "center 85%",  // 当项目中心到达视口80%时（中线下20%）
            end: "center 40%",    // 当项目中心到达视口30%时（中线上30%）
            onEnter: () => {
                // 向下滚动进入激活区域
                if (index !== currentActiveIndex && !isTransitioning) {
                    switchToAlbum(index);
                }
            },
            onLeave: () => {
                // 向下滚动离开激活区域（项目中心超过30%线）
                if (index === currentActiveIndex) {
                    deactivateCurrentWork();
                }
            },
            onEnterBack: () => {
                // 向上滚动返回激活区域
                if (index !== currentActiveIndex && !isTransitioning) {
                    switchToAlbum(index);
                }
            },
            onLeaveBack: () => {
                // 向上滚动离开激活区域（项目中心低于80%线）
                if (index === currentActiveIndex) {
                    deactivateCurrentWork();
                }
            }
        });
    });

    // 取消当前激活的work
    function deactivateCurrentWork() {
        if (currentActiveIndex < 0) return; // 没有激活的项目
        
        const previousIndex = currentActiveIndex;
        
        // 移除所有active类
        projectItems.forEach((item) => {
            item.classList.remove('active');
        });
        
        // 将当前激活的album返回到堆叠
        if (albumItems[previousIndex]) {
            const currentAlbum = albumItems[previousIndex];
            const currentPos = stackPositions[previousIndex];
            
            gsap.to(currentAlbum, {
                x: currentPos.x,
                y: currentPos.y,
                rotation: currentPos.rotation,
                scale: 1,
                zIndex: currentPos.z,
                filter: 'brightness(1)',
                duration: 0.5,
                ease: "power2.out"
            });
            
            currentAlbum.classList.remove('active');
        }
        
        // 重置当前激活索引
        currentActiveIndex = -1;
    }

    // Optimized album card switching with GSAP timeline
    function switchToAlbum(index) {
        if (index === currentActiveIndex || isTransitioning) return;
        
        isTransitioning = true;
        
        // Update active project item - 明确地移除和添加active类
        projectItems.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        const nextAlbum = albumItems[index];
        
        if (!nextAlbum) {
            isTransitioning = false;
            return;
        }

        // Create optimized timeline
        const tl = gsap.timeline({
            onComplete: () => {
                currentActiveIndex = index;
                isTransitioning = false;
            }
        });

        // If there's a previously active album, return it to stack
        if (currentActiveIndex >= 0 && albumItems[currentActiveIndex]) {
            const currentAlbum = albumItems[currentActiveIndex];
            const currentPos = stackPositions[currentActiveIndex];
            
            tl.to(currentAlbum, {
                x: currentPos.x,
                y: currentPos.y,
                rotation: currentPos.rotation,
                scale: 1,
                zIndex: currentPos.z,
                filter: 'brightness(1)',
                duration: 0.5,
                ease: "power2.out"
            });
            
            currentAlbum.classList.remove('active');
        }

        // Extract next album
        tl.to(nextAlbum, {
            x: 0,
            y: -30,
            rotation: 0,
            scale: 1.15,
            zIndex: 20,
            filter: 'brightness(1)',
            duration: 0.6,
            ease: "back.out(1.7)"
        }, currentActiveIndex >= 0 ? "-=0.2" : "0");

        // Update classes
        nextAlbum.classList.add('active');
    }


    // Optimized hover effects with GSAP
    function setupHoverEffects() {
        albumItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (!isTransitioning && index !== currentActiveIndex && !item.classList.contains('active')) {
                    const pos = stackPositions[index];
                    gsap.to(item, {
                        scale: 1.03,
                        y: pos.y - 6,
                        x: pos.x - 6,
                        zIndex: 15,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!isTransitioning && index !== currentActiveIndex && !item.classList.contains('active')) {
                    const pos = stackPositions[index];
                    gsap.to(item, {
                        scale: 1,
                        x: pos.x,
                        y: pos.y,
                        zIndex: pos.z,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });

        projectItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (!isTransitioning && index !== currentActiveIndex) {
                    gsap.to(albumItems[index], {
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!isTransitioning && index !== currentActiveIndex) {
                    gsap.to(albumItems[index], {
                        scale: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
            });
        });
    }

    // Add click handlers for album items
    albumItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchToAlbum(index);
        });
    });

    // Add click handlers for project items
    projectItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchToAlbum(index);
        });
    });

    // Setup hover effects
    setupHoverEffects();

    // Handle window resize - refresh ScrollTrigger
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });

    // Optimized entrance animations with GSAP
    gsap.fromTo(albumItems, 
        { 
            scale: 0.8, 
            opacity: 0, 
            y: 30 
        },
        { 
            scale: 1, 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            stagger: 0.15, 
            ease: "back.out(1.7)",
            delay: 0.3
        }
    );

    gsap.fromTo(projectItems,
        {
            x: -30,
            opacity: 0
        },
        {
            x: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2
        }
    );

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (vinylSection.getBoundingClientRect().top < window.innerHeight && 
            vinylSection.getBoundingClientRect().bottom > 0) {
            
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                const nextIndex = Math.min(currentActiveIndex + 1, projectItems.length - 1);
                switchToAlbum(nextIndex);
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevIndex = Math.max(currentActiveIndex - 1, 0);
                switchToAlbum(prevIndex);
            }
        }
    });

    // Cleanup function
    return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        window.removeEventListener('resize', resizeTimeout);
        clearTimeout(resizeTimeout);
    };
}

// Footer CTA Interactions - Reveal naturally on scroll
function initFooterCTA() {
    const footer = document.querySelector('.footer-cta');
    const techSection = document.querySelector('.tech-stack');
    const spacer = document.querySelector('.footer-reveal-spacer');
    const resetBtn = document.getElementById('reset-scroll-btn');
    if (!footer || !techSection) return;

    // Animate footer reveal by clipping footer itself while tech section scrolls
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        // Start with footer fully clipped (hidden)
        gsap.set(footer, { clipPath: 'inset(100% 0% 0% 0%)' });

        const endDistance = spacer ? spacer.offsetHeight : window.innerHeight * 0.6;

        ScrollTrigger.create({
            trigger: techSection,
            start: 'bottom bottom',
            end: `+=${endDistance}`,
            scrub: true, // direct mapping, no easing/springy feel
            onUpdate: (self) => {
                const progress = self.progress;
                const topInset = 100 - progress * 100;
                // Apply rounded top corners during reveal to make roundness visible
                // Keep all other corners square; only the footer top corners are rounded via its own radius
                const radius = getComputedStyle(document.documentElement).getPropertyValue('--footer-top-radius').trim() || '28px';
                gsap.set(footer, { clipPath: `inset(${topInset}% 0% 0% 0%)` });
                footer.style.borderTopLeftRadius = radius;
                footer.style.borderTopRightRadius = radius;
            }
        });
    }

    // Reset button - Scroll to top smoothly
    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Add subtle hover animations to CTA buttons
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLocalTime,
        initScrollAnimations,
        initTechGalleryDrag,
        initVinylPlayer,
        initFooterCTA,
        debounce,
        throttle
    };
}
