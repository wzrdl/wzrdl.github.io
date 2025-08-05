#!/bin/bash

# Zirui Wen - AI Engineer Portfolio Deployment Script
# 自动部署到 GitHub Pages

echo "🚀 开始部署个人主页到 GitHub Pages..."

# 检查是否在正确的目录
if [ ! -f "index.html" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

# 检查 Git 是否已初始化
if [ ! -d ".git" ]; then
    echo "📁 初始化 Git 仓库..."
    git init
fi

# 添加所有文件到 Git
echo "📦 添加文件到 Git..."
git add .

# 检查是否有更改
if git diff --cached --quiet; then
    echo "ℹ️  没有新的更改需要提交"
else
    # 提交更改
    echo "💾 提交更改..."
    git commit -m "Update portfolio: $(date '+%Y-%m-%d %H:%M:%S')"
fi

# 检查远程仓库
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 添加远程仓库..."
    echo "请确保已在GitHub上创建仓库: wzrdl.github.io"
    git remote add origin https://github.com/wzrdl/wzrdl.github.io.git
fi

# 推送到 GitHub
echo "⬆️  推送到 GitHub..."
git branch -M main
git push -u origin main

echo "✅ 部署完成！"
echo ""
echo "📋 下一步操作："
echo "1. 访问 https://github.com/wzrdl/wzrdl.github.io"
echo "2. 进入 Settings > Pages"
echo "3. Source 选择 'Deploy from a branch'"
echo "4. Branch 选择 'main'"
echo "5. 保存设置"
echo ""
echo "🌐 网站将在几分钟后可通过以下地址访问："
echo "   https://wzrdl.github.io"
echo ""
echo "💡 提示："
echo "- 首次部署可能需要等待 5-10 分钟"
echo "- 如果遇到问题，请检查 GitHub 仓库设置"
echo "- 可以添加自定义域名到 GitHub Pages 设置中" 