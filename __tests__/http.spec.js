import HTTP from '../src/http'
import {buildRequest} from './helper'

global.wx = {}

const expectReqParams = (options) => {
  const args = {
    method: 'GET', 
    dataType: 'json', 
    responseType: 'text', 
  }
  return expect.objectContaining({
    ...Object.assign({}, args, options),
    success: expect.any(Function),
    fail: expect.any(Function)
  })
}

describe('HTTP', () => {
  describe('#request', () => {
    it('should be success with 20x status', async () => {
      wx.request = buildRequest(true)
      const repsonse = await HTTP.request({url: 'URL'})
      expect(repsonse.status).toEqual(200)
      expect(wx.request).toHaveBeenCalledWith(expectReqParams({url: 'URL'}))
      expect(wx.request).toHaveBeenCalledTimes(1)
    })
  
    it('should be failed with non-20x status', async () => {
      wx.request = buildRequest(false)
      try{
        await HTTP.request({url: 'URL'})
      }catch(e){
        expect(e).toEqual({error: '400'})
      }
      expect(wx.request).toHaveBeenCalledWith(expectReqParams({url: 'URL'}))
      expect(wx.request).toHaveBeenCalledTimes(1)
    })
  })

  describe('instance methods', () => {
    beforeEach(() => {
      wx.request = buildRequest(true)
    });

    const http = HTTP('http://example.com')
    const expectHttpMethod = (method, expectations = {}, ...args) => async () => {
      const response = await http[method]('/path', ...args)
      expect(response.status).toEqual(200)
      expect(wx.request).toHaveBeenCalledWith(expectReqParams({
        ...expectations,
        url: 'http://example.com/path',
        method: method.toUpperCase()
      }))
      expect(wx.request).toHaveBeenCalledTimes(1)
    }

    it('GET', expectHttpMethod('get'))
    it('HEAD', expectHttpMethod('head', {header: {name:'value'}}, {name:'value'}))
    it('POST', expectHttpMethod('post', {data: 'data'}, 'data'))
    it('PUT', expectHttpMethod('put', {data: 'data'}, 'data'))
    it('DELETE', expectHttpMethod('delete'))
  })

  describe('interceptors', () => {
    beforeEach(() => {
      wx.request = buildRequest(true)
      HTTP.before = jest.fn((params) => params)
      HTTP.after = jest.fn(() => buildRequest.lastResponse)
    })

    afterEach(() => {
      HTTP.before = null
      HTTP.after = null
    })

    it('should be called', async () => {
      await HTTP.request({url: 'URL'})
      expect(HTTP.before).toHaveBeenCalledWith({method: 'GET', dataType: 'json', responseType: 'text', url: 'URL'})
      expect(HTTP.after).toHaveBeenCalledWith(
        buildRequest.lastResponse,
        {method: 'GET', dataType: 'json', responseType: 'text', url: 'URL'}
      )
      expect(wx.request).toHaveBeenCalledTimes(1)
    })
  })
})