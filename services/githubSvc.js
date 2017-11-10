const https = require('https');

const host = 'api.github.com';
/**
 * All headers will be used for every request to the Github API
 */
let headers = {
    'Accept': 'application/vnd.github.v3+json',
    'user-agent': ''
};
if(process.env.OAUTH_TOKEN) {
    headers['Authorization'] = `token ${process.env.OAUTH_TOKEN}`;
}

/**
 * Get all basic data for a given user
 *
 * @param user {string}     The user to get data for
 *
 * @returns {Promise}       Resolves the user as an object
 */
function getUserData(user) {
    return makeApiRequest(`/users/${user}`);
}

/**
 * Gets all repo data for a given user. This will recurse into each repo and make calls to request
 * both commit count and pull request count
 *
 * @param user {string}     The user whose repos you want to query
 *
 * @returns {Promise}       Resolves an array of repository objects
 */
function getRepoData(user) {
    return new Promise((resolve, reject) => {
        makeApiRequest(`/users/${user}/repos`)
            .then(data => {
                //Only an array should come back. If it doesn't there was a problem.
                if(!Array.isArray(data)) {
                    reject(data);
                }

                let subPromises = [];
                let repos = data.map(repo => {
                    let r = {
                        name: repo.name,
                        url: repo.html_url
                    };
                    let commitPromise = getCommits(user, repo.name);
                    let prPromise = getPulls(user, repo.name);

                    commitPromise
                        .then(commits => {
                            r.commitCount = commits.length;
                        });

                    prPromise
                        .then(pulls => {
                            r.pullRequestCount = pulls.length;
                        });

                    subPromises.push(commitPromise);
                    subPromises.push(prPromise);

                    return r;
                });

                Promise.all(subPromises)
                    .then(vals => {
                        resolve(repos);
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

/**
 * Gets all commits for the given user/repo
 *
 * @param user {string}     The user/owner of the repo
 *
 * @param repo {string}     The repo name
 *
 * @returns {Promise}       Resolves the commit list as an array
 */
function getCommits(user, repo) {
    return new Promise((resolve, reject) => {
        makeApiRequest(`/repos/${user}/${repo}/commits`)
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
}

/**
 * Gets all pull requests for the given user/repo
 *
 * @param user {string}     The user/owner of the repo
 *
 * @param repo {string}     The repo name
 *
 * @returns {Promise}       Resolves the pull request list as an array
 */
function getPulls(user, repo) {
    return new Promise((resolve, reject) => {
        makeApiRequest(`/repos/${user}/${repo}/pulls`)
            .then(data => {
                resolve(data);
            })
            .catch(err => reject(err));
    })
}

/**
 * Performs a request against the Github API using the consts set at the top of this file
 *
 * @param path  {string}    The path in the Github API to access, for example `/users/username`
 *
 * @returns {Promise}       Returns a promise that will resolve when data has been received. The
 *                          promise resolves a parsed JSON object
 */
function makeApiRequest(path) {
    return new Promise((resolve, reject) => {
        https.get({host, path, headers},
            res => {
                let data = '';

                res.setEncoding('utf8');
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', (err) => {
                reject(err);
            });
    });
}

module.exports = {
    getUserData,
    getRepoData
};