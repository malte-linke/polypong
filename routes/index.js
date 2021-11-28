var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('game', { title: 'PolyPong' });
});


router.get('/m', function(req, res, next) {
  res.render('index', { title: 'PolyPong' });
});

module.exports = router;
