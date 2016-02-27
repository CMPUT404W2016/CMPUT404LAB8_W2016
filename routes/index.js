var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CMPUT404 Lab 8, Winter 2016' });
});

module.exports = router;
