# webcrawlerhttp

A **Node.js CLI web crawler** that recursively follows internal links on a website and generates a **text report of all discovered pages**, grouped and sorted by how often they appear in the crawl.

---

## Features

- 📡 **HTTP web crawler (CLI)** – run from the terminal with a single command.
- 🔗 **Crawls only internal links** – stays within the same origin (domain + protocol).
- 🧹 **URL normalization** – removes trailing slashes, lowercases hostnames, etc., to avoid duplicates.
- 📊 **Text report of pages** – prints a neatly formatted list of pages + visit counts, sorted by popularity.
- ✅ **Unit tests with Jest** – separate tests for crawling logic and reporting.
- ⚙️ **Small and focused** – ideal for learning, experimenting, or as a base for more advanced crawlers.

---

## How It Works

1. You provide a **base URL** (e.g. `https://example.com`) via the command line.
2. The crawler:
   - Downloads the HTML for that URL.
   - Extracts all `<a>` tag links.
   - Normalizes them and filters to **same-origin internal links**.
   - Recursively crawls those pages as well, without revisiting the same page many times.
3. A `pages` map/object is built up, where:

   ```text
   {
     "example.com/": 5,       // normalized URL -> visit count
     "example.com/blog": 3,
     "example.com/about": 2,
     ...
   }
   ```

---

## Project Structure

        webcrawlerhttp
        ├─ .gitignore
        ├─ .nvmrc                 # Node version hint
        ├─ README.md              # Readme file
        ├─ main.js                # CLI entry point
        ├─ crawl.js               # Core crawling & URL parsing/normalization logic
        ├─ crawl.test.js          # Jest tests for crawler functions
        ├─ report.js              # Reporting & sorting utilities
        ├─ report.test.js         # Jest tests for reporting functions
        ├─ package.json           # Dependencies & scripts
        └─ package-lock.json

---

## Getting Started

### Prerequisites

- Node.js (recommended: v18+)
- npm (comes with Node)

### Installation

- Clone the repository

  > git clone https://github.com/Ayush-0312/webcrawlerhttp.git

- Move into the project directory

  > cd webcrawlerhttp

- Install dependencies

  > npm install

### Usage

- Run the crawler by passing a base URL as a command line argument:

  > npm start https://example.com

- You should see something like:

  ```text
  starting crawl of https://example.com

  Actively crawling: https://example.com
  Actively crawling: https://example.com/about/
  Actively crawling: https://example.com/blog/
  Actively crawling: https://example.com/contact/
  Actively crawling: https://example.com/index.xml
  non-html response, content type: application/xml on page: https://example.com/index.xml
  Actively crawling: https://example.com/posts/

  =========================
  PAGE HITS REPORT
  =========================

  Found 5 links to page: https://example.com/
  Found 3 links to page: https://example.com/blog
  Found 2 links to page: https://example.com/about
  Found 1 links to page: https://example.com/contact
  Found 1 links to page: https://example.com/posts/

  =========================
  END OF REPORT
  =========================

  ```

### CLI Behaviour & Errors

- No URL provided

  > npm start

  ```text
  No website provided
  ```

- Too many arguments

  > npm start https://example.com extra-arg

  ```text
  Too many command line arguments provided
  ```

- Garbage URL

  > npm start https://example.com/garbage

  ```text
  error in fetch with status code: 404 on page: https://example.com/garbage
  ```

- Valid usage

  > npm start https://example.com

  ```text
  starting crawl of https://example.com
  ...

  ```

### Testing

- Run all tests

  > npm test

      > webcrawlerhttp@1.0.0 test
      > jest

      PASS  ./report.test.js
      PASS  ./crawl.test.js

      Console
      console.log
          error with absolute url: Invalid URL
          error with absolute url: Invalid URL
          at log (crawl.js:73:17)

      Test Suites: 2 passed, 2 total
      Tests:       10 passed, 10 total
      Snapshots:   0 total
      Time:        2.191 s
      Ran all test suites.

---

## Implementation Details

### crawl.js

- normalizeURL(url: string): string

  - Normalizes URLs so that logically identical pages map to the same key.
  - Typical normalization steps:
    - Lowercase the hostname.
    - Remove a trailing slash.
    - Strip protocol differences when comparing.
  - Helps avoid duplicates in the pages map.

- getURLsFromHTML(htmlBody: string, baseURL: string): string[]

  - Parses an HTML string and extracts all href attributes from <a> tags.
  - Resolves relative links (e.g. /about) against the provided baseURL.
  - Returns an array of absolute URLs.

- async crawlPage(baseURL: string, currentURL: string, pages: Record<string, number>): Promise<Record<string, number>>

  - Core recursive crawler:
    - Skips URLs that are not on the same origin as baseURL.
    - Increments count for currentURL in pages.
    - Fetches currentURL, parses HTML, gets all sub-URLs via getURLsFromHTML.
    - Recursively crawls each discovered URL and returns the updated pages map.
  - Handles common error cases:
    - Network failures
    - Non-HTML responses
    - Invalid URLs

### report.js

- sortPages(pages: Record<string, number>): [string, number][]

  - Converts the pages object into an array of [url, count] pairs.
  - Sorts by count (descending), and possibly by URL as a secondary key.
  - Returns the sorted list.

- printReport(pages: Record<string, number>): void

  - Logs a header (PAGE HITS REPORT) and then each page in sorted order.
  - Keeps all formatting concerns in one place, separate from the crawling logic.

### main.js

The entry point for the CLI:

- Reads process.argv to determine:

  - If no URL is passed → print “No website provided” and exit with non-zero status.
  - If more than one argument is passed → print “Too many command line arguments provided” and exit.
  - Otherwise, treat the single argument as baseURL.

- Logs:

  - starting crawl of baseURL

- Calls:
  const pages = await crawlPage(baseUrl, baseUrl, {});
  printReport(pages);

### Test Files

- crawl.test.js

  - normalizeURL behaviour
  - getURLsFromHTML with absolute/relative URLs
  - crawlPage on small HTML fixtures or mocked requests

- report.test.js
  - sortPages sorting correctness
  - printReport output format
