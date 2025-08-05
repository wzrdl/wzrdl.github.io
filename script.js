// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initSmoothScrolling();
    initScrollAnimations();
    initSkillBars();
    initContactForm();
    initParticles();
    initTypingEffect();
});

// 导航栏功能
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // 移动端菜单切换
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // 滚动时导航栏样式变化
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// 平滑滚动
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // 考虑导航栏高度
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .highlight-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// 技能条动画
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// 联系表单功能
function initContactForm() {
    const contactForm = document.querySelector('.contact-form-container');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                showNotification('请填写所有字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟发送邮件
            showNotification('消息发送中...', 'info');
            
            setTimeout(() => {
                showNotification('消息发送成功！', 'success');
                this.reset();
            }, 2000);
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知系统
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        border: 1px solid;
    `;
    
    // 根据类型设置颜色
    switch(type) {
        case 'success':
            notification.style.background = '#00ff00';
            notification.style.borderColor = '#00cc00';
            break;
        case 'error':
            notification.style.background = '#ff0000';
            notification.style.borderColor = '#cc0000';
            break;
        default:
            notification.style.background = '#00ffff';
            notification.style.borderColor = '#00cccc';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 粒子动画
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    
    if (particlesContainer) {
        // 创建更多粒子
        for (let i = 0; i < 20; i++) {
            createParticle(particlesContainer);
        }
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置和动画
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() * 3 + 1;
    const duration = Math.random() * 10 + 5;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: #00ffff;
        border-radius: 50%;
        opacity: 0.6;
        animation: particle-float ${duration}s ease-in-out infinite;
        animation-delay: ${delay}s;
    `;
    
    container.appendChild(particle);
}

// 打字机效果
function initTypingEffect() {
    const heroTitle = document.querySelector('.title-line');
    
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // 延迟开始打字效果
        setTimeout(typeWriter, 1000);
    }
}

// 鼠标跟随效果
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 打开搜索
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        showNotification('搜索功能开发中...', 'info');
    }
    
    // ESC 关闭所有模态框
    if (e.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// 性能优化：节流函数
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
    }
}

// 优化滚动事件
const optimizedScrollHandler = throttle(function() {
    // 滚动相关的性能敏感操作
}, 16); // 约60fps

window.addEventListener('scroll', optimizedScrollHandler);

// 预加载关键资源
function preloadCriticalResources() {
    const criticalImages = [
        // 可以在这里添加需要预加载的图片
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// 页面可见性API
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        document.body.classList.add('paused');
    } else {
        // 页面显示时恢复动画
        document.body.classList.remove('paused');
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('页面错误:', e.error);
    showNotification('页面出现错误，请刷新重试', 'error');
});

// 网络状态检测
window.addEventListener('online', function() {
    showNotification('网络连接已恢复', 'success');
});

window.addEventListener('offline', function() {
    showNotification('网络连接已断开', 'error');
});

// 初始化完成后的回调
window.addEventListener('load', function() {
    // 隐藏加载动画
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // 显示欢迎消息
    setTimeout(() => {
        showNotification('欢迎来到我的个人主页！', 'success');
    }, 1000);
});

// 导出函数供外部使用
window.PortfolioApp = {
    showNotification,
    initNavigation,
    initSmoothScrolling,
    initScrollAnimations
}; 