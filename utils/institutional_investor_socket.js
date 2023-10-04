const cheerio = require("cheerio");
const axios = require("axios");
const handleSuccess = require('../service/handleSuccess.js');
const handleFail = require('../service/handleFail.js');
const get_institutional_investor_buyAndSell =(res, stockID = '加權指數' , date = 'DATE')=>{
  try{

    axios.get(`https://goodinfo.tw/tw/ShowBuySaleChart.asp?STOCK_ID=${stockID}&CHT_CAT=${date}`)
      .then(async(response)=>{
        const $ = cheerio.load(response.data);
        const institutional_investor_buyAndSell_info = [];
        const indexElement = $('table:nth-of-type(1) tbody tr:nth-of-type(1)');
        indexElement.each((i, row)=>{
          const td = $(row).find('td');
          console.log(td.eq(0).text().trim())
        })
      // 提取上市加权指数数据
      // const indexValue = indexElement.text().trim();
      // console.log(indexValue,'indexValue')
        // const lastRow = $('table:nth-of-type(2) tbody tr:last-of-type');
        // const buyIn = lastRow.find('td:nth-child(10)').text().trim(); // 買進
        // const sellOver = lastRow.find('td:nth-child(11)').text().trim(); // 賣超
        // const netBuy = lastRow.find('td:nth-child(12)').text().trim(); // 買賣超

        // // 输出提取的数据
        // console.log('買進:', buyIn);
        // console.log('賣超:', sellOver);
        // console.log('買賣超:', netBuy);
        const socketInfo = $("#divBuySaleDetail table tbody tr").slice(2);
        socketInfo.each(async(i, row) =>{ 
          const td = await $(row).find('td');
          const term = td.eq(0).text().trim();
          const stock_points = td.eq(1).text().trim();
          const upsAndDown = td.eq(2).text().trim();
          const tradingVol = td.eq(3).text().trim();
          const foreign_capital = {
            buy: td.eq(4).text().trim(),
            sell: td.eq(5).text().trim(),
            total: td.eq(6).text().trim()
          };
          const investment_banks = {
            buy:td.eq(7).text().trim(),
            sell:td.eq(8).text().trim(),
            total:td.eq(9).text().trim()
          };
          const dealer = {
            buy: td.eq(10).text().trim(),
            sell: td.eq(11).text().trim(),
            total: td.eq(12).text().trim()
          };
          const institutional_investor = {
            buy:td.eq(13).text().trim(),
            sell:td.eq(14).text().trim(),
            total:td.eq(15).text().trim(),
          };
          institutional_investor_buyAndSell_info.push({
            date:term,
            stock_points,
            upsAndDown,
            tradingVol,
            foreign_capital,
            investment_banks,
            dealer,
            institutional_investor
          })
        })
        setTimeout(() => handleSuccess(res, institutional_investor_buyAndSell_info));
      })
  }catch(err){
    // return 'catch error'
    handleFail(res, 'catch error')
  }
}
module.exports =  {
  get_institutional_investor_buyAndSell,
};