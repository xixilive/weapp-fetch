/* global wx */
import Logger from './logger'
import {pick} from './utils'

const interceptors = {
  request: null,
  response: null
}

let httpLogger = new Logger({log: () => {}}, 'debug')
const httpError = function(err, message = null) {
  return {error: err.errMsg || err.message || message || String(err)}
}

const request = (options) => {
  httpLogger.debug('start request with options: ', options)

  let params = pick(
    Object.assign({method: 'GET', dataType: 'json', responseType: 'text'}, options),
    'url', 'method', 'header', 'data', 'timeout', 'dataType', 'responseType'
  )

  httpLogger.debug('start request with params: ', params)
  httpLogger.info(`${params.method.toUpperCase()} ${params.url}`)

  if('function' === typeof interceptors.request) {
    try{
      httpLogger.info('try to intercept request')
      interceptors.request(params)
    }catch(ex){
      httpLogger.warn('intercept request raise error: ', ex)
      return Promise.reject(httpError(ex))
    }
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success: (res) => {
        httpLogger.debug('wx request success with response', res)
        httpLogger.info('wx request success with status:', res.statusCode)
        const success = res.statusCode >= 200 && res.statusCode < 300
        if(!success) {
          httpLogger.warn('request failed with status: ', res.statusCode)
          return reject(httpError(res, `response status: ${res.statusCode}`))
        }

        if('function' === typeof interceptors.response) {
          try{
            httpLogger.info('try to intercept response')
            interceptors.response(res, params)
          }catch(ex){
            httpLogger.warn('intercept response raise error: ', ex)
            return reject(httpError(ex))
          }
        }

        return resolve({
          headers: res.header,
          status: res.statusCode,
          statusText: res.errMsg || String(res.statusCode),
          body: res.data
        })
      },
      fail: (err) => {
        httpLogger.warn('wx.request error: ', err)
        reject(httpError(err))
      }
    });
  });
};

const joinUrl = (url, base = '') => {
  if(!base || /^https?:\/\//i.test(url)) {
    return url;
  }
  return (base + '/').replace(/\/+$/, '/') + url.replace(/^\/+/,'')
}

function http(base = '', defaultHeaders = {}) {
  const send = (path, method, header, data) => {
    const url = joinUrl(path, base)
    return request({
      method, 
      url, 
      header: Object.assign({}, defaultHeaders, header), 
      data: data || void 0
    })
  }

  return {
    get(url, header = null) {
      return send(url, 'GET', header)
    },

    head(url, header = null) {
      return send(url, 'HEAD', header)
    },

    post(url, data, header = null) {
      return send(url, 'POST', header, data)
    },

    put(url, data, header = null) {
      return send(url, 'PUT', header, data)
    },

    patch(url, data, header = null) {
      return send(url, 'PATCH', header, data)
    },

    delete(url, header = null) {
      return send(url, 'DELETE', header)
    }
  }
}

Object.defineProperty(http, 'request', {
  configurable: false,
  enumerable: false,
  get() {
    return request
  }
})

Object.defineProperty(http, 'logger', {
  configurable: false,
  enumerable: false,
  get() {
    return httpLogger
  },
  set(val) {
    if(!(val instanceof Logger)) {
      throw new Error('invalid logger')
    }
    httpLogger = val
  }
})

Object.defineProperty(http, 'before', {
  configurable: false,
  enumerable: false,
  get() {
    return interceptors.request
  },
  set(fn) {
    interceptors.request = fn
  }
})

Object.defineProperty(http, 'after', {
  configurable: false,
  enumerable: false,
  get() {
    return interceptors.response
  },
  set(fn) {
    interceptors.response = fn
  }
})

export default http
