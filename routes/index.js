var express = require('express');
var router = express.Router();
var server = require('../game/NetworkManager');
var fetchReleases = require('../scripts/fetch-releases');

// initially fetch releases
var releaseStorage = [{name: '', tag: '', description: { markdown: '', html: ''}, url: '', date: ''}];
fetchReleases().then(data => releaseStorage = data);

router.get('/', function(req, res, next) {
  res.render('index', { title: 'PolyPong', gID: null, releases: releaseStorage });
});

router.get('/g/:gID', function(req, res, next) {
  let exists = (server.getServer().getGameByID(req.params.gID) != undefined);

  if(!exists) return res.render('game-not-found');
  res.render('index', { title: 'PolyPong', gID: req.params.gID, releases: releaseStorage });
});


module.exports = router;
