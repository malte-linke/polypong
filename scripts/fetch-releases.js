const axios = require("axios").default;
const md = require("markdown-it")();
const { repository, name } = require('../package.json');

/**
 * This uses the GitHub API to fetch release data and prepares html code for them.
 */
function fetchReleases() {
  let headersList = {
    "Accept": "application/json",
    "User-Agent": `${name} (${repository.url})`
  }

  // this turns https://github.com/tensoid/polypong.git to tensoid/polypong
  let repo = repository.url.match("(?<=https://github.com/)(.*?)(?=.git)")[0];

  let reqOptions = {
    url: `https://api.github.com/repos/${repo}/releases`,
    method: "GET",
    headers: headersList,
  }

  return new Promise((resolve, reject) => {
    axios.request(reqOptions)
    .then(res => {
      let releases = [];

      res.data.forEach(release => {
        releases.push({ 
          name: release.name, 
          tag: release.tag_name, 
          description: {
            markdown: release.body,
            html: md.render(release.body)
          }, 
          url: release.html_url, 
          date: release.published_at
        });
      });

      resolve(releases);
    })
    .catch(reject);
  });
}

module.exports = fetchReleases;