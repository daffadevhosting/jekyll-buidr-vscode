export const JEKYLL_BOILERPLATE_STRUCTURE = [
  {
    name: '_layouts',
    path: '_layouts',
    type: 'folder',
    children: [
      {name: 'default.html', path: '_layouts/default.html', type: 'file'},
      {name: 'post.html', path: '_layouts/post.html', type: 'file'},
      {name: 'page.html', path: '_layouts/page.html', type: 'file'},
      {name: 'home.html', path: '_layouts/home.html', type: 'file'},
    ],
  },
  {
    name: '_includes',
    path: '_includes',
    type: 'folder',
    children: [
      {name: 'head.html', path: '_includes/head.html', type: 'file'},
      {name: 'header.html', path: '_includes/header.html', type: 'file'},
      {name: 'footer.html', path: '_includes/footer.html', type: 'file'},
      {name: 'navigation.html', path: '_includes/navigation.html', type: 'file'},
      {name: 'post-card.html', path: '_includes/post-card.html', type: 'file'},
    ],
  },
  {
    name: '_posts',
    path: '_posts',
    type: 'folder',
    children: [
      {name: '2025-08-24-welcome-to-jekyll.md', path: '_posts/2025-08-24-welcome-to-jekyll.md', type: 'file'},
    ],
  },
  {
    name: '_data',
    path: '_data',
    type: 'folder',
    children: [
      {name: 'navigation.yml', path: '_data/navigation.yml', type: 'file'},
      {name: 'social.yml', path: '_data/social.yml', type: 'file'},
    ],
  },
  {
    name: '_sass',
    path: '_sass',
    type: 'folder',
    children: [
      {name: 'custom.scss', path: '_sass/custom.scss', type: 'file'},
    ],
  },
  {
    name: 'assets',
    path: 'assets',
    type: 'folder',
    children: [
      {
        name: 'css',
        path: 'assets/css',
        type: 'folder',
        children: [
          {name: 'main.scss', path: 'assets/css/main.scss', type: 'file'},
        ],
      },
      {
        name: 'js',
        path: 'assets/js',
        type: 'folder',
        children: [
          {name: 'main.js', path: 'assets/js/main.js', type: 'file'},
        ],
      },
      {
        name: 'images',
        path: 'assets/images',
        type: 'folder',
        children: [],
      },
    ],
  },
  {name: '_config.yml', path: '_config.yml', type: 'file'},
  {name: 'index.html', path: 'index.html', type: 'file'},
  {name: 'about.md', path: 'about.md', type: 'file'},
  {name: 'blog.html', path: 'blog.html', type: 'file'},
  {name: 'Gemfile', path: 'Gemfile', type: 'file'},
  {name: 'Gemfile.lock', path: 'Gemfile.lock', type: 'file'},
  {name: '.gitignore', path: '.gitignore', type: 'file'},
  {name: 'README.md', path: 'README.md', type: 'file'},
];

