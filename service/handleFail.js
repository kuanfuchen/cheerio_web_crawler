const handleFail= (res, failMessage, code)=>{
  const failCode = code || 400;
  res.status(failCode).send({
    status:'error',
    message:failMessage
  })
  res.end()
};
module.exports = handleFail;