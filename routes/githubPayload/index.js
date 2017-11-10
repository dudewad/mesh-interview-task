const githubSvc = require('services/githubSvc');

module.exports = function(req, res) {
    //Default to getting "my" info since that was the requirement. This allows setting different users, however.
    //Note that if using a different user, changing the OAUTH token would be necessary in .env
    let user = req.query.user || 'dudewad';

    Promise.all([
        githubSvc.getUserData(user),
        githubSvc.getRepoData(user)
    ]).then(values => {
        let userData = values[0];
        let repoData = values[1];

        let data = {
            githubHandle: user,
            githubURL: userData.html_url,
            avatarURL: userData.avatar_url,
            email: userData.email,
            followerCount: userData.followers,
            repoData
        };

        res.status(200).send(JSON.stringify(data));
    })
    .catch(err => {
        res.status(200).send(JSON.stringify(err));
    });
};