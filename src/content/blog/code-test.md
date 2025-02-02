---
title: 'Code Test'
description: 'Lorem ipsum dolor sit amet'
pubDate: 'Jul 08 2022'
# heroImage: '/blog-placeholder-3.jpg'
---

Here is my _great_ post!

Some JS Code

```js title="test.js"
document.addEventListener('scroll', (_) => {
	var docElem = document.documentElement
	var docBody = document.body
	var docScrollTop = docBody.scrollTop || docElem.scrollTop

	readPercent =
		(docScrollTop / (docElem.scrollHeight - docElem.clientHeight)) * 100

	if (readPercent > 0) {
		progressBar = document.querySelector('#progress-bar')
		progressBar.style.setProperty('--scroll', readPercent + '%')
	} else {
		progressBar.style.setProperty('--scroll', '0%')
	}
})
```

Some CSS

```css title="example.css"
.chips {
	/* CSS named colors */
	color: red;
	/* Hexadecimal colors */
	background-color: #fff;
	/* HSL color functions */
	border-color: hsl(0, 0%, 0%);
	/* System colors */
	outline-color: SelectedItem;
	/* Transparent colors */
	background: linear-gradient(rgba(0, 0, 255, 0.25), rgba(0, 0, 255, 0.75));
	/* And more… */
	--more: oklch(70% 0.1 72);
}
```
