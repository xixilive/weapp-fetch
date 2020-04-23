const buildResponse = (ok, body = '') => ({
  header:{}, 
  statusCode: ok ? 200 : 400, 
  errMsg: ok ? 'OK' : '400',
  data: body
})

const buildRequest = (ok = true, body = '') => jest.fn(({success, fail, ...args}) => {
  const res = buildRequest.lastResponse = buildResponse(ok, body)
  ok ? success(res) : fail(res)
})

export {
  buildRequest
}