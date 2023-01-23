Notes from transitioning blog from Jekyll to 11ty, but still using Jekyll theme Minimal Mistakes.

Just to see if it reduces that cpu usage. Nope.

Removed from site.json

```
  "post_template": "post",
  "page_template": "page",
  "draft_template": "draft"
```

hacked pathPrefix into relativeURLAlt function because for some reason it isn't being picked up from the above return.

author_profile.html for adding mastodon

invalid date format https://github.com/11ty/eleventy/issues/413