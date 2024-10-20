const siteURL = "https://tarasis.net";

const fs = require("fs-extra");
const sass = require("sass");
const { promisify } = require("util");
const sassRender = promisify(sass.render);
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const markdownIt = require("markdown-it");
const markdownItRenderer = new markdownIt();
const markdownItAnchor = require("markdown-it-anchor");
const pluginTOC = require("eleventy-plugin-toc");
const moment = require("moment");
const description = require("eleventy-plugin-description");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const xmlFiltersPlugin = require("eleventy-xml-plugin");
const yaml = require("js-yaml");
const syntaxHighlight = require("eleventy-plugin-syntaxhighlight-chroma");
const highlight = require("chroma-highlight");
const eleventySass = require("@11tyrocks/eleventy-plugin-sass-lightningcss");

const inspect = require("node:util").inspect;

const path = require("path");

module.exports.config = {
    pathPrefix: "/",
};

module.exports = async function (eleventyConfig) {
    // const urlFilter = await import("@11ty/eleventy/src/Filters/Url");
    const indexify = (url) => url.replace(/(\/[^.]*)$/, "$1index.html");

    let pathPrefix = "/";

    eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
    eleventyConfig.addDataExtension("yml", (contents) => yaml.load(contents));

    // eleventyConfig.addPlugin(UpgradeHelper);

    eleventyConfig.addPlugin(pluginRss);
    //Blog excerpts
    eleventyConfig.addPlugin(description);
    // Eleventy Navigation (https://www.11ty.dev/docs/plugins/navigation/)
    eleventyConfig.addPlugin(require("@11ty/eleventy-navigation"));
    // Eleventy RSS Feed (https://www.11ty.dev/docs/plugins/rss/)
    eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));
    // Filter to generate a Table of Contents from page content
    eleventyConfig.addPlugin(pluginTOC, {
        tags: ["h2", "h3"],
        wrapper: "div",
    });
    // TODO https://www.npmjs.com/package/eleventy-plugin-meta-generator
    // Eleventy Syntax Highlighting (https://www.11ty.dev/docs/plugins/syntaxhighlight/)
    // eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

    eleventyConfig.addPlugin(syntaxHighlight, {
        theme: "base16-snazzy",

        lexerOverrides: {
            njk: "vue",
            liquid: "vue",
        },
    });

    // eleventyConfig.addPlugin(syntaxHighlight, {

    //     alwaysWrapLineHighlights: true,
    //             // Change which Eleventy template formats use syntax highlighters
    //     // templateFormats: ["*"], // default

    //     // Use only a subset of template types (11ty.js added in v4.0.0)
    //     // templateFormats: ["liquid", "njk", "md", "11ty.js"],

    //     // init callback lets you customize Prism
    //     // init: function({ Prism }) {
    //     //   Prism.languages.myCustomLanguage = /* */;
    //     // },

    //     // Added in 3.1.1, add HTML attributes to the <pre> or <code> tags
    //     preAttributes: {
    //       tabindex: 0,

    //       // Added in 4.1.0 you can use callback functions too
    //       "data-language": function({ language, content, options }) {
    //         return language;
    //       }
    //     },
    //     codeAttributes: {},
    //   });

    // assert(typeof highlight === "function");
    // eleventyConfig.addPlugin(highlight);

    // eleventyConfig.addMarkdownHighlighter(
    //     highlight(
    //         `--formatter html --html-only --html-inline-styles --lexer typescript --style base16-snazzy`
    //     )
    // );

    eleventyConfig.addPlugin(xmlFiltersPlugin);

    // eleventyConfig.addPlugin(eleventySass);

    // Custom Collections
    eleventyConfig.addCollection("pages", (collection) =>
        collection.getFilteredByGlob("./src/_pages/**/*")
    );

    eleventyConfig.addCollection("posts", (collection) => {
        availablePages = collection
            .getFilteredByGlob("./src/_posts/**/*")
            .filter(
                (item) => item.data.draft !== true && item.date <= new Date()
            )
            .reverse()
            .map((cur, i, all) => {
                cur.data["siblings"] = {
                    next: all[i - 1],
                    prev: all[i + 1],
                };
                return cur;
            });

        return availablePages;
    });

    eleventyConfig.addCollection("projects", (collection) =>
        collection
            .getFilteredByGlob("./src/projects/**/*")
            .sort((a, b) => a.data.weight - b.data.weight)
    );

    // eleventyConfig.addCollection("posts", function (collectionApi) {
    //     return collectionApi.getFilteredByGlob("./src/_posts/**/*.md");
    // });

    eleventyConfig.addCollection("drafts", (collection) =>
        collection
            .getFilteredByGlob("./src/_drafts/**/*")
            .sort((a, b) => a.data.weight - b.data.weight)
    );

    eleventyConfig.addCollection("tags", (collection) => {
        let tags = new Set();

        collection.getAll().forEach((item) => {
            if ("tags" in item.data) {
                if (item.data.tags != undefined) {
                    for (const tag of item.data.tags) {
                        tags.add(tag);
                    }
                }
            }
        });

        return [...tags];
    });

    eleventyConfig.addCollection("categories", (collection) => {
        let categories = new Set();

        collection.getAll().forEach((item) => {
            if ("category" in item.data) {
                if (item.data.category != undefined) {
                    for (const category of item.data.category) {
                        categories.add(category);
                    }
                }
            }
        });

        return [...categories];
    });

    // Filters

    // eleventyConfig.addFilter("markdownify", (str) => {
    //     return markdownItRenderer.renderInline(str);
    // });

    eleventyConfig.addFilter("markdownify", (string) => {
        return md.renderInline(string);
    });

    eleventyConfig.addNunjucksFilter("markdownify", (str) => md.render(str));

    eleventyConfig.addFilter("jsonify", (variable) => JSON.stringify(variable));

    eleventyConfig.addFilter("slugify", (str) =>
        require("slugify")(str, {
            lower: true,
            replacement: "-",
            remove: /[*+~.·,()''`´%!?¿:@]/g,
        })
    );

    eleventyConfig.addFilter("where", (array, key, value) =>
        array.filter((item) => {
            const keys = key.split(".");
            const reducedKey = keys.reduce((object, key) => object[key], item);

            return reducedKey === value ? item : false;
        })
    );

    eleventyConfig.addFilter("date", (date, format = "") =>
        require("moment")(date).format(format)
    );

    eleventyConfig.addLiquidFilter("toUTCString", (date) => {
        const utc = date.toUTCString();
        return moment.utc(utc).format("MMMM Do YYYY");
    });

    eleventyConfig.addFilter("number_of_words", numberOfWords);

    // eleventyConfig.addShortcode("where_exp", function (item, exp) {
    //     console.log(exp);
    //     return eval(exp);
    // });
    eleventyConfig.addFilter("where_exp", function (value) {
        // where_exp function
        return value.hidden != true;
    });

    eleventyConfig.addFilter("inspect", function (obj = {}) {
        return inspect(obj, { sorted: true });
    });

    eleventyConfig.addFilter("debugger", (...args) => {
        console.log(...args);
        debugger;
    });

    eleventyConfig.addFilter("group_by", groupBy);

    eleventyConfig.addLayoutAlias(
        "archive-taxonomy",
        "layouts/archive-taxonomy.html"
    );
    eleventyConfig.addLayoutAlias("archive", "layouts/archive.html");
    eleventyConfig.addLayoutAlias("categories", "layouts/categories.html");
    eleventyConfig.addLayoutAlias("category", "layouts/category.html");
    eleventyConfig.addLayoutAlias("collection", "layouts/collection.html");
    eleventyConfig.addLayoutAlias("compress", "layouts/compress.html");
    eleventyConfig.addLayoutAlias("default", "layouts/default.html");
    eleventyConfig.addLayoutAlias("home", "layouts/home.html");
    eleventyConfig.addLayoutAlias("posts", "layouts/posts.html");
    eleventyConfig.addLayoutAlias("search", "layouts/search.html");
    eleventyConfig.addLayoutAlias("single", "layouts/single.html");
    eleventyConfig.addLayoutAlias("splash", "layouts/splash.html");
    eleventyConfig.addLayoutAlias("tag", "layouts/tag.html");
    eleventyConfig.addLayoutAlias("tags", "layouts/tags.html");
    eleventyConfig.addLayoutAlias("gallery", "layouts/gallery");
    eleventyConfig.addLayoutAlias("drafts", "layouts/drafts");

    // Passthrough copy
    // don't use .gitignore (allows compiling sass to css into a monitored folder WITHOUT committing it to repo)
    eleventyConfig.setUseGitIgnore(false);

    //Copy CNAME
    eleventyConfig.addPassthroughCopy("src/CNAME");

    // Processing configuration
    eleventyConfig.addPassthroughCopy("src/favicon.ico");
    eleventyConfig.addPassthroughCopy("src/admin");
    eleventyConfig.addPassthroughCopy("src/assets");
    // eleventyConfig.addPassthroughCopy({ "src/_sass": "assets/css" });

    let availablePages = [];

    eleventyConfig.addShortcode("post_url", (slug) => {
        let collection = availablePages;

        try {
            if (collection.length < 1) {
                throw "Collection appears to be empty";
            }
            if (!Array.isArray(collection)) {
                throw "Collection is an invalid type - it must be an array!";
            }
            if (typeof slug !== "string") {
                throw "Slug is an invalid type - it must be a string!";
            }

            const found = collection.find((p) => p.fileSlug == slug);
            if (found === 0 || found === undefined) {
                throw `${slug} not found in specified collection.`;
            } else {
                return found.url;
            }
        } catch (e) {
            console.error(
                `RMCG:An error occurred while searching for the url to ${slug}. Details:`,
                e
            );
        }
    });

    // Set section

    // Configure BrowserSync to serve the 404 page for missing files
    // eleventyConfig.setBrowserSyncConfig({
    //     callbacks: {
    //         ready: (_err, browserSync) => {
    //             const content_404 = fs.readFileSync("dist/404.html");

    //             browserSync.addMiddleware("*", (_req, res) => {
    //                 // render the 404 content instead of redirecting
    //                 res.write(content_404);
    //                 res.end();
    //             });
    //         },
    //     },
    // });

    eleventyConfig.setServerOptions({
        // Default values are shown:

        // Whether the live reload snippet is used
        liveReload: true,
        watch: ["dist/assets/css/main.css"],
    });

    // eleventyConfig.setBrowserSyncConfig({
    //     files: "./dist/assets/css/*.css",
    // });

    // Merge Data (https://www.11ty.dev/docs/data-deep-merge/)
    eleventyConfig.setDataDeepMerge(true);

    eleventyConfig.setFrontMatterParsingOptions({
        excerpt: true,
    });

    eleventyConfig.setLibrary("md", markdownIt().use(markdownItAnchor));

    eleventyConfig.setLiquidOptions({
        // dynamicPartials: false,
        // strictVariables: false,
        // strictFilters: false,
        jekyllInclude: true,
    });

    // Markdown Configuration
    const md = require("markdown-it")({
        html: true,
        breaks: true,
        linkify: true,
    });

    eleventyConfig.setLibrary(
        "md",
        md
            .use(require("markdown-it-attrs"))
            .use(require("markdown-it-container"), "", {
                validate: () => true,
                render: (tokens, idx) => {
                    if (tokens[idx].nesting === 1) {
                        const classList = tokens[idx].info.trim();
                        return `<div ${classList && `class="${classList}"`}>`;
                    } else {
                        return `</div>`;
                    }
                },
            })
            .use(require("markdown-it-fontawesome"))
            .use(require("markdown-it-footnote"))
    );

    // override markdown-it-footnote anchor template to use a different unicode character
    md.renderer.rules.footnote_anchor = (tokens, idx, options, env, slf) => {
        var id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);

        if (tokens[idx].meta.subId > 0) {
            id += ":" + tokens[idx].meta.subId;
        }

        /* ⇑ with escape code to prevent display as Apple Emoji on iOS */
        return (
            ' <a href="#fnref' +
            id +
            '" class="footnote-backref">\u21d1\uFE0E</a>'
        );
    };

    //for upgrade sanity
    //eleventyConfig.addPlugin(UpgradeHelper);

    // eleventyConfig.addWatchTarget("./assets/css/");
    // eleventyConfig.addTransform(
    //     "sass",
    //     async function sassTransform(content, outputPath) {
    //         if (outputPath?.endsWith(".css")) {
    //             const { css } = await sassRender({
    //                 data: content,
    //                 outputStyle: "compressed",
    //                 precision: 3,
    //             });
    //             return css;
    //         }
    //         return content;
    //     }
    // );

    // eleventyConfig.addWatchTarget("dist/assets/css/*.css");

    const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");

    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

    eleventyConfig.addFilter("relative_url", relativeURLALT2);

    eleventyConfig.addFilter("absolute_url", absoluteUrl);

    return {
        templateFormats: ["html", "liquid", "md", "njk"],

        pathPrefix,

        environment: "production",

        // absolute_url: "https://tarasis.net/",
        passthroughFileCopy: true,

        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "dist",
            // input: "./", // Equivalent to Jekyll's source property
            // output: "./_site", // Equivalent to Jekyll's destination property
        },
    };
};

function numberOfWords(content) {
    return content.split(/\s+/g).length;
}

// Cheat till I can go through
function relativeURLALT2(url) {
    if (!url.startsWith("/")) {
        throw new Error("URL is already relative");
    }
    return url;
}

function absoluteUrl(url) {
    if (url !== undefined) {
        return siteURL + url;
    } else {
        return siteURL;
    }
}

function groupBy(array, key) {
    const get = (entry) => key.split(".").reduce((acc, key) => acc[key], entry);

    const map = array.reduce((acc, entry) => {
        const value = get(entry);

        if (typeof acc[value] === "undefined") {
            acc[value] = [];
        }

        acc[value].push(entry);
        return acc;
    }, {});

    return Object.keys(map).reduce(
        (acc, key) => [...acc, { name: key, items: map[key] }],
        []
    );
}
