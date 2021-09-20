const { DateTime } = require("luxon");
const readingTime = require("eleventy-plugin-reading-time");
const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const embedInstagram = require("eleventy-plugin-embed-instagram");
const generator = require('eleventy-plugin-meta-generator');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./build/styles.css");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/css/styles.css");
  eleventyConfig.addPassthroughCopy("./src/style.css");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/_redirects");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(embedInstagram);
  
  eleventyConfig.addCollection("authors", (collection) => {
    const blogs = collection.getFilteredByGlob("articles/*.md");
    return blogs.reduce((coll, post) => {
      const author = post.data.author;
      if (!author) {
        return coll;
      }
      if (!coll.hasOwnProperty(author)) {
        coll[author] = [];
      }
      coll[author].push(post.data);
      return coll;
    }, {});
  });

  // Meta Plugin Generator
  eleventyConfig.addNunjucksTag("generator", (nunjucksEngine) => {
    return new function() {
      this.tags = ["generator"];
 
      this.parse = function(parser, nodes, lexer) {
        var tok = parser.nextToken();
 
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(tok.value);
 
        return new nodes.CallExtensionAsync(this, "run", args);
      };
 
      this.run = function(_, myStringArg, callback) {
    generator()
      .then((metaTag) => {
        let ret = new nunjucksEngine.runtime.SafeString(metaTag);
        callback(null, ret);
      });
      };
    };
  });

  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://knighttimesnews.com",
    },
  });

  // Insert current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "_includes",
      data: "_data",
    },
  };
};
