const express = require('express');
const router = express.Router();
const {bankExchangeRate, crawelPtt} = require('../controler/controllerCheerio');
/* GET home page. */
router.post('/bankExchangeRate', function(req, res, next) {
  bankExchangeRate(req, res, next)
  // res.render('index', { title: 'Express' });
});
router.post('/crawelPtt', function(req, res, next) {
  crawelPtt(req, res, next)
  // res.render('index', { title: 'Express' });
});

module.exports = router;
