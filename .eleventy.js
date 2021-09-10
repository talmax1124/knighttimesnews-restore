const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("./build/styles.css");
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("./src/css/styles.css");
  eleventyConfig.addPassthroughCopy("./src/style.css");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/_redirects");
  eleventyConfig.addPassthroughCopy("./src/robots.txt");

  module.exports = function(eleventyConfig) {

    eleventyConfig.addFilter("getAuthor", (authors,label) => {
      let author = authors.filter(a => a.key === label)[0];
      return author;
    });
  
    eleventyConfig.addFilter("getPostsByAuthor", (posts,author) => {
      return posts.filter(a => a.data.author === author);
    });
  };

  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  return {
    dir: {
      input: "src",
      output: "public",
    },
  };
};
