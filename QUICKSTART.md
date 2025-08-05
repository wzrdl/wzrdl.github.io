# 🚀 快速部署指南

## 📋 准备工作

1. **确保拥有GitHub账户**
2. **创建新仓库**
   - 仓库名必须是：`wzrdl.github.io`
   - 设置为公开仓库

## ⚡ 快速部署（三步完成）

### 步骤 1: 上传文件

将所有文件上传到GitHub仓库：

```bash
# 在项目目录中执行
git init
git add .
git commit -m "Initial commit: Cyberpunk AI Engineer Portfolio"
git branch -M main
git remote add origin https://github.com/wzrdl/wzrdl.github.io.git
git push -u origin main
```

### 步骤 2: 启用GitHub Pages

1. 进入GitHub仓库页面
2. 点击 **Settings** 选项卡
3. 在左侧菜单中找到 **Pages**
4. 在 **Source** 部分选择 **Deploy from a branch**
5. **Branch** 选择 **main**
6. 点击 **Save**

### 步骤 3: 访问网站

等待3-5分钟后访问：`https://wzrdl.github.io`

## 🎨 个性化定制

### 修改个人信息
编辑 `index.html` 文件中的以下部分：
- 姓名和职位描述
- 技能和项目内容
- 联系方式信息

### 调整颜色主题
在 `styles.css` 中修改CSS变量：
```css
:root {
    --primary-color: #00ffff;    /* 主色调 */
    --secondary-color: #ff00ff;  /* 辅助色 */
    --accent-color: #ffff00;     /* 强调色 */
}
```

### 添加真实项目
替换项目卡片中的内容：
- 项目标题和描述
- 技术标签
- GitHub链接

## ⚠️ 常见问题

**Q: 网站没有显示？**
A: 等待5-10分钟，GitHub Pages需要时间生成网站

**Q: 样式没有加载？**
A: 检查文件路径是否正确，确保所有文件都在仓库根目录

**Q: 如何添加自定义域名？**
A: 在仓库根目录创建CNAME文件，内容为你的域名

## 📱 测试建议

1. **桌面端测试**: Chrome、Firefox、Safari
2. **移动端测试**: 手机浏览器
3. **功能测试**: 导航、表单、动画效果

## 🔄 更新网站

修改文件后重新提交：
```bash
git add .
git commit -m "Update content"
git push
```

## 📞 获取帮助

- **GitHub Issues**: 在仓库中提交问题
- **LinkedIn**: https://www.linkedin.com/in/zirui-wen-76320b327/

---

**🎉 恭喜！你的个人主页已成功部署！**