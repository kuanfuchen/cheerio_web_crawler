const handleStockInformation = (indexVal)=>{
  const splitNewStockIndex = indexVal.split(/\s/);
  // const removedSign = /\//gi;
  const socketInfo = {};
  const collectedTodayIndex = [];
  // && splitNewStockIndex[i].indexOf('/') === -1 
  for(let i = 0 ; splitNewStockIndex.length> i ; i++){
    if(splitNewStockIndex[i] !== '' && splitNewStockIndex[i] !== '億' && splitNewStockIndex[i] !== '張' && splitNewStockIndex[i].indexOf('/') === -1 ) collectedTodayIndex.push(splitNewStockIndex[i]);
  }
  collectedTodayIndex.splice(0,4)
  console.log(collectedTodayIndex, 'collectedTodayIndex');
  let str = '';
  for(let i = 0 ; collectedTodayIndex.length > i ; i++){
    if(i < 5 || i >= 10 && i < 15 || i >= 20 && i < 25){
      if(!socketInfo[collectedTodayIndex[i]]) socketInfo[collectedTodayIndex[i]] = collectedTodayIndex[i+5];
    }
    // else{
    //   if(i === 29) {
    //     socketInfo[collectedTodayIndex[i]] = null;
    //   }else{
    //     str += `${collectedTodayIndex[i]}`;
    //     console.log(str)
    //     socketInfo[collectedTodayIndex[29]] = str;
    //   }
    // }
  }
  // console.log(socketInfo,'socketInfo')
  return socketInfo;
}

module.exports = handleStockInformation;