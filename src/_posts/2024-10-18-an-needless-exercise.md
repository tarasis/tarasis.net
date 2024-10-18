---
title: An Needless Exercise in frustration Eleventy 2.x -> 3.0
description: ""
date: 2024-10-18T13:13:03.320Z
preview: ""
tags: [site, personal]
category: [site, personal]
excerpt: A frustrating update to 11ty / Eleventy 3.0 release, esp when I plan to switch to Astro
layout: single
---

For reasons of sanity, or insanity really, I figured I might as well update the mechanics of the blog From Eleventy 2.x to the fresh and shiny new 3.0. I figured it couldn't hurt too much surely.

Boy was I wrong!

And unfortunately, I didn't take extensive notes as I went along. One of the issues stemmed from having not swapped to `pathPrefix` when v2 came along. Instead I had been using a 3 year old npm eleventy plugin to get relative urls.

It was loading this particular filter: `const urlFilter = require("@11ty/eleventy/src/Filters/Url");`

But this caused the build to fail

```autodetect
[11ty] File changed: .eleventy.js
[11ty] Eleventy watch error:
[11ty] 1. Error in your Eleventy config file '.eleventy.js'. (via EleventyConfigError)
[11ty] 2. Package subpath './src/Filters/Url' is not defined by "exports" in /Users/tarasis/Programming/Websites/tarasis.net/node_modules/@11ty/eleventy/package.json imported from /Users/tarasis/Programming/Websites/tarasis.net/.eleventy.js
[11ty]
[11ty] Original error stack trace: Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './src/Filters/Url' is not defined by "exports" in /Users/tarasis/Programming/Websites/tarasis.net/node_modules/@11ty/eleventy/package.json imported from /Users/tarasis/Programming/Websites/tarasis.net/.eleventy.js
[11ty]     at exportsNotFound (node:internal/modules/esm/resolve:296:10)
[11ty]     at packageExportsResolve (node:internal/modules/esm/resolve:643:9)
[11ty]     at packageResolve (node:internal/modules/esm/resolve:822:14)
[11ty]     at moduleResolve (node:internal/modules/esm/resolve:908:18)
[11ty]     at defaultResolve (node:internal/modules/esm/resolve:1038:11)
[11ty]     at nextResolve (node:internal/modules/esm/hooks:748:28)
[11ty]     at resolve (file:///Users/tarasis/Programming/Websites/tarasis.net/node_modules/@11ty/eleventy/src/Util/EsmResolver.js:25:11)
[11ty]     at nextResolve (node:internal/modules/esm/hooks:748:28)
[11ty]     at Hooks.resolve (node:internal/modules/esm/hooks:240:30)
[11ty]     at handleMessage (node:internal/modules/esm/worker:199:24)
```

It was fine, I had already taken the code from the plugin and had put it into my `.eleventy.js`, so I figured I could swap it over to the new `await import` for @11ty stuff. Quick modified `module.exports = async function (eleventyConfig) {}` and moved `const urlFilter = await import("@11ty/eleventy/src/Filters/Url");` into that async function.

Tried again and got the same error.

Googling on the `require("@11ty/eleventy/src/Filters/Url");` brings up precisely 2 posts. Which was pretty impressive. One from 2020, the other from 2021. So nothing useful. You could previously use it, and now you couldn't ([it (Url.js)](https://github.com/11ty/eleventy/blob/main/src/Filters/Url.js) is still there, exported by [defaultConfig.js](https://github.com/11ty/eleventy/blob/main/src/defaultConfig.js))

![Image showing precisely 2 hits](/assets/images/posts/2hits.png)

So this lead me back around to looking at 11ty and URLS, looking at how other people had done relative urls with 11ty and a bunch of debugging and seeing what URLS where being generated, I then discovered `pathPrefix` and the HTML base plugin 😡

So in `.eleventy.js` I now return the URL right back out

```js
// Cheat till I can go through
function relativeURLALT2(url) {
    if (!url.startsWith("/")) {
        throw new Error("URL is already relative");
    }
    return url;
}
```

Why you may wonder, because I don't overly fancy find and replacing `| relative_url }}` 52 times. Especially as I was planning on starting from scratch with Astro.js and having a go at making something more whimsical.

But once I start the upgrade process, I needed to get it working. Plus side it means that I've managed to fix/hack it to that the "correct"[^1] time while now show (with added caveat that it assumes reading at 200 words a minute), and have excerpts generated for older posts that don't have them in the front matter (aka most of them)

![Image of a post on the front page, below the title of is the date it was published, and a small clock icon and a number of minutes](/assets/images/posts/post-date-and-reading-time.png)

I have one issue that remains but I'm not going to fret about it for the moment, the way I have sass set up sometimes means a needed file hasn't been copied over when the sass compile happens, which breaks the compile and no CSS. I will deal with it, but for now I'd rather put the effort into v5 of the much under used TDN Site/Blog

[^1]: Its fair to say there is an inaccuracy between the index page and what you'll see on the post itself. Its usually off by a minute, with no real guarantee which is more accurate. The data being passed into page_meta.html is different if it comes from a post layout, vs what it gets at the time the pagination is generated. I had it turned off on the index pages because it was say 1 min for all articles.

