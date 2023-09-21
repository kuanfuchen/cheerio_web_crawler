const handleSuccess = (res, data, code)=>{
  const confirmCode = code || 200;
  res.status(confirmCode).send({
    status:'Success',
    data
  })
  res.end()
}
module.exports = handleSuccess;