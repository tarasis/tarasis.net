// Credits 🙇 for original ideas to:
// Fork of https://github.com/vimtor/eleventy-plugin-external-links
// css.gg SVG icon https://github.com/astrit/css.gg/blob/master/icons/svg/external.svg

const { parse, HTMLElement } = require("node-html-parser");
const { extname } = require("path");

module.exports = eleventyConfig => {
  const options = {
    name: "external-links",
    regex: new RegExp("^(([a-z]+:)|(//))", "i"),
    target: "_blank",
    rel: "noopener noreferrer nofollow",
    extensions: [".html"],
  };

  eleventyConfig.addTransform(options.name, (content, outputPath) => {
    if (outputPath && options.extensions.includes(extname(outputPath))) {
      const root = parse(content);
      const links = root.querySelectorAll("a");
      links
        .filter(link => {
          const href = link.getAttribute("href");
          return (
            href &&
            options.regex.test(href) &&
            !link.getAttribute("rel") &&
            !link.getAttribute("target")
          );
        })
        .forEach(link => {
          link.setAttribute("target", options.target);
          link.setAttribute("rel", options.rel);

          const srText = new HTMLElement("span", { class: "sr-only" });
          srText.textContent = "(opens in a new window)";

          const icon = new HTMLElement(
            "svg",
            {},
            `viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"`
          );
          icon.set_content(`
<path
  d="M15.6396 7.02527H12.0181V5.02527H19.0181V12.0253H17.0181V8.47528L12.1042 13.3892L10.6899 11.975L15.6396 7.02527Z"
  fill="currentColor"
/>
<path
  d="M10.9819 6.97473H4.98193V18.9747H16.9819V12.9747H14.9819V16.9747H6.98193V8.97473H10.9819V6.97473Z"
  fill="currentColor"
/>`);
          link.appendChild(srText);
          link.appendChild(icon);
        });

      return root.toString();
    }
    return content;
  });
};
