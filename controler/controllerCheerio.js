const cheerio = require("cheerio");
const axios = require("axios");
const puppeteer = require('puppeteer'); 
const handleSuccess = require('../service/handleSuccess');
const handleFail = require('../service/handleFail');
const bankExchangeRate = (req,res ,next) =>{
  try{
  const targetUrl = req.body.targetUrl;
  if(targetUrl === undefined) handleFail(res, '網址錯誤')
  axios.get(targetUrl).then((response)=>{
    const $ = cheerio.load(response.data);
    const tableTr = $("tbody tr");
    const coinInfo = []
    for(let i = 0 ; tableTr.length > i ; i++){
      const coinType = tableTr.eq(i).find('.hidden-phone.print_show').text().trim();
      const buyCashCoinPrice = tableTr.eq(i).children().eq(1).text();
      const sellCashCoinPrice = tableTr.eq(i).children().eq(2).text();
      const buySpotRateCoinPrice = tableTr.eq(i).children().eq(3).text().trim();
      const sellSpotRateCoinRate = tableTr.eq(i).children().eq(4).text().trim();
      coinInfo.push({
        '種類':coinType,
        '現金買入':buyCashCoinPrice,
        '現金賣出':sellCashCoinPrice,
        '即期匯率買入':buySpotRateCoinPrice,
        '即期匯率賣出':sellSpotRateCoinRate,
      });
    }
    handleSuccess(res, coinInfo)
  })}catch(err){
  console.log(err)
  handleFail(res, '資訊錯誤')
  }
}
const crawelPtt = (req, res, next)=>{
  try{
    const targetUrl = req.body.targetUrl;
    axios.get(targetUrl).then( async(response)=>{
        let $ = cheerio.load(response.data);
        try{
        // ptt驗證
        const brower = await puppeteer.launch({ headless:false });//開啟一個瀏覽器
        const page = await brower.newPage();//開啟一個分頁
        await page.goto(targetUrl);//前往指定頁面
        const buttonSelector = 'body > div.bbs-screen.bbs-content.center.clear > form > div:nth-child(2) > button';  // 已滿18歲按鈕 selector
        await page.click(buttonSelector);  // 按下按鈕
        await page.waitForSelector('div.r-list-sep');
        const content = await page.content();  
        // // await page.screenshot({path: 'google.png'});//截圖
        
        // // r-list-sep
        $ = await  cheerio.load(content);
        // 
        const info = [];
        const list = $(".r-list-container .r-ent");
        const prevPage = $(".action-bar .btn-group-paging");
        const prevPagelist = prevPage.eq(0).find('.wide');
        for(let i = 0 ; prevPagelist.length > i ; i++){
          const pageTitle = prevPagelist.eq(i).text();
          const pageAttr = prevPagelist.eq(i).attr('href')
          console.log(pageTitle, pageAttr)
        }
        
        for (let i = 0 ; i < list.length; i++) {
          // if(i===0){
          //   console.log(list.eq(i).find('.title a').text())
          // }
          const title = list.eq(i).find('.title a').text();
          const author = list.eq(i).find('.meta .author').text();
          const date = list.eq(i).find('.meta .date').text();
          const link = list.eq(i).find('.title a').attr('href');
          info.push({ title, author, date, link });
        }
        handleSuccess(res, info)
        // await brower.close();//關閉瀏覽器
      }catch(err){
        handleFail(res, '爬蟲失敗')
      }
    })
  }catch(err){
    handleFail(res, '爬蟲失敗')
  }
}
module.exports =  {
  bankExchangeRate,
  crawelPtt
}