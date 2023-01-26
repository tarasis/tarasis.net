---
title: Site transitioned from Jekyll to 11ty
tags: [webdev, site, personal]
category: [site, webdev, personal]
date: 2023-01-26
---

After numerous hours / days of hacking (much more than I care to admit), I have moved the blog from  [Jekyll](https://jekyllrb.com) to the static site generator [11ty](https://www.11ty.dev/). All the while maintaining using the Jekyll theme [Minimal Mistakes Theme](https://mmistakes.github.io/minimal-mistakes/).

There was a surprising amount of hacking needed to get the `liquid` calls to work properly. The main issue is that main of the required variables don't contain the data expected by `Minimal Mistakes`. So this mean debugging to find what is where. For instance the `post` variable doesn't contain a posts `title`, that is usually a global variable. (Same with many others) HOWEVER, there are instances where the `title` might actually be in a passed in varaible at `include.aPost.data.title`, or `post.data.title` for the RSS feed file.

Not everything is in place; specifically site search is currently disabled as is the archive of posts by year, and finally comments aren't working though in theory they should (they had also stopped working on the Jekyll version of the site). All will be returned at some point.

All that said, despite the change to keep the theme ... I will ultimately be moving away from it. While I like it, I can't easily do some of the things I'd like to do and going my own way will be a way to hopefully show my improving HTML/CSS/JS skills.

Also todo: add mappings from old urls to new. Most are the same, but a handful have been fixed to remove a space.