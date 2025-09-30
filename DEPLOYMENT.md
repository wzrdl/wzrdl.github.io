# 🚀 Deployment Guide - Zirui Wen Portfolio

## Quick Start (GitHub Pages)

### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. **Repository name**: `wzrdl.github.io` (must match your GitHub username exactly)
4. Set to **Public**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### Step 2: Upload Files
Choose one of these methods:

#### Method A: GitHub Web Interface (Easiest)
1. In your new repository, click "uploading an existing file"
2. Drag and drop these files from your local folder:
   - `index.html`
   - `README.md`
   - `styles/` folder (with `style.css`)
   - `scripts/` folder (with `main.js`)
   - `assets/` folder (with `profile.jpg` and `og-image.png`)
3. Add commit message: "Initial portfolio website"
4. Click "Commit changes"

#### Method B: Git Command Line
```bash
# Navigate to your project folder
cd "C:\Users\24717\Desktop\personal page"

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial portfolio website"

# Add remote repository (replace wzrdl with your GitHub username)
git remote add origin https://github.com/wzrdl/wzrdl.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section (left sidebar)
4. Under **Source**, select "Deploy from a branch"
5. Select **main** branch and **/ (root)** folder
6. Click **Save**

### Step 4: Access Your Website
- **URL**: `https://wzrdl.github.io` (replace wzrdl with your username)
- **Deployment time**: 2-10 minutes
- **Updates**: Any changes pushed to main branch will auto-deploy

## 🔧 Custom Domain (Optional)

### Step 1: Purchase Domain
- Buy domain from providers like Namecheap, GoDaddy, or Cloudflare
- Popular options: `ziruiwen.com`, `wzrdl.dev`, etc.

### Step 2: Configure DNS
1. In your domain provider's DNS settings, add a **CNAME** record:
   - **Name**: `www` (or `@` for root domain)
   - **Value**: `wzrdl.github.io`
2. Wait for DNS propagation (up to 48 hours)

### Step 3: Add Custom Domain to GitHub
1. Go to repository **Settings** → **Pages**
2. In **Custom domain** field, enter your domain (e.g., `www.ziruiwen.com`)
3. Check **Enforce HTTPS** when available
4. Add a file named `CNAME` to your repository root with just your domain name

## 📱 Testing Your Website

### Local Testing
1. Open `index.html` in your browser
2. Test all sections and links
3. Check mobile responsiveness (F12 → Device toolbar)
4. Test dark/light mode toggle

### Online Testing Tools
- **Mobile**: [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- **Speed**: [PageSpeed Insights](https://pagespeed.web.dev/)
- **SEO**: [SEO Checker](https://www.seoptimer.com/)

## 🔄 Updating Your Website

### Making Changes
1. Edit files locally
2. Test changes in browser
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update portfolio content"
   git push
   ```

### Common Updates
- **Profile photo**: Replace `assets/profile.jpg`
- **Contact info**: Update email/phone in HTML
- **Projects**: Add new project cards
- **Experience**: Update job descriptions
- **Skills**: Modify tech stack tags

## 🛠️ Troubleshooting

### Website Not Loading
- Check repository name matches username exactly
- Verify GitHub Pages is enabled
- Wait 10-15 minutes for deployment
- Check repository is public

### Images Not Showing
- Verify image files are in `assets/` folder
- Check file names match HTML references
- Ensure images are optimized (< 1MB each)

### Styling Issues
- Clear browser cache (Ctrl+F5)
- Check CSS file is uploaded correctly
- Verify file paths are relative (not absolute)

### Mobile Issues
- Test on actual mobile devices
- Check viewport meta tag in HTML
- Verify responsive CSS is working

## 📊 Analytics Setup (Optional)

### Google Analytics
1. Create account at [analytics.google.com](https://analytics.google.com)
2. Add tracking code to `index.html` before `</head>`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_MEASUREMENT_ID');
   </script>
   ```

### GitHub Analytics
- Built-in analytics available in repository **Insights** tab
- Shows page views and traffic sources
- No additional setup required

## 🎯 SEO Optimization

### Already Included
- ✅ Meta descriptions and Open Graph tags
- ✅ Structured data (JSON-LD)
- ✅ Semantic HTML structure
- ✅ Proper heading hierarchy
- ✅ Alt text for images

### Additional Steps
1. **Submit to Google**: [Google Search Console](https://search.google.com/search-console)
2. **Social sharing**: Test with [Open Graph Debugger](https://developers.facebook.com/tools/debug/)
3. **Site map**: Add `sitemap.xml` if needed for larger sites

## 📞 Support

If you encounter issues:
1. Check this deployment guide
2. Review GitHub Pages documentation
3. Check repository settings
4. Contact GitHub support for hosting issues

---

**Your website will be live at**: `https://wzrdl.github.io` 🎉