export const JEKYLL_BOILERPLATE_CONTENTS: {[key: string]: string} = {
  '_config.yml': `# Site Settings
title: My Jekyll Site
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.

baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username: jekyll

# Social Media
social:
  name: Your Name
  links:
    - https://twitter.com/jekyllrb
    - https://github.com/jekyll-buildr

# Build settings
markdown: kramdown
highlighter: rouge
theme: minima
plugins:
  - jekyll-feed
  - jekyll-sitemap
  - jekyll-seo-tag

# Permalink structure
permalink: /:categories/:title/

# Default layouts
defaults:
  - scope:
      path: ""
      type: "posts"
    values:
      layout: "post"
      comments: true
  - scope:
      path: ""
      type: "pages"
    values:
      layout: "page"

# Sass configuration
sass:
  sass_dir: _sass
  style: compressed

# Collections
collections:
  projects:
    output: true
    permalink: /:collection/:name/

# Exclude from processing
exclude:
  - .sass-cache/
  - .jekyll-cache/
  - gemfiles/
  - Gemfile
  - Gemfile.lock
  - node_modules/
  - vendor/bundle/
  - vendor/cache/
  - vendor/gems/
  - vendor/ruby/
  - README.md
  - LICENSE.txt
  - CHANGELOG.md`,

  'index.html': `---
layout: home
title: Home
---

<div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-4xl md:text-6xl font-bold mb-4">Welcome to {{ site.title }}</h1>
    <p class="text-xl md:text-2xl mb-8">{{ site.description | strip_html | strip_newlines | truncate: 160 }}</p>
    <a href="{{ '/blog' | relative_url }}" class="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
      Read My Blog
    </a>
  </div>
</div>

<section class="py-16">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">Latest Posts</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {% for post in site.posts limit:3 %}
        {% include post-card.html %}
      {% endfor %}
    </div>
    <div class="text-center mt-12">
      <a href="{{ '/blog' | relative_url }}" class="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
        View All Posts
      </a>
    </div>
  </div>
</section>`,

  'blog.html': `---
layout: default
title: Blog
---

<div class="bg-gray-50 py-12">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold text-center mb-8">Blog Posts</h1>
    <p class="text-xl text-gray-600 text-center mb-12">Thoughts, stories and ideas.</p>
  </div>
</div>

<section class="py-12">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {% for post in site.posts %}
        {% include post-card.html %}
      {% endfor %}
    </div>
  </div>
</section>`,

  'about.md': `---
layout: page
title: About
---

# About Me

Welcome to my Jekyll site! This is where I share my thoughts, experiences, and projects.

## What You'll Find Here

- **Blog Posts**: Regular updates about my interests and experiences
- **Projects**: Showcase of my work and side projects
- **Resources**: Helpful links and tools I've discovered

## Get In Touch

Feel free to reach out if you'd like to connect or collaborate on something interesting.

- Email: {{ site.email }}
- Twitter: [@{{ site.twitter_username }}](https://twitter.com/{{ site.twitter_username }})
- GitHub: [{{ site.github_username }}](https://github.com/{{ site.github_username }})`,

  '_layouts/default.html': `<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang | default: "en" }}">
  {% include head.html %}
  <body class="bg-white text-gray-900 font-sans leading-normal tracking-normal">
    {% include header.html %}
    
    <main class="min-h-screen">
      {{ content }}
    </main>
    
    {% include footer.html %}
    
    <script src="{{ '/assets/js/main.js' | relative_url }}"></script>
  </body>
</html>`,

  '_layouts/home.html': `---
layout: default
---

{{ content }}`,

  '_layouts/page.html': `---
layout: default
---

<div class="bg-gray-50 py-12">
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-bold text-center">{{ page.title }}</h1>
  </div>
</div>

<article class="py-12">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto prose prose-lg">
      {{ content }}
    </div>
  </div>
</article>`,

  '_layouts/post.html': `---
layout: default
---

<div class="bg-gray-50 py-12">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">{{ page.title }}</h1>
      <div class="text-gray-600 mb-2">
        <time datetime="{{ page.date | date_to_xmlschema }}">{{ page.date | date: "%B %d, %Y" }}</time>
      </div>
      {% if page.author %}
        <p class="text-gray-600">by {{ page.author }}</p>
      {% endif %}
    </div>
  </div>
</div>

<article class="py-12">
  <div class="container mx-auto px-4">
    <div class="max-w-4xl mx-auto prose prose-lg max-w-none">
      {{ content }}
    </div>
    
    <div class="max-w-4xl mx-auto mt-12 pt-8 border-t border-gray-200">
      <div class="flex flex-wrap gap-2 mb-4">
        {% for tag in page.tags %}
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{{ tag }}</span>
        {% endfor %}
      </div>
      
      <nav class="flex justify-between">
        {% if page.previous.url %}
          <a href="{{ page.previous.url | relative_url }}" class="text-blue-600 hover:text-blue-800">
            ← {{ page.previous.title }}
          </a>
        {% endif %}
        
        {% if page.next.url %}
          <a href="{{ page.next.url | relative_url }}" class="text-blue-600 hover:text-blue-800">
            {{ page.next.title }} →
          </a>
        {% endif %}
      </nav>
    </div>
  </div>
</article>`,

  '_includes/head.html': `<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  {%- seo -%}
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          typography: {
            DEFAULT: {
              css: {
                maxWidth: 'none',
              }
            }
          }
        }
      }
    }
  </script>
  
  <!-- Tailwind Typography Plugin -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tailwindcss/typography@0.5.10/dist/tailwindcss-typography.min.css">
  
  <!-- Custom CSS -->
  <link rel="stylesheet" href="{{ '/assets/css/main.css' | relative_url }}">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="{{ '/assets/images/favicon.png' | relative_url }}">
  
  {%- feed_meta -%}
  
  <!-- Font Awesome for icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>`,

  '_includes/header.html': `<header class="bg-white shadow-sm sticky top-0 z-50">
  <nav class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <a href="{{ '/' | relative_url }}" class="text-2xl font-bold text-gray-900 hover:text-blue-600 transition duration-300">
          {{ site.title }}
        </a>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-8">
        {% include navigation.html %}
      </div>
      
      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button id="mobile-menu-toggle" class="text-gray-900 hover:text-blue-600 focus:outline-none">
          <i class="fas fa-bars text-xl"></i>
        </button>
      </div>
    </div>
    
    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="md:hidden hidden pb-4">
      <div class="flex flex-col space-y-4">
        {% include navigation.html %}
      </div>
    </div>
  </nav>
</header>`,

  '_includes/navigation.html': `{% for item in site.data.navigation %}
  <a href="{{ item.link | relative_url }}" 
     class="text-gray-700 hover:text-blue-600 transition duration-300 {% if page.url == item.link %}text-blue-600 font-semibold{% endif %}">
    {{ item.name }}
  </a>
{% endfor %}`,

  '_includes/footer.html': `<footer class="bg-gray-800 text-white py-12">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-3 gap-8">
      <div>
        <h3 class="text-xl font-bold mb-4">{{ site.title }}</h3>
        <p class="text-gray-300">{{ site.description | strip_html | strip_newlines | truncate: 120 }}</p>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2">
          {% for item in site.data.navigation %}
            <li><a href="{{ item.link | relative_url }}" class="text-gray-300 hover:text-white transition duration-300">{{ item.name }}</a></li>
          {% endfor %}
        </ul>
      </div>
      
      <div>
        <h4 class="text-lg font-semibold mb-4">Connect</h4>
        <div class="flex space-x-4">
          {% for social in site.data.social %}
            <a href="{{ social.url }}" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white text-xl transition duration-300">
              <i class="{{ social.icon }}"></i>
            </a>
          {% endfor %}
        </div>
      </div>
    </div>
    
    <div class="border-t border-gray-700 mt-8 pt-8 text-center">
      <p class="text-gray-300">&copy; {{ 'now' | date: "%Y" }} {{ site.title }}. All rights reserved.</p>
    </div>
  </div>
</footer>`,

  '_includes/post-card.html': `<article class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
  {% if post.image %}
    <div class="h-48 bg-cover bg-center" style="background-image: url('{{ post.image | relative_url }}')"></div>
  {% else %}
    <div class="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
  {% endif %}
  
  <div class="p-6">
    <div class="text-sm text-gray-500 mb-2">
      <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
    </div>
    
    <h3 class="text-xl font-bold mb-3">
      <a href="{{ post.url | relative_url }}" class="text-gray-900 hover:text-blue-600 transition duration-300">
        {{ post.title }}
      </a>
    </h3>
    
    <p class="text-gray-600 mb-4">
      {{ post.excerpt | strip_html | strip_newlines | truncate: 150 }}
    </p>
    
    <div class="flex flex-wrap gap-2 mb-4">
      {% for tag in post.tags limit:3 %}
        <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">{{ tag }}</span>
      {% endfor %}
    </div>
    
    <a href="{{ post.url | relative_url }}" class="text-blue-600 hover:text-blue-800 font-semibold">
      Read More →
    </a>
  </div>
</article>`,

  '_data/navigation.yml': `- name: Home
  link: /
- name: About
  link: /about
- name: Blog
  link: /blog`,

  '_data/social.yml': `- name: Twitter
  url: https://twitter.com/jekyllrb
  icon: fab fa-twitter
- name: GitHub
  url: https://github.com/jekyll
  icon: fab fa-github
- name: Email
  url: mailto:your-email@example.com
  icon: fas fa-envelope`,

  '_posts/2025-08-24-welcome-to-jekyll.md': `---
layout: post
title: "Welcome to Jekyll!"
date: 2025-08-24 12:00:00 +0700
categories: jekyll update
tags: [jekyll, blog, tutorial]
author: Your Name
image: /assets/images/jekyll-welcome.jpg
---

You'll find this post in your \`_posts\` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run \`jekyll serve\`, which launches a web server and auto-regenerates your site when a file is updated.

## Getting Started

Jekyll requires blog post files to be named according to the following format:

\`YEAR-MONTH-DAY-title.MARKUP\`

Where \`YEAR\` is a four-digit number, \`MONTH\` and \`DAY\` are both two-digit numbers, and \`MARKUP\` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

## Code Highlighting

Jekyll also offers powerful support for code snippets:

\`\`\`ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
\`\`\`

## What's Next?

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll's GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/`,

  '_sass/custom.scss': `// Custom SCSS styles
// This file is imported in assets/css/main.scss

// Custom utilities and components
.prose {
  // Override Tailwind Typography styles here if needed
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }
  
  a {
    @apply text-blue-600 hover:text-blue-800 transition-colors duration-300;
  }
  
  blockquote {
    @apply border-l-4 border-blue-500 bg-blue-50 p-4 italic;
  }
  
  code {
    @apply bg-gray-100 px-1 py-0.5 rounded text-sm;
  }
  
  pre {
    @apply bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto;
    
    code {
      @apply bg-transparent p-0;
    }
  }
}

// Animation utilities
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

// Custom button styles
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition duration-300 font-semibold;
}`,

  'assets/css/main.scss': `---
# Only the main Sass file needs front matter (the dashes are enough)
---

@import "custom";

// Additional custom styles can go here`,

  'assets/js/main.js': `// Main JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Update icon
      const icon = mobileMenuToggle.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.className = 'fas fa-bars text-xl';
      } else {
        icon.className = 'fas fa-times text-xl';
      }
    });
  }
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Add fade-in animation to elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);
  
  // Observe elements with fade-in class
  document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
    observer.observe(el);
  });
});`,

  'Gemfile': `source "https://rubygems.org"

# Hello! This is where you manage which Jekyll version is used to run.
# When you want to use a different version, change it below, save the
# file and run \`bundle install\`. Run Jekyll with \`bundle exec\`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.
# Happy Jekylling!

gem "jekyll", "~> 4.3.0"

# This is the default theme for new Jekyll sites.
gem "minima", "~> 2.5"

# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run \`bundle update github-pages\`.
# gem "github-pages", group: :jekyll_plugins

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate"
  gem "jekyll-archives"
end

# Windows and JRuby does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Performance-booster for watching directories on Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock \`http_parser.rb\` gem to \`v0.6.x\` on JRuby builds since newer versions of the gem
# do not have a Java counterpart.
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]

# Additional useful gems
gem "rouge", "~> 4.0" # Syntax highlighting
gem "kramdown-parser-gfm" # GitHub Flavored Markdown`,

  'Gemfile.lock': `# This file is automatically generated by Bundler.
# It contains the exact versions of all gems in your Gemfile.
# This file should be committed to version control.

# Note: This is a placeholder Gemfile.lock
# Run 'bundle install' to generate the actual lock file`,

  '.gitignore': `_site/
.sass-cache/
.jekyll-cache/
.jekyll-metadata
.bundle/
vendor/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log

# Runtime data
pids
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# node_modules
node_modules/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history`,

  'README.md': `# Jekyll Site with Tailwind CSS

A modern Jekyll site built with Tailwind CSS for beautiful, responsive design.

## Features

- ✨ Modern, responsive design with Tailwind CSS
- 📱 Mobile-first approach
- 🎨 Beautiful typography with Tailwind Typography
- 🚀 Fast loading and optimized
- 📝 Blog-ready with post layouts
- 🔍 SEO optimized
- 📊 Analytics ready

## Quick Start

1. **Install dependencies**
   \`\`\`bash
   bundle install
   \`\`\`

2. **Run the development server**
   \`\`\`bash
   bundle exec jekyll serve
   \`\`\`

3. **Visit your site**
   Open [http://localhost:4000](http://localhost:4000) in your browser

## Structure

\`\`\`
├── _includes/          # Reusable components
├── _layouts/           # Page templates
├── _posts/             # Blog posts
├── _data/              # Site data files
├── _sass/              # Custom SCSS styles
├── assets/             # CSS, JS, and images
└── _config.yml         # Site configuration
\`\`\`

## Customization

### Styling
- Edit \`_sass/custom.scss\` for custom styles
- Modify Tailwind configuration in \`_includes/head.html\`
- Update colors and fonts in the Tailwind config

### Navigation
- Edit \`_data/navigation.yml\` to add/remove menu items
- Update social links in \`_data/social.yml\`

### Content
- Add blog posts to \`_posts/\` directory
- Create pages in the root directory
- Update site settings in \`_config.yml\`

## Deployment

This site can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting provider

## Project Info

This project is open source and available @ [Jekyll Buildr](https://jekyll-buildr.vercel.app).`,
};