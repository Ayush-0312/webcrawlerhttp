const { crawlPage } = require("./crawl.js");
const { printPages } = require("./report.js");

async function main() {
  if (process.argv.length < 3) {
    console.log("No website provided");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("Too many command line arguments provided");
    process.exit(1);
  }
  const baseUrl = process.argv[2];

  console.log(`starting crawl of ${baseUrl}`);
  const pages = await crawlPage(baseUrl, baseUrl, {});

  printPages(pages);
}

main();
