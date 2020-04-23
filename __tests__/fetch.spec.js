import fetch from '../src/fetch'
import {buildRequest} from './helper'

global.wx = {}

describe('fetch', () => {
  beforeAll(() => {
    wx.request = buildRequest(true, JSON.stringify({key: 'value'}))
  })

  it('should get success', async () => {
    const res = await fetch('https://example.com')
    expect(res.status).toEqual(200)
    const data = await res.json()
    expect(data).toEqual({key: 'value'})
  })

  it('should get success', async () => {
    const res = await fetch('https://example.com', {method: 'post'})
    expect(res.status).toEqual(200)
    const data = await res.json()
    expect(data).toEqual({key: 'value'})
  })
})