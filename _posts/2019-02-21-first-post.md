---
title: 'First Post: A New Home'
layout: single
author_profile: true
read_time: true
share: true
related: true
date: '2019-02-22 00:54:00 +0100'
---

After many years of using [Wordpress](http://wordpress.org), I've switched to using [Jekyll](https://jekyllrb.com/) with the [Minimal-Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme.

Its a self hosted blog, rather than using [Github Pages](https://pages.github.com) because its not really a programming blog, so it felt a bit cheeky to use it. Plus its always "fun" to setup stuff, learning about using a *post-receive* hook to build the site after making a change to the blog's git repo.

The site is currently being served by [Caddy](http://caddyserver.com) rather than [NGINX](https://www.nginx.com/) but that might change in the future.

Why the changes? Well my dedicated server at [Online.net](https://www.online.net/en) died a number of months ago, and I never got around to properly restoring it to how it was. This is me finally doing that, and making some other changes at the same time.

I know that no-one really reads my blog, I post so infrequently and its not exactly riviting content, but getting the site up and running again, plus getting my wiki back up was bugging me :)

As an  aside I lost a little data, basically my wiki which had a lot of server config stuff, because the default install of Dokuwiki puts the data off in */var/lib/dokuwiki/data* and when I was backing up the main dokuwiki directory I apparently didn't have the setting to follow symlinks on.