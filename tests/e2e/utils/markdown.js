const path = require("node:path");
const fs = require("node:fs");
const markdown = require("markdown-it");
const md = markdown({ html: false });

const getFileContent = file => {
  const filePath = path.join(__dirname, "..", "/filesForUpload/", file);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent;
};

const getLocalRenderedMarkdownTags = file => {
  const fileContent = getFileContent(file);
  const splittedContentByPages = fileContent.split("---");
  // This gives tags with angular brackets "<" and ">" like: "<h1>"
  const renderedFileContent = md
    .render(splittedContentByPages.toString())
    .match(/<[^\/>][^>]*>/g);
  // Remove "<" and ">" from tags: <h1> => h1
  const strippedTags = renderedFileContent.map(tag =>
    tag.replace(/</g, "").replace(/>/g, "")
  );
  return strippedTags;
};

module.exports = { getLocalRenderedMarkdownTags };
