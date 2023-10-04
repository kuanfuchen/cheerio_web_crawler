const cheerio = require("cheerio");
const axios = require("axios");
// const puppeteer = require('puppeteer'); 
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')
puppeteer.use(StealthPlugin());
const handleSuccess = require('../service/handleSuccess');
const handleFail = require('../service/handleFail');
const { get_institutional_investor_buyAndSell } = require('../utils/institutional_investor_socket');
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
const crawelShopee = async(req, res, next)=>{
  const brower = await puppeteer.launch({
    headless: false,
    defaultViewport:null,
    args:[
      "--window-size=1920,1080"
    ],
  });
  const page = await brower.newPage();
  // await page.goto("https://bot.sannysoft.com/")
  await page.goto("https://shopee.tw/search?keyword=%E5%8D%87%E9%99%8D%E6%A1%8C",{
    waitUntil:"domcontentloaded"
  })
  await page.addStyleTag({
    content:"#main{width: 1920px}"
  })
  await page.waitForSelector(".shopee-search-item-result__item");
  await page.waitForSelector("img")
  await scrollPageToBottom(page, {
    size:500,
    delay:300
  });
  // page.click('#xxxx')
  // page.input()
  // page.type('#email',EMAIL);
  // page.waitForTimeout(3000);
  // await page.evaluate(()=>{
  //   document.querySelector('#quality').value = '';
  // });
  // const value = await page.$eval('#xxx',(el)=>el.textContent().trim());//輸出該元素text
  const collectedData = await page.evaluate(async()=>{
    const imgSelector = document.querySelectorAll('.shopee-search-item-result__item');
    console.log(imgSelector.length)
    const data = [];
    for(let i = 0 ; imgSelector.length > i ; i++){
      const img = imgSelector[i].querySelector("img");
      const link = imgSelector[i].querySelector("a");
      data.push({
        img:img.src,
        text:img.alt,
        href:link.href
      })
      console.log(data)
    }
    return data
  });
  handleSuccess(res, collectedData);
}
const institutional_investor_buyAndSell_Socket = async(req,res) =>{
  try{
    const socketID = req.body.target_socketID;
    const socketDATA = req.body.target_socketDATA;
    await get_institutional_investor_buyAndSell(res, socketID, socketDATA);
    // const socket_DATA = await get_institutional_investor_buyAndSell(socketID, socketDATA);
    // console.log(socket_DATA, 'socket_DATA')
    // typeof socket_DATA !== 'string' ? handleSuccess(res, socket_DATA) : handleFail(res, '爬蟲失敗');
  }catch(err){
    handleFail(res, '爬蟲失敗')
  }
}
module.exports =  {
  bankExchangeRate,
  crawelPtt,
  crawelShopee,
  institutional_investor_buyAndSell_Socket,
}