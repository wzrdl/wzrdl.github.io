# Zirui Wen - AI Engineer Personal Homepage

一个具有赛博朋克风格的AI工程师个人主页，展示专业技能、项目经验和技术能力。

## 🚀 特性

- **赛博朋克设计风格** - 霓虹色彩、动画效果、未来感UI
- **响应式设计** - 完美适配桌面端和移动端
- **交互式动画** - 滚动动画、技能条动画、粒子效果
- **现代化技术栈** - HTML5、CSS3、JavaScript ES6+
- **性能优化** - 懒加载、节流函数、Intersection Observer
- **无障碍访问** - 语义化HTML、键盘导航支持

## 🎨 设计特色

### 色彩方案
- **主色调**: 青色 (#00ffff) - 代表科技感和未来感
- **辅助色**: 洋红色 (#ff00ff) - 增加视觉冲击力
- **强调色**: 黄色 (#ffff00) - 突出重点内容
- **背景色**: 深黑色 (#0a0a0a) - 营造神秘氛围

### 动画效果
- 网格背景动画
- 粒子浮动效果
- 文字发光动画
- 技能条进度动画
- 卡片悬停效果
- 打字机效果

## 📁 项目结构

```
wzrdl.github.io/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 交互脚本
├── README.md           # 项目说明
└── assets/             # 资源文件夹（可选）
    ├── images/         # 图片资源
    └── fonts/          # 字体文件
```

## 🛠️ 技术栈

### 前端技术
- **HTML5** - 语义化标记
- **CSS3** - 现代样式和动画
- **JavaScript ES6+** - 交互逻辑
- **Font Awesome** - 图标库
- **Google Fonts** - 字体资源

### 设计工具
- **CSS Grid & Flexbox** - 布局系统
- **CSS Custom Properties** - 主题变量
- **CSS Animations** - 动画效果
- **Intersection Observer API** - 滚动检测

## 🚀 部署到 GitHub Pages

### 方法一：直接部署（推荐）

1. **创建 GitHub 仓库**
   ```bash
   # 确保仓库名称为：wzrdl.github.io
   # 这样可以直接通过 https://wzrdl.github.io 访问
   ```

2. **上传文件**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Cyberpunk AI Engineer Portfolio"
   git branch -M main
   git remote add origin https://github.com/wzrdl/wzrdl.github.io.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库设置 (Settings)
   - 找到 "Pages" 选项
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main"
   - 保存设置

4. **访问网站**
   - 等待几分钟后访问：`https://wzrdl.github.io`

### 方法二：使用 GitHub Actions

1. **创建 `.github/workflows/deploy.yml`**
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v2
       
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./
   ```

## 📱 响应式设计

### 断点设置
- **桌面端**: > 768px
- **平板端**: 768px - 480px
- **移动端**: < 480px

### 适配特性
- 导航栏在移动端变为汉堡菜单
- 网格布局在移动端变为单列
- 时间轴在移动端变为左对齐
- 字体大小和间距自适应

## 🎯 自定义配置

### 修改个人信息
编辑 `index.html` 中的相关内容：
- 姓名和职位
- 个人描述
- 技能和项目
- 联系方式

### 修改颜色主题
在 `styles.css` 中修改 CSS 变量：
```css
:root {
    --primary-color: #00ffff;    /* 主色调 */
    --secondary-color: #ff00ff;  /* 辅助色 */
    --accent-color: #ffff00;     /* 强调色 */
    --background-color: #0a0a0a; /* 背景色 */
}
```

### 添加新功能
- 在 `script.js` 中添加新的交互功能
- 在 `styles.css` 中添加相应的样式
- 在 `index.html` 中添加HTML结构

## 🔧 本地开发

### 环境要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地服务器（可选，用于开发）

### 启动开发服务器
```bash
# 使用 Python 内置服务器
python -m http.server 8000

# 或使用 Node.js
npx serve .

# 或使用 Live Server (VS Code 扩展)
# 右键 index.html -> Open with Live Server
```

### 开发建议
1. 使用浏览器开发者工具调试
2. 启用 CSS 和 JavaScript 源映射
3. 使用 Lighthouse 进行性能测试
4. 测试不同设备和浏览器兼容性

## 📊 性能优化

### 已实现的优化
- **图片懒加载** - 减少初始加载时间
- **CSS 和 JS 压缩** - 减少文件大小
- **字体优化** - 使用 Google Fonts CDN
- **动画优化** - 使用 transform 和 opacity
- **滚动节流** - 提高滚动性能

### 进一步优化建议
- 使用 WebP 格式图片
- 实现 Service Worker 缓存
- 添加预加载关键资源
- 使用 CDN 加速静态资源

## 🌟 浏览器支持

### 完全支持
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### 部分支持
- IE 11（需要 polyfill）

## 📄 许可证

MIT License - 可自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📞 联系方式

- **LinkedIn**: https://www.linkedin.com/in/zirui-wen-76320b327/
- **GitHub**: https://github.com/wzrdl
- **个人主页**: https://wzrdl.github.io

---

**注意**: 这是一个静态网站，所有交互都是前端实现的。如果需要后端功能（如邮件发送），需要集成相应的服务。 