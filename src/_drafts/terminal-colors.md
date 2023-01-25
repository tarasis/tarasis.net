---
title: terminal-colors

tags:
- programming
category: programming
eleventyExcludeFromCollections: true


---

Color ... I have a problem ...

Or Colour if you're from the UK and associated territories.

Seriously, I legitimately have a problem. I need color when I am working with source code, the terminal or when I am reading computer books (like images, or source code).

I can't explain what it is, but I don't take in the information as well when its monochrome, or minimally highlighted. The more colour, the better I understand it.

For example, this is the default terminal file listing on macOS:

<image of directory listing and source code without highlighting>

and source code from a book:

<source code without highlighting>

The last couple of days I've been exploring how to add more colour to the terminal for file listings and when looking at looking at the content of files.

I'm happy to say there are some apps and settings that make the terminal nirvana like for me.

Improving the colours used by 'ls'

The version of 'ls' provided by Apple in macOS is rather limited in the colours it can display. By that I mean you can't assign particular filetypes their own colours. You are limited (https://www.cyberciti.biz/faq/apple-mac-osx-terminal-color-ls-output-option/) to what can have coloured and the number of colours:

Directories, symbolic links, sockets, pipes, executables, and characters.

Enter GNU ls which is able to display many more colours (256, or 24bit). You can specify different colours for different extensions. Meaning you could have colours for music files (.mp3, .m4a), video files (.avi, .mov, .mp4), office documents (.doc, .xls) and so on.

<sample of ls with tweaked LS_COLOR>

Download a regularly updated list of colours from link https://github.com/trapd00r/LS_COLORS

[NOTE] You can't use the provided scripts on macOS without first installing 'coreutils' (via Homebrew) and then tweaking the shellscripts to use those.

Alternatives to 'ls'

There are two decent alternatives to 'ls' available on GitHub. These improve on its output providing output as grids and trees, and in one case icons.

Both are written in rust

lsd

sdfsdfsd  https://github.com/Peltoche/lsd

exa

dsfsfsd  https://github.com/ogham/exa // https://the.exa.website

Alternative to 'cat'

bat https://github.com/sharkdp/bat

Last but not least 'delta'

https://github.com/dandavison/delta

