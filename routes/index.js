var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'PolyPong', gID: null });
});

router.get('/g/:gID', function(req, res, next) {
  res.render('game', { title: 'PolyPong' });
});

module.exports = router;
