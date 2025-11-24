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
};
