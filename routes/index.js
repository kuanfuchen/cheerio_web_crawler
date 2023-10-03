const express = require('express');
const router = express.Router();
const {bankExchangeRate, crawelPtt, crawelShopee} = require('../controler/controllerCheerio');
router.post('/bankExchangeRate', function(req, res, next) {
  bankExchangeRate(req, res, next)
});
router.post('/crawelPtt', function(req, res, next) {
  crawelPtt(req, res, next)
});
router.get('/crawelShopee', function(req, res, next) {
  crawelShopee(req, res, next)
});
module.exports = router;