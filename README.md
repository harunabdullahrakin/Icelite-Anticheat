# Icelite Anticheat — Official Website

Modern, high-performance static website for **Icelite Anticheat** (Minecraft Anticheat Plugin). Built with semantic HTML5, fluid responsive CSS3, vanilla JavaScript, and [Hotwired Turbo.js](https://turbo.hotwired.dev/) for instant page transitions. Designed with the popular **Minecraft Cobalt / NamelessMC** gaming portal aesthetic and ready for **GitHub Pages**.

---

## 🌟 Highlights & Features

- **Minecraft Cobalt & NamelessMC Gaming Aesthetic:**
  - Dark obsidian slate paneling (`#050814`) with ice cyan specular highlights (`#00f2fe`, `#38bdf8`) and cobalt blue gradients (`#1d4ed8`).
  - **Live Server Status Bar:** Displays player count (`1,420 PLAYERS ONLINE`), pulsing green status dot, and a **One-Click "Copy Server IP"** button with a custom floating toast alert.
- **Hero Animated GIF Background with Frosted Blur:**
  - Uses an animated looping GIF (`assets/hero-bg.gif`).
  - Frosted glass blur overlay (`backdrop-filter: blur(14px)`) ensures text, badges, and code snippets stay 100% legible over the background animation.
  - Interactive live blur intensity slider control right on the hero.
  - Interactive cyber-ice canvas fallback when no GIF is present.
- **Fluid Responsive Typography for Mobile & PC:**
  - Uses CSS `clamp()`, viewport scaling (`vw`), and responsive font sizes so headings, cards, and tables resize automatically from small mobile screens (320px) up to 4K monitors.
- **Animated Visual Curves & Waves in Footer:**
  - Multi-layered SVG sine-wave curves with continuous CSS keyframe drift animation transitioning into the dark footer.
- **Upload Image Logo Support:**
  - The website loads standard images (`assets/logo.png`) instead of being restricted to hardcoded SVGs.
  - Simply replace `assets/logo.png` with your PNG, JPG, or WebP logo!
- **85% Width Floating Auto-Hiding Navbar:**
  - Centered floating navbar at 85% width (`max-width: 1200px`) with rounded corners (`border-radius: 18px`).
  - Automatically hides when scrolling down, and slides back into view when scrolling up.
- **Live Interactive Cheater Inspector:**
  - Interactive tabs (*Combat & Reach*, *Movement & Fly*, *Packet & Protocol*) with real-time detection gauges.
- **Simulated Real-Time Packet Stream:**
  - Live terminal streaming Minecraft packet interception events.
- **Animated Metrics Counters:**
  - Triggers on scroll (99.9% Uptime, 48M+ Unique Players, 40K+ Daily Users, 13M+ Fraud Events).
- **Turbo.js Multi-Page Routing:**
  - Instant page transitions between `index.html`, `solution.html`, `about.html`, `faq.html`, `terms.html`, and `privacy.html`.

---

## 📁 File Structure

```text
icelite-anticheat/
├── assets/
│   ├── favicon.svg      # Favicon
│   ├── logo.png         # Image Logo (Drop your PNG/JPG/WebP here)
│   ├── logo.svg         # Fallback SVG logo
│   └── hero-bg.gif      # Looping animated background GIF
├── .nojekyll            # Ensures GitHub Pages serves all assets directly
├── index.html           # Main landing page (GIF hero, server status, demo)
├── solution.html        # Technical architecture deep dive
├── about.html           # About Us & mission page
├── faq.html             # FAQ & quickstart documentation
├── terms.html           # Terms of service
├── privacy.html         # Privacy policy
├── style.css            # Fluid responsive CSS & Cobalt theme
├── main.js              # Navbar scroll, Turbo hooks, copy IP, counters
└── README.md            # Documentation
```

---

## 🖼️ How to Upload Your Logo & Background GIF

1. **Upload Your Logo:**
   Drop your logo image into the `assets/` folder and name it:
   ```text
   assets/logo.png
   ```
   *(Supports PNG, JPG, WebP. It will automatically update in the navbar and footer).*

2. **Upload Your Hero GIF:**
   Drop your animated GIF into `assets/` and name it:
   ```text
   assets/hero-bg.gif
   ```
   *(The frosted blur overlay will automatically blend over your GIF smoothly).*

---

## 🌐 Deploying to GitHub Pages

1. Open your terminal in this directory:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Icelite Anticheat"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. In your GitHub repository settings:
   - Go to **Settings** &rarr; **Pages**.
   - Under **Build and deployment** &rarr; **Branch**, select `main` and folder `/ (root)`.
   - Click **Save**. Your site will be published at `https://<your-username>.github.io/<repo-name>/`!
