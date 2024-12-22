const axios = require('axios');

module.exports = async (req, res) => {
  const m3uUrl = "https://raw.githubusercontent.com/bhavy20110/Eat-us-/refs/heads/main/my.m3u";

  try {
    // Fetch the M3U file
    const response = await axios.get(m3uUrl);
    const contentType = response.headers['content-type'];

    // Ensure it's an M3U file and rewrite URLs if needed
    if (contentType && contentType.includes('application/vnd.apple.mpegurl')) {
      const originalContent = response.data;
      const baseUrl = m3uUrl.substring(0, m3uUrl.lastIndexOf('/') + 1);
      const rewrittenContent = rewriteUrls(originalContent, baseUrl);

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.send(rewrittenContent);
    } else {
      res.setHeader('Content-Type', contentType || 'text/plain');
      res.send(response.data);
    }
  } catch (error) {
    res.status(500).send(`Failed to fetch the M3U URL: ${error.message}`);
  }
};

// Rewrite relative URLs in M3U content
function rewriteUrls(content, baseUrl) {
  return content
    .split('\n')
    .map((line) => {
      if (line.startsWith('#') || !line.trim()) {
        return line; // Keep comments and empty lines
      }
      // Rewrite relative URLs to absolute URLs
      return new URL(line, baseUrl).toString();
    })
    .join('\n');
}
