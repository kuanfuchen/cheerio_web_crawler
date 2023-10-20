const express = require('express');
const router = express.Router();
const {bankExchangeRate, crawelPtt, crawelShopee, institutional_investor_buyAndSell_Socket} = require('../controler/controllerCheerio');
router.post('/bankExchangeRate', function(req, res, next) {
  bankExchangeRate(req, res, next);
});
router.post('/crawelPtt', function(req, res, next) {
  crawelPtt(req, res, next);
});
router.get('/crawelShopee', function(req, res, next) {
  crawelShopee(req, res, next);
});
router.get('/socket', (req,res)=>{
  console.log(3344)
  institutional_investor_buyAndSell_Socket(req,res);
})
module.exports = router;