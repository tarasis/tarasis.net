---
title: Copy Code Blocks
tags: [webdev, site, dev]
category: [site, webdev]
date: 2023-02-19
---

I've been reading [Bryce Wray's](https://www.brycewray.com) site for a little while. Its been interesting watching Bryce switch back and forth between [Hugo](https://github.com/brycewray/hugo_site) and [Eleventy / 11ty](https://github.com/brycewray/eleventy_site). Keeping both in sync feature wise.

Just recently Bryce did a post about adding [Code for Copying Code](https://www.brycewray.com/posts/2023/02/code-copying-code-eleventy-edition/) in Eleventy. Essentially for any code block, it adds an icon (or you could switch it out for text) inside a code block that you can click and it will copy the code to your clipboard.

On my site, the icon looks like this[^1]:

![Screenshot of the top right corned of a code block. There is a small grey button with two overlapping squares shown](/assets/images/posts/copy-code-block.png)

I am using Bryce's JavaScript virtually verbatim. The only difference is that I hook into the `load` event. Source from [copy-code-button.js](https://github.com/tarasis/tarasis.net/blob/main/src/assets/js/copy-code-button.js), with a minor change to the colour of the `svgCheck`.

```js
/*
h/t to...
- https://www.brycewray.com/posts/2023/02/code-copying-code-eleventy-edition/ & Bryce's gitrepo
- https://github.com/brycewray/eleventy_site/blob/main/src/assets/js/copy-code-button.js
- https://www.dannyguo.com/blog/how-to-add-copy-to-clipboard-buttons-to-code-blocks-in-hugo/
- https://aaronluna.dev/blog/add-copy-button-to-code-blocks-hugo-chroma/
- https://simplernerd.com/hugo-add-copy-to-clipboard-button/
- https://digitaldrummerj.me/hugo-add-copy-code-snippet-button/
*/

const svgCopy =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"></path><path fill-rule="evenodd" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"></path></svg><span class="sr-only"> Click to copy code</span>';
const svgCheck =
    '<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"><path fill-rule="evenodd" fill="rgb(25, 0, 255)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg><span class="sr-only"> Copied!</span>';

const addCopyButtons = (clipboard) => {
    // 1. Look for pre > code elements in the DOM
    document.querySelectorAll("pre > code").forEach((codeBlock) => {
        // 2. Create a button that will trigger a copy operation
        const button = document.createElement("button");
        button.className = "clipboard-button";
        button.type = "button";
        button.innerHTML = svgCopy;
        button.addEventListener("click", () => {
            clipboard.writeText(codeBlock.innerText).then(
                () => {
                    button.blur();
                    button.innerHTML = svgCheck;
                    setTimeout(() => (button.innerHTML = svgCopy), 2000);
                },
                (error) => (button.innerHTML = "Error")
            );
        });
        // 3. Append the button directly before the pre tag
        //    (with content-searching fix in place for Prism)
        const pre = codeBlock.parentNode;
        pre.parentNode.insertBefore(button, pre);
    });
};

function addCopyButtonsAfterLoad() {
    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    } else {
        const script = document.createElement("script");
        script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js";
        script.integrity =
            "sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=";
        script.crossOrigin = "anonymous";
        script.onload = () => addCopyButtons(clipboard);
        document.body.appendChild(script);
    }
}

window.addEventListener("load", addCopyButtonsAfterLoad);
```

As this site is a franken-baby, an 11ty site using the Minimal Mistakes theme, I needed to use `liquid` rather than `njk` code in my page layout file. So in [single.html](https://github.com/tarasis/tarasis.net/blob/main/src/_includes/layouts/single.html) I removed {% raw %}`{{content}}`{% endraw %} and replaced it with:

{% raw %}
```liquid
{% assign Content = content %}
{% assign withoutDivStart = '<pre ' %}
{% assign withDivStart = '<div class="highlight codeblock"><pre ' %}
{% assign withoutDivEnd = '</code></pre>' %}
{% assign withDivEnd = '</code></pre></div>' %}

{% if content contains withoutDivStart %}
  {% assign Content = content | replace: withoutDivStart, withDivStart %}
  {% assign Content = Content | replace: withoutDivEnd, withDivEnd %}
{% endif %}

{{ Content }}
```
{% endraw %}

This wraps a `div` around the `pre + code` block that is output by the syntax highlighting plugin (I'm currently using a [Chroma plugin](https://github.com/tarasis/eleventy-plugin-syntaxhighlighting-chroma) I wrote, more in a later post). This is so we can set  `position: relative` on the `div`, and `position:absolute` on the button.

The last part is the CSS, for me I'm currently putting the changes in [main.scss.liquid](https://github.com/tarasis/tarasis.net/blob/main/src/assets/css/main.scss.liquid). There are only minor color differences from Bryce's code. It also works with code blocks that have line numbers, but only when embedded in a table otherwise it copies the line numbers too. (For instance below is done using `css/lineNumbers/table` [^2])

```css/lineNumbers/table
div.highlight {
	position: relative;
}

// === for copy-code-to-clipboard

// h/t https://simplernerd.com/hugo-add-copy-to-clipboard-button/

.clipboard-button {
	position: absolute;
	top: 2px;
	right: 2px;
	padding: 6px 8px 4px 8px;
	margin: 5px;
//	color: gray-500;
//	border-color: gray-500;
//	background-color: gray-100;
	border: 1px solid;
	border-radius: 6px;
	font-size: 0.8em;
	z-index: 1;
	opacity: 0;
	transition: 0.1s;
}
.clipboard-button > svg {
//	fill: gray-500;
}
.clipboard-button:hover {
	cursor: pointer;
	border-color: #01b139;
	background-color: #87d09e;
	opacity: 1;
}
.clipboard-button:hover > svg {
	fill: #1900ff;
}
.clipboard-button:focus {
	outline: 0;
}
// .highlight {
//   position: relative;
// }
.highlight:hover > .clipboard-button {
	opacity: 1;
	transition: 0.2s;
}

.highlight {
	line-height: 1.5;
}
```

And thats it, the site now supports copying the code from the blocks at the press of a button.

[^1]: I'm well aware that the following CSS should be out in its own file. Aside, the reason this file has a `liquid` file extension is that during the site build the theme is baked into it from a variable in [site.json](https://github.com/tarasis/tarasis.net/blob/main/src/_data/site.json). I then use a separate step to sass build the compiled file.

[^2]: I had to do a hack to great rid of additional space that was being added despite `margin`, `padding` and anything else being set to `0`. I have tried various combinations. In theory nothing is adding `padding` or `margin` to the `table`, `tbody`, `tr`, or `td`; indeed they are explicitly set to 0. And yet there was still a chunk of spacing being added. I discovered that setting portions to `display:` `flex` & `inline-flex` solved the issue for Safari / Chrome, and `flex` and `ruby-base` for Firefox. All are hacks, but they provide the results that I want. (I was up to 4am trying to find that behaviours I wanted; not helped by Firefox not yet supporting `:has()` 🙈)
