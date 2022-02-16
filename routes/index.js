var express = require('express');
var router = express.Router();
var server = require('../game/NetworkManager');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'PolyPong', gID: null });
});

router.get('/g/:gID', function(req, res, next) {
  let exists = (server.getServer().getGameByID(req.params.gID) != undefined);

  if(!exists) return res.render('game-not-found');
  res.render('index', { title: 'PolyPong', gID: req.params.gID });
});


module.exports = router;
