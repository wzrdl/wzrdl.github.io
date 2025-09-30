# Zirui Wen - Personal Portfolio Website

A modern, responsive personal portfolio website built with pure HTML, CSS, and JavaScript, inspired by the clean aesthetic of aidils.com.

## 🌟 Features

- **Modern Design**: Clean, minimalist aesthetic with excellent typography
- **Responsive**: Mobile-first design that works on all devices
- **Dark Mode**: System preference detection with manual toggle
- **Interactive Elements**: Smooth animations, scroll effects, and hover states
- **Real-time Clock**: Live local time display in the header
- **SEO Optimized**: Proper meta tags, Open Graph, and structured data
- **Performance**: Fast loading with optimized assets and lazy loading
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🚀 Live Demo

Visit the live website at: [https://wzrdl.github.io](https://wzrdl.github.io)

## 📁 Project Structure

```
├── index.html              # Main HTML file
├── styles/
│   └── style.css           # Main stylesheet
├── scripts/
│   └── main.js             # JavaScript functionality
├── assets/
│   ├── profile.jpg         # Profile photo
│   └── og-image.png        # Open Graph image
└── README.md               # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, flexbox, and grid
- **JavaScript**: Vanilla JS for interactivity and animations
- **Fonts**: Inter and Space Grotesk from Google Fonts
- **Icons**: Custom SVG icons for social links and UI elements

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+ (Full layout)
- **Tablet**: 768px - 1199px (Adjusted layout)
- **Mobile**: 320px - 767px (Single column, stacked layout)

## 🎨 Design Features

- **Color Scheme**: Clean black/white with orange accents
- **Typography**: Modern sans-serif fonts with proper hierarchy
- **Animations**: Subtle scroll-triggered animations and hover effects
- **Layout**: Grid and flexbox for responsive layouts
- **Images**: Optimized profile photos with grayscale filter

## 🔧 Setup and Deployment

### Option 1: GitHub Pages (Recommended)

1. **Create a new repository** named `wzrdl.github.io` (must match your GitHub username)
2. **Upload all files** to the main branch
3. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
4. **Access your site** at `https://wzrdl.github.io`

### Option 2: Local Development

1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **For development server** (optional):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

## 📝 Customization

### Personal Information

Update the following in `index.html`:

- **Name and title** in the hero section
- **Contact information** (email, phone, social links)
- **Work experience** details and dates
- **Projects** with descriptions and links
- **Education** information
- **Profile photo** in `assets/profile.jpg`

### Styling

Modify `styles/style.css`:

- **Colors**: Update CSS custom properties in `:root`
- **Typography**: Change font families and sizes
- **Spacing**: Adjust spacing variables
- **Layout**: Modify grid and flexbox properties

### Functionality

Edit `scripts/main.js`:

- **Time display**: Modify timezone or format
- **Animations**: Adjust scroll trigger thresholds
- **Theme toggle**: Customize dark mode behavior

## 🌐 SEO and Performance

### SEO Features

- Semantic HTML structure
- Meta descriptions and Open Graph tags
- Structured data (JSON-LD) for search engines
- Proper heading hierarchy
- Alt text for images

### Performance Optimizations

- Optimized images and assets
- Lazy loading for images
- Minimal JavaScript footprint
- CSS custom properties for theming
- Efficient scroll event handling

## 🔍 Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile browsers**: iOS Safari, Chrome Mobile
- **Accessibility**: Screen readers, keyboard navigation
- **Progressive enhancement**: Works without JavaScript

## 📊 Analytics and Monitoring

To add analytics, insert your tracking code before the closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing

This is a personal portfolio project, but suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different devices and browsers
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contactz

- **Email**: wzrqczj@gmail.com
- **LinkedIn**: [Zirui Wen](https://linkedin.com/in/zirui-wen-76320b327/)
- **GitHub**: [@wzrdl](https://github.com/wzrdl)

---

Built with ❤️ by Zirui Wen
