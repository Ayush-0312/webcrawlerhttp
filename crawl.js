const { JSDOM } = require("jsdom");

async function crawlPage(baseUrl, currentUrl, pages) {
  const baseUrlObj = new URL(baseUrl);
  const currentUrlObj = new URL(currentUrl);

  if (baseUrlObj.hostname !== currentUrlObj.hostname) {
    return pages;
  }

  const normalizeCurrentUrl = normalizeUrl(currentUrl);
  if (pages[normalizeCurrentUrl] > 0) {
    pages[normalizeCurrentUrl]++;
    return pages;
  }

  pages[normalizeCurrentUrl] = 1;

  console.log(`Actively crawling: ${currentUrl}`);

  try {
    const resp = await fetch(currentUrl);

    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status} on page: ${currentUrl}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.log(
        `non-html response, content type: ${contentType} on page: ${currentUrl}`
      );
      return pages;
    }

    const htmlBody = await resp.text();

    const nextUrls = getUrlsFromHTML(htmlBody, baseUrl);

    for (const nextUrl of nextUrls) {
      pages = await crawlPage(baseUrl, nextUrl, pages);
    }
  } catch (error) {
    console.log(`error in fetch: ${error.message} on page: ${currentUrl}`);
  }

  return pages;
}

function getUrlsFromHTML(htmlBody, baseUrl) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative url
      try {
        const urlObj = new URL(`${baseUrl}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with relative url: ${error.message}`);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with absolute url: ${error.message}`);
      }
    }
  }
  return urls;
}

function normalizeUrl(urlString) {
  const urlObj = new URL(urlString);
  const hostpath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostpath.length > 0 && hostpath.endsWith("/")) {
    return hostpath.slice(0, -1);
  }

  return hostpath;
}

module.exports = {
  normalizeUrl,
  getUrlsFromHTML,
  crawlPage,
};
