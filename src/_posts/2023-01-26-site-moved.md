---
title: Site transitioned from Jekyll to 11ty
tags: [webdev, site, personal]
category: [site, webdev, personal]
date: 2023-01-26
last_modified: 2023-01-26
---

After numerous hours / days of hacking (much more than I care to admit), I have moved the blog from  [Jekyll](https://jekyllrb.com) to the static site generator [11ty](https://www.11ty.dev/). All the while maintaining using the Jekyll theme [Minimal Mistakes Theme](https://mmistakes.github.io/minimal-mistakes/).

TIP: Unless you are wed to the theme, don't try porting it. Really. Headaches await. 🤯
{: .notice--warning}

There was a surprising amount of hacking needed to get the `liquid` calls to work properly. The main issue is that main of the required variables don't contain the data expected by `Minimal Mistakes`. So this mean debugging to find what is where. For instance the `post` variable doesn't contain a posts `title`, that is usually a global variable. (Same with many others) HOWEVER, there are instances where the `title` might actually be in a passed in variable at `include.aPost.data.title`, or `post.data.title` for the RSS feed file.

Not everything is in place; specifically site search is currently disabled as is the archive of posts by year, and finally comments aren't working though in theory they should (they had also stopped working on the Jekyll version of the site). All will be returned at some point.

All that said, despite the change to keep the theme ... I will ultimately be moving away from it. While I like it, I can't easily do some of the things I'd like to do and going my own way will be a way to hopefully show my improving HTML/CSS/JS skills.

Also todo: add mappings from old urls to new. Most are the same, but a handful have been fixed to remove a space.

Before I finish I should give some thanks / hat tips so various blog posts / git hub repos for bits I've cribbed.

First and foremost is a blog / repo by [Quinn Dombrowski](https://quinndombrowski.com/blog/2022/02/10/eleventy-and-me/). Her post was what led me to realise that I could actually get `Minimal Mistakes theme` running on 11ty. I spent a little time with her blog [repo](https://github.com/quinnanya/quinnanya.github.io), initially mostly going through the steps to get it to build with 11ty 1.0.x or 2.0.0beta1.

Once I got it building, I started trying to port `Minimal Mistakes` myself, only cribbing bits out of `.eleventy.js`. I figured the best way to understand how it was to work with `11ty` was to do the changes to the templates myself. Although in the end I did wholesale rip Quinn's code for pagination on the front page because I couldn't get the original `paginatior` code to work.

Also of use was in no particular order:
  * [Xavier's post on migrating Jekyll to Eleventy](https://savjee.be/blog/migrating-this-blog-from-jekyll-to-eleventy/). There are still some ideas I'd like to use from the post and use Xavier's method for loading the disqus comments. Also the section on "Check visual differences" was great.
  * [ Jérôme's post "From Jekyll to Eleventy"](https://www.webstoemp.com/blog/from-jekyll-to-eleventy/). While I didn't use anything Jérôme mentions, it was helpful to see someone else had gone through the process of moving.
  * [Ian's similar post "Moving this blog from Jekyll to 11ty"](https://www.ianfeather.co.uk/moving-this-blog-from-jekyll-to-11ty/). Again was just useful reading.
  * [Kitty's post "From Jekyll to 11ty"](https://kittygiraudel.com/2020/11/30/from-jekyll-to-11ty/). Some useful bits to be found. I sort of used Kitty's permalink, although I used `"permalink": "/{{ page.date | date: 'Y/M/D' }}/{{ page.fileSlug }}/"`. Also made use of `group_by` from `.eleventy.js` from Kitty's [Github repo](https://github.com/KittyGiraudel/site/blob/main/.eleventy.js)
  * [Rob's post on "Compile Sass with eleventy](https://blog.r0b.io/post/compile-sass-with-eleventy/). While I didn't end up using this technique, I did initially start with it. The reason I didn't was that I wanted to have the initial `main.scss` file be a `liquid` markup file, so my choice of theme was backed in before compiling. So what happens now is I build the 11ty site first, then build sass, compiling the sass files after baking.
  * [Dennis also had an article on "Compile Sass with Eleventy"](https://www.hendricks.rocks/compile-sass-with-eleventy/).
  * [Michael's "eleventy-filter-relative-url" plugin](https://www.npmjs.com/package/eleventy-filter-relative-url?activeTab=explore). I ended up putting the code for it directly into my `.eleventy.js` because the package kept causing issues with `npm install`. It required using `--legacy-peer-deps` every time I wanted to install a new package. I ended up altering the code a little too. Ultimately I moved away from the `relative_url` behaviour, function works like an absolute url.

I'm sure there might be something else I'm forgetting, and I will update the post if I remember.