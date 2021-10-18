const { DateTime } = require('luxon');
const readingTime = require('eleventy-plugin-reading-time');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const embedInstagram = require('eleventy-plugin-embed-instagram');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./build/styles.css');
  eleventyConfig.addPassthroughCopy('./src/assets');
  eleventyConfig.addPassthroughCopy('./src/css/styles.css');
  eleventyConfig.addPassthroughCopy('./src/style.css');
  eleventyConfig.addPassthroughCopy('./src/admin');
  eleventyConfig.addPassthroughCopy('./src/_redirects');
  eleventyConfig.addPassthroughCopy('./src/robots.txt');
  eleventyConfig.addPlugin(lazyImagesPlugin);
  eleventyConfig.addPlugin(embedInstagram);

  // Insert current year
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);

  eleventyConfig.addPlugin(readingTime);

  eleventyConfig.addFilter('postDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'dd LLL yyyy'
    );
  });

  function filterTagList(tags = []) {
    return tags.filter(
      (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1
    );
  }

  eleventyConfig.addFilter('filterTagList', filterTagList);

  eleventyConfig.addCollection('tagList', function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach((item) => {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    });

    return filterTagList([...tagSet]);
  });

  return {
    dir: {
      input: 'src',
      output: 'public',
      includes: '_includes',
      data: '_data',
    },
  };
};
