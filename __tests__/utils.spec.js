import * as utils from '../src/utils'

describe('utils', () => {
  it('#hasOwnProp', () => {
    const o = {x: 1}
    expect(o.__proto__).not.toBeUndefined()
    expect(utils.hasOwnProp(o, 'x')).toEqual(true)
    expect(utils.hasOwnProp(o, '__proto__')).toEqual(false)
  })

  it('#pick', () => {
    const o = {x: 1, y: 2}
    expect(utils.pick(o, 'x', 'y')).toEqual({x: 1, y: 2})
    expect(utils.pick(o, ['x', 'y'])).toEqual({})
  })

  it('#normalizeName should normalize header name', () => {
    expect(() => utils.normalizeName('')).toThrow()
    expect(() => utils.normalizeName('@')).toThrow()
    expect(() => utils.normalizeName('?')).toThrow()
    expect(utils.normalizeName('0')).toEqual('0')
    expect(utils.normalizeName('Content-Type')).toEqual('content-type')
  })

  it('#normalizeValue should cast to string', () => {
    expect(utils.normalizeValue()).toEqual('undefined')
    expect(utils.normalizeValue(null)).toEqual('null')
    expect(utils.normalizeValue(false)).toEqual('false')
    expect(utils.normalizeValue(0)).toEqual('0')
    expect(utils.normalizeValue('UTF-8')).toEqual('UTF-8')
  })

  it('#iteratorFor should make iterable', () => {
    const items = [1,2,3]
    const itor = utils.iteratorFor(items)
    const cb = jest.fn(() => void 0)
    for(let x of itor) { cb(x) }
    expect(cb).toHaveBeenCalledTimes(3)
    expect(cb).toHaveBeenCalledWith(1)
    expect(cb).toHaveBeenCalledWith(2)
    expect(cb).toHaveBeenCalledWith(3)
  })

  it('#normalizeMethod should upcase http verbs only', () => {
    const methods = [
      'get', 'head', 'options', 'delete', 'put', 'post', 'patch', 'delete', 'trace', 'connect'
    ]
    methods.forEach(m => {
      expect(utils.normalizeMethod(m)).toEqual(m.toUpperCase())
    })
    expect(utils.normalizeMethod('others')).toEqual('others')
  })
})