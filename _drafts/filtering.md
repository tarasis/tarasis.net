---
title: Filtering
tags: [webdev, javascript]
category: programming
---

I was watching the video [How To Create A Search Bar In JavaScript](https://www.youtube.com/watch?v=TlP5WIxVirU) by [Web Dev Simplified](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw) to learn how to do a search bar in JavaScript. 

What I realised as I was coding along, was that the video was reallymore about filtering data than what I might think of as a search bar. Which is fine, and totally not wrong, but I do find some of Kyle's choices suspect / curious.

For instance he uses data attributes for selecting elements from the html, and runs `toLowerCase()` on strings every single time you type a character. The latter to my mind seems incredibly wasteful.

```javascript
searchInput.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();
    users.forEach((user) => {
        const isVisible =
            user.name.toLowerCase().includes(value) ||
            user.email.toLowerCase().includes(value);

        user.element.classList.toggle("hide", !isVisible);
    });
});
```

