# Changelog

All notable changes to the **Jekyll Buildr** VS Code extension will be documented here.

---

## [0.1.5] - 2025-08-24

### Update/Change

- **`Jekyll Buildr: Create Jekyll Boilerplate` Command**  
  Fixed a bug when generating the jekyll boilerplate..

---

## [0.1.4] - 2025-08-24

### Update/Change

- **`Jekyll Buildr: Create Jekyll Boilerplate` Command**  
  Enhances your Jekyll boilerplate with the latest Tailwind CSS CDN and a more comprehensive structure.

- A significantly more complete Jekyll boilerplate featuring the following:

### ✨ Newly Added Features

#### 🎨 Tailwind CSS Integration
- Uses the latest Tailwind CSS CDN  
- Typography plugin for beautifully styled blog content  
- Custom SCSS for additional styling  
- Mobile-first responsive design  

#### 📱 Complete Layouts
- `home.html` – Landing page with hero section  
- `page.html` – Template for static pages  
- `post.html` – Blog post template with navigation  
- Responsive `navigation` with mobile menu  

#### 🔧 Reusable Components
- `head.html` – Meta tags, CDN links, and SEO setup  
- `navigation.html` – Dynamic navigation menu  
- `post-card.html` – Card component for post previews  
- `header.html` & `footer.html` – Modern header and footer  

#### 📊 Data Files
- `navigation.yml` – Menu configuration  
- `social.yml` – Social media links with icons  

#### 🛠 Full Configuration
- `_config.yml` with SEO, sitemap, and feed plugins  
- `Gemfile` with all required dependencies  
- Comprehensive `.gitignore`  
- `README.md` with complete documentation  

#### 📝 Content Ready
- Sample blog post with complete front matter  
- About page template  
- Blog listing page  
- Landing page with hero section  

#### 🎯 SEO & Performance
- Jekyll SEO Tag plugin  
- Sitemap generation  
- RSS feed  
- Optimized meta tags  
- Font Awesome icons  
- Responsive images  

#### 📱 Interactive Features
- Mobile hamburger menu powered by JavaScript  
- Smooth scrolling  
- Hover effects and animations  
- Intersection Observer for fade-in effects  

---

## [0.1.3] - 2025-08-22

### Added

* **`Jekyll Buildr: Generate Image with AI 👑` Command**: Interactive command to create Image using AI, with context awareness from the currently post title.
---

## [0.1.2] - 2025-08-21

### Update/Change

* **`Backend PayPal API`**
---

## [0.1.1] - 2025-08-21

### Added

* **`Create Jekyll Buildr: Upgrade to Pro 👑` Command** button.
---

## [0.1.0] - 2025-08-21

### Added

* **Initial Preview Release** on VS Code Marketplace.
* **`Jekyll Buildr: Login` Command**: Authenticates users through GitHub and synchronizes account status (Free/Pro) from the Jekyll Buildr web app.
* **`Jekyll Buildr: Create Jekyll Boilerplate` Command**: Creates standard folder and file structure for new Jekyll projects directly in the active workspace.
* **`Jekyll Buildr: Generate AI Component` Command**: Interactive command to create Jekyll components using AI, with context awareness from the currently active file.
* **"Create Post" Sidebar**: Panel in the Activity Bar for creating new blog posts. This feature uses AI to automatically generate Markdown content and front matter based on the title.
* Account status integration to enable or disable AI features based on user tier (Free/Pro).
