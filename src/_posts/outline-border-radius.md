---
title: Border Radius on an Outline in CSS
tags: [webdev, css]
category: [css, webdev]
date: 2023-02-20
excerpt: A little note about using border-radius with an outline.
layout: single
---

Yesterday I was fiddling with the site adding a button to [copy code blocks]({% post_url "copy-code-blocks" %}) to the clipboard. While I was doing that I figured I'd also add a border to both proper code blocks and to inline code blocks. Something to make them stand out a little more.

Initially I considered using an `outline`, rather than `border`. So that it didn't take up pixels as the site uses `box-sizing: border-box`. However, I discovered that `outline` doesn't allow you to control the radius. There was no `outline-radius` like there is `border-radius`.

After a bit of searching I came across [this](https://stackoverflow.com/questions/5394116/outline-radius) post, which has some solutions and workarounds. Someone noted that there was a Firefox only option: `-moz-outline-radius`. A later [answer](https://stackoverflow.com/a/66661654) noted that as of April 2021 in Firefox you could use `border-radius` but it was the only browser that supported it.

So I dutifully tried it out, and yes it did work.

![Screenshot of an outline around some code, with a border-radius applied](/assets/images/posts/outline-with-border-radius.png)

But then I noticed that it was also working in Safari Technology Preview Release 163! Unfortunately Safari 16.3 (Desktop) doesn't support it.

One possible bug I noticed while experimenting was that Safari TP would ignore the outline style `dashed` if  `border-radius` was set. Safari TP would instead make the outline solid.