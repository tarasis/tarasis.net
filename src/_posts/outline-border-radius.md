---
title: Border Radius on an Outline in CSS
tags: [webdev, css, dev]
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

Codepen with example:

<p class="codepen" data-height="300" data-default-tab="html,result" data-slug-hash="bGxpBdz" data-user="tarasis" style="height: 300px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
  <span>See the Pen <a href="https://codepen.io/tarasis/pen/bGxpBdz">
  Untitled</a> by Robert McGovern (<a href="https://codepen.io/tarasis">@tarasis</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>

The results, as you can see below, are rather different between Safari TP v163, Chrome 110.0.5481.100, and Firefox Developer Edition 111.0b3 (64-bit)

**Safari TP v163**

![Image of codepen output in Safari. Of note the second line of text is supposed to be Outlined with border radius, however only the top left and bottom right have curves. The line below should be the same but with dashed line around the text, however the line is solid.](/assets/images/posts/safaritp-codepen.png)

**Chrome 110.0.5481**

![Image of codepen output in Chrome. Of note the second line is properly curved. The line below is correctly dashed.](/assets/images/posts/chrome-codepen.png)

**Firefox Developer Edition 111.0b3**

![Image of codepen output in Firefox. Of note the second line is outlined with the correct border radius at the beginning and end, however the wrapped text onto the second line has a solid border to its left.](/assets/images/posts/firefox-codepen.png)