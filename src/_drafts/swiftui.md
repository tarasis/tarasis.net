---
layout: single
author_profile: true
read_time: true
share: true
related: true
title: SwiftUI
tags: [swiftui,programming,ios, swift]
category: Programming
eleventyExcludeFromCollections: true
---

Its been a long while since I sat and did programming, but between a life situation and the new technology from Apple for creating user interfaces (SwiftUI), I've been inspired to pickup again an idea I've been kicking around for 10 years.

<!--more-->

SwiftUI simplifies designing interfaces
Provides a fast means of iterating design
Able to quickly see results
Easy to mock in data

Buggy.
Filled 3 bugs so far.

Swift:

{% highlight swift %}
     override public func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        super.touchesBegan(touches, with: event)
        currentTouchPosition = touches.first?.location(in: self)

        NSObject.cancelPreviousPerformRequests(withTarget: self)
    }
{% endhighlight %}

Swift:

```swift
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

Bash:
```bash

#!/usr/bin/env bash
set -e # halt script on error

echo
echo "------------------------------------------------------------------------------------------------------------------------"
if [ "$TRAVIS_PULL_REQUEST" != "false" -a "$TRAVIS_BRANCH" == "comments" ]; then

    echo
    echo "Building site for pull request for $TRAVIS_BRANCH..."
    bundle exec jekyll build --config _config.yml --source . --destination ./docs
    echo "Site built into /docs"

    echo
    echo "Proofing links"
    bundle exec htmlproofer ./docs --disable-external --allow_hash_href
    echo "Proofing links complete"
    echo
    echo "------------------------------------------------------------------------------------------------------------------------"

    exit 0

elif [ "$TRAVIS_BRANCH" == "master" ]; then

    echo
    echo "Building site for $TRAVIS_BRANCH..."
    bundle exec jekyll build --config _config.yml --source . --destination ./docs
    echo "Site built into /docs"

    echo
    echo "Proofing links"
    bundle exec htmlproofer ./docs --disable-external --allow_hash_href
    echo "Proofing links complete"
    echo
    echo "------------------------------------------------------------------------------------------------------------------------"

    exit 0

else

    echo
    echo "Build not triggered internally"
    echo
    echo "------------------------------------------------------------------------------------------------------------------------"
    exit 0

fi
```

Ruby:

{% highlight ruby %}
require "gem"

number = 0
regexp = /[abc]/

# This is a comment
class Person

  attr_accessor :name

  def initialize(attributes = {})
    @name = attributes[:name]
  end

  def self.greet
    "hello"
  end
end

person1 = Person.new(:name => "Chris")
puts "#{Person::greet} #{person1.name}\n"
{% endhighlight %}

html:

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Title</title>
    </head>

    <body>
        <h1 id="heading">Heading</h1>
        <p class="class">This is an example paragraph.</p>
    </body>

</html>
```

css:
```css
.highlight pre {
  width: 100%;
}

.highlight .hll {
  background-color: $base06;
}
.highlight {
  .c {
    /* Comment */
    color: $base04;
  }
}
```

Javascript:

```javascript
$(document).ready(function() {
  // FitVids init
  $("#main").fitVids();

  // Sticky sidebar
  var stickySideBar = function() {
    var show =
      $(".author__urls-wrapper button").length === 0
        ? $(window).width() > 1024 // width should match $large Sass variable
        : !$(".author__urls-wrapper button").is(":visible");
    if (show) {
      // fix
      $(".sidebar").addClass("sticky");
    } else {
      // unfix
      $(".sidebar").removeClass("sticky");
    }
  };
}
```

<p>notice</p>{: .notice}
<p>primary</p>{: .notice--primary}
<p>info</p>{: .notice--info}
<p>warning</p>{: .notice--warning}
<p>success</p>{: .notice--success}
<p>danger</p>{: .notice--danger}

<div class="notice--success" markdown="1">
  # Headline for the Notice
  <br>
  Text for the notice
</div>