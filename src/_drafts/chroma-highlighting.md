---
title: Introducing eleventy-plugin-syntaxhighlighting-chroma
tags: [webdev, site]
category: [site, webdev]
date: 2023-02-11
eleventyExcludeFromCollections: true
excerpt: An introduction to the 11ty plugin.
---

To do

[] - Introduce Project
[] - Why did I make it
[] - how to use it
[] - examples
[] - future

One of the things I wanted to do with the revamp of the blog was to make an effort to do more technical writing.

[11ty]() provides its own [plugin](https://github.com/11ty/eleventy-plugin-syntaxhighlight) for syntax highlighting using the [PrismJS]() library. However it doesn't support all the plugins that PrismJS provides. Also missing is support for line numbers, there is an [open issue]() about that, and also [issues](https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/32) about using a different highlight engine; mentioned are [torchlight](https://torchlight.dev), [shiki](https://github.com/shikijs/shiki).

Someone has already written an 11ty plugin, [eleventy-plugin-highlightjs](https://github.com/b-kelly/eleventy-plugin-highlightjs) using HighlightJS.

##