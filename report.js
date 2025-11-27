function printPages(pages) {
  console.log("=================");
  console.log("Page Hits Report:");
  console.log("=================");

  const sortedPages = sortpages(pages);
  for (const sortedPage of sortedPages) {
    const url = sortedPage[0];
    const hits = sortedPage[1];
    console.log(`Found ${hits} links to page: ${url}`);
  }
  console.log("=================");
  console.log("End Report");
  console.log("=================");
}

function sortpages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    aHits = a[1];
    bHits = b[1];
    return bHits - aHits;
  });

  return pagesArr;
}

module.exports = {
  sortpages,
  printPages,
};
