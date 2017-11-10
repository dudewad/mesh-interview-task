const routes = require('express').Router();
const githubPayload = require('./githubPayload');
const notFound = require('./404');

routes.use('/githubPayload', githubPayload);
routes.use('*', notFound);

module.exports = routes;