export const JEKYLL_BOILERPLATE_STRUCTURE = [
  {
    name: '_layouts',
    path: '_layouts',
    type: 'folder',
    children: [
      {name: 'default.html', path: '_layouts/default.html', type: 'file'},
      {name: 'post.html', path: '_layouts/post.html', type: 'file'},
    ],
  },
  {
    name: '_includes',
    path: '_includes',
    type: 'folder',
    children: [
      {name: 'header.html', path: '_includes/header.html', type: 'file'},
      {name: 'footer.html', path: '_includes/footer.html', type: 'file'},
    ],
  },
  {
    name: '_posts',
    path: '_posts',
    type: 'folder',
    children: [], // Kosongkan, biarkan user yang mengisi
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
        children: [{name: 'style.css', path: 'assets/css/style.css', type: 'file'}],
      },
    ],
  },
  {name: '_config.yml', path: '_config.yml', type: 'file'},
  {name: 'index.html', path: 'index.html', type: 'file'},
  {name: 'Gemfile', path: 'Gemfile', type: 'file'},
];

export const JEKYLL_BOILERPLATE_CONTENTS: {[key: string]: string} = {
  '_config.yml': `
# Welcome to Jekyll!
#
# This config file is meant for settings that affect your whole blog, values
# which you are expected to set up once and rarely edit after that. If you find
# yourself editing this file very often, consider using Jekyll's data files
# feature for the data you need to update frequently.
#
# For technical reasons, this file is *NOT* reloaded automatically when you use
# 'bundle exec jekyll serve'. If you change this file, please restart the server process.

# Site settings
# These are used to personalize your new site. If you look in the HTML files,
# you will see them accessed via {{ site.title }}, {{ site.email }}, and so on.
# You can create any custom variable you would like, and they will be accessible
# in the templates via {{ site.myvariable }}.
title: Your Awesome Title
email: your-email@example.com
description: >- # this means to ignore newlines until "baseurl:"
  Write an awesome description for your new site here. You can edit this
  line in _config.yml. It will appear in your document head meta (for
  Google search results) and in your feed.xml site description.
baseurl: "" # the subpath of your site, e.g. /blog
url: "" # the base hostname & protocol for your site, e.g. http://example.com
twitter_username: jekyllrb
github_username:  jekyll

# Build settings
theme: minima
plugins:
  - jekyll-feed
`.trim(),
  'index.html': `
---
layout: default
---
<div class="home">
  <h1>Posts</h1>
  <ul class="posts">
    {% for post in site.posts %}
      <li>
        <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
        <h2>
          <a class="post-link" href="{{ post.url | relative_url }}">{{ post.title | escape }}</a>
        </h2>
      </li>
    {% endfor %}
  </ul>
</div>
`.trim(),
  '_layouts/default.html': `
<!DOCTYPE html>
<html>
  <head>
    <title>{{ page.title }}</title>
    <link rel="stylesheet" href="{{ '/assets/css/style.css' | relative_url }}">
  </head>
  <body>
    {% include header.html %}
    <main>
      {{ content }}
    </main>
    {% include footer.html %}
  </body>
</html>
`.trim(),
  '_layouts/post.html': `
---
layout: default
---
<article class="post">
  <h1>{{ page.title }}</h1>
  <div class="entry">
    {{ content }}
  </div>
  <div class="date">
    Written on {{ page.date | date: "%B %e, %Y" }}
  </div>
</article>
`.trim(),
  '_includes/header.html': `
<header>
  <nav>
    <a href="{{ '/' | relative_url }}">Home</a>
  </nav>
</header>
`.trim(),
  '_includes/footer.html': `
<footer>
  <p>&copy; ${new Date().getFullYear()} Your Name</p>
</footer>
`.trim(),
  'assets/css/style.css': `
/* A simple CSS reset */
body, h1, h2, p, ul, li {
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  line-height: 1.6;
  color: #333;
  background: #fdfdfd;
  padding: 20px;
}
`.trim(),
  'Gemfile': `
source "https://rubygems.org"
gem "jekyll"
gem "minima"
`.trim(),
};