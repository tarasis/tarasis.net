---
title: What happens when I finish a Frontend Mentor Challenge (or how I build and deploy an 11ty site)
tags: [webdev, site, frontendmentor, dev]
category: [programming, webdev]
date: 2022-10-15
last_modified: 2023-02-22
---

I've been doing challenges from [Frontend Mentor](https://frontendmentor.io) as a means to practice frontend web development. Specifically working with plain HTML, CSS and JavaScript.

Rather than just take the simple route of a Git repo per challenge, I put them all in a single repo that is pushed to two[^1] servers ([Github](https://github.com/tarasis/tarasis.github.io) and a [Gitea](https://git.tarasis.net/tarasis/tarasis.github.io) instance).

The repo is actually a website built with [11ty](https://www.11ty.dev) and [Nunjucks](https://mozilla.github.io/nunjucks/) for templating. The challenges, and other pages I build are in the **projects** directory. They are simply copied over to **www** during the build.

When I do a `git push all`, on my server it runs a `post-receive` script that does the 11ty build. (script below) On Github I use a **Github Action**[^2] which builds the site and then a separate action that deploys the page. Vercel watches the main branch on Github for updates and does a similar build action and deployment.

That is then deployed to three different places: [Github Pages](https://tarasis.github.io), [Vercel](https://tarasis.vercel.app), and my own site at [rmcg.dev](https://rmcg.dev).

## Digging a little deeper

The front page of the deployed site acts as a gateway to all of the challenges, for instance this is the newbie section for Frontend Mentor challenges:

![Screenshot of the newbie section of the my portfolio website](/assets/images/portfolio.png)

Each section is generated from a json file I created ([src/_data/webprojects.json](https://github.com/tarasis/tarasis.github.io/blob/main/src/_data/webprojects.json)), where I have the service name, location of an svg file, alt text for it, the difficulty level, then there is an array of challenges in that difficulty level.

```json
"services": [
    {
    "name": "Frontend Mentor",
    "svgSource": "/svgs/frontendmentor.svg",
    "svgAltText": "Frontend Mentor Logo",
    "description": "Collection of challenges I completed for Frontend Mentor",
    "cssClass": "",
    "difficulty": [
        {
            "title": "Junior",
            "cssClass": "frontEndMentorChallenges",
            "challenges": [
                {
                    "title": "Advice Generator App",
                    "url": "/FrontendMentor/junior/advice-generator-app/",
                    "description": "",
                    "techUsed": [
                        "html5",
                        "css3",
                        "js"
                    ],
                    "screenshotURL": "/FrontendMentor/junior/advice-generator-app/screenshots/mobile.png",
                    "screenshotAltText": "Advice Generator App"
                }
            ]
        },
```

When the 11ty build occurs, it takes two nunjucks snippets then first takes the service section and fills out the details:

{% raw %}
```njk
{% for service in webprojects.services %}
    <div class="projectsDiv {{service.cssClass}}">
        <div class="alignedHeader">
            <h2 class="projectsSection__title">{{service.name}}</h2>
            {% if service.svgSource%}
                <img src="{{service.svgSource}}" alt="{{service.svgAltText}}"/>
            {% endif %}
        </div>
        {% if service.description%}
            <p>{{service.description}}</p>
        {% endif %}

        {% for difficultyLevel in service.difficulty %}
            {% if difficultyLevel.challenges | length %}
                <div class="{{difficultyLevel.cssClass}}">
                    {% if difficultyLevel.title%}
                        <h3>{{difficultyLevel.title}} Challenges</h3>
                    {% endif %}
                    {% if difficultyLevel.description%}
                        <p>{{difficultyLevel.description}}</p>
                    {% endif %}
                    <div class="projects-grid">
                        {% for challenge in difficultyLevel.challenges %}
                            {% set projectContent = challenge %}
                            {% include "components/project.njk" %}
                        {% endfor %}
                    </div>
                </div>
            {% endif %}
        {% endfor %}
    </div>
{% endfor %}
```
{% endraw %}

If you note the `div` with class `projects-grid`, this is where the second nunjucks snippet occurs. It loops through all of the challenges in the json array represented by `difficultyLevel.challenges`.

Basically I pass in the challenge to the snippet below, and use the contents to fill out the a card with a screenshot of the finished build, a short description, and shields for HTML/CSS and if used JavaScript. When I get to later challenges I'll add in 11ty, Vue or whatever. (I'll probably simplify the code too so it grabs the tech svg based on the name, rather than having if checks ... we'll see.)

{% raw %}
```liquid
{# {% set projectPrefix = project %} #}

{% if projectContent %}
    <div class="project-card stacked">
        <a href="{{projectContent.url}}">
            <img loading="lazy" class="card__img" src="{{projectContent.screenshotURL}}"
                        alt="{{projectContent.screenshotAltText}}"/>
        </a>
        <div class="card__content">
            <h3 class="card__title">
                {{projectContent.title}}
            </h3>
            {% if projectContent.description | length %}
                <p class="card__description">
                    {{projectContent.description}}
                </p>
            {% endif %}
            <ul class="card__techUsed">
                {% for tech in projectContent.techUsed %}
                    {% if tech === "html5" %}
                        <li>
                            <img src="/svgs/html5.svg" alt="HTML5"/>
                        </li>
                    {% endif %}
                    {% if tech === "css3" %}
                        <li>
                            <img src="/svgs/css3.svg" alt="CSS3"/>
                        </li>
                    {% endif %}
                    {% if tech === "js" %}
                        <li>
                            <img src="/svgs/javascript.svg" alt="JavaScript"/>
                        </li>
                    {% endif %}
                {% endfor %}
            </ul>
        </div>
    </div>
{% endif %}
```
{% endraw %}

When my Git server receives a push, a `post-receive` hook is called. It checks that the submission is on the `main` branch, and if it is then it installs any needed npm packages, runs `npm run build` and then rsyncs the files over to the web server. The script

```shell
#!/bin/bash

HOME=/srv/gitea
source /srv/gitea/.profile

echo $PATH

# add test so that if bundle isn't found end script

#export PATH="$HOME/.rvm/bin:$PATH"
#eval "$(rbenv init -)"

##############################
########## Settings ##########
##############################

# Useful environment variables (gitea):
#   GITEA_REPO_NAME         Repository name
#   GITEA_REPO_USER_NAME    Repo owner username
#   GITEA_PUSHER_NAME       The username that pushed the commits
#   GITEA_AUTHOR            Same as above
#   GIT_WORKING_TREE        location to checkout the current tree

#   GIT_HOST                Domain name the repo is hosted on. Default: git.starbeamrainbowlabs.com

if [ "${GIT_HOST}" == "" ]; then
    GIT_HOST="git.tarasis.net";
fi

# The url of the repository in question. SSH is recommended, as then you can use a deploy key.
# SSH:
GIT_REPO_URL="git@${GIT_HOST}:${GITEA_REPO_USER_NAME}/${GITEA_REPO_NAME}.git";
# HTTPS:
# git_repo_url="https://git.starbeamrainbowlabs.com/${GITEA_REPO_USER_NAME}/${GITEA_REPO_NAME}.git";

# The user that pushed the commits
GIT_AUTHOR="${GITEA_PUSHER_NAME}";

# The working tree folder
GIT_WORKING_TREE="/srv/deploy/${GITEA_REPO_NAME}"

##############################

###### Internal Settings ######

while read oldref newref ref
do
    if [[ $ref =~ .*/main$ ]];
    then
        echo "Main ref received.  Deploying main branch to production..."
        echo "Creating ${GIT_WORKING_TREE} if needed"
        mkdir -p ${GIT_WORKING_TREE}
        echo "Checking out repo to working tree folder"
        git --work-tree=${GIT_WORKING_TREE} --git-dir="/srv/gitea/data/gitea-repositories/${GIT_AUTHOR}/${GITEA_REPO_NAME}.git" checkout -f
        echo "cd to ${GIT_WORKING_TREE}"
        cd ${GIT_WORKING_TREE}
        echo "install npm modules"
        npm install
        echo "clean old build files"
        rm -rf www
        echo "build files"
        npm run build
        echo "rsyncing files to webserver"
        rsync -azv ${GIT_WORKING_TREE}/www/ <REMOVED>@ams.tarasis.net:/srv/http/rmcg.dev --delete-after
        echo "Completed"
    else
        echo "Ref $ref successfully received.  Doing nothing: only the main branch may be deployed on this server."
    fi
done

```

The finished build is then copied and published.

## Improvements ...

~~There are improvements I will make at some point, specifically adding optimisation of the images I use. There is little point is downloading a 1440x800px image for the challenge preview when only a small portion of it is shown. I am aware that during the build process you can have 11ty generate more web friendly images at differing sizes.~~

I now do this, but haven't pushed it live yet. I'm waiting till I have completed another Junior level project.

## Final thoughts

First if you want to know more about whats going on, please do ask I'll do my best to answer. Otherwise I've found 11ty incredibly useful for this purpose, and easy to use. So much so that my intent was/is to move the blog from Jekyll to 11ty ... I just haven't gotten to it yet and because I like the Minimal Mistakes theme I use here.

Having a static site where I can quickly add a challenge to the front page without having to repeat html myself is just a such a relief. Especially as the file gets longer and longer :) At this point in time I've finished 17 challenges for Frontend Mentor with 75 ish more to go. There's 1 for Dev Challenges, and 5 for FreeCodeCamp.

**NOTE** ... There are other project directories that aren't listed on the front page. You can see the code in the projects directory on Github / my gitea instance, and live under [others](https://rmcg.dev/others/). They are things I've done based of Youtube videos or other videos.

[^1]: Because I like redundancy when I can, and I want control of my code.

[^2]: The build action I use is just up above, because apparently I can't have anything below footnotes go figure 🤪 ...

### Github build action

My Github 11ty build action

```yaml
name: Build Eleventy

on:
    push:
        branches:
            - main

jobs:
    build:
        runs-on: ubuntu-latest

        strategy:
            matrix:
                node-version: [17.x]

        steps:
            - uses: actions/checkout@v2

            - name: Use Node.js ${{ matrix.node-version }}
              uses: actions/setup-node@v2
              with:
                  node-version: ${{ matrix.node-version }}

            - name: Install dependencies & build
              run: |
                  npm ci
                  npm run build

            - name: Deploy
              uses: peaceiris/actions-gh-pages@v3.7.3
              with:
                  publish_dir: ./www
                  github_token: ${{ secrets.GITHUB_TOKEN }}
```
