import Logger from '../src/logger'

const transport = {
  debug: jest.fn(()=>{}),
  log: jest.fn(()=>{}),
  info: jest.fn(()=>{}),
  warn: jest.fn(()=>{})
}

describe('logger', () => {
  it('error should be thrown with invalid arguments', () => {
    expect(() => new Logger()).toThrow()
    expect(() => new Logger({})).toThrowError(/transport/)
    expect(() => new Logger(transport, 0)).toThrowError(/level/)
    expect(() => new Logger(transport, 'unknown')).toThrowError(/level/)
  })

  it('should be instanceof Logger', () => {
    let logger = Logger(transport)
    expect(logger instanceof Logger).toEqual(true)
    expect(logger.level).toEqual(8)
  })

  it('should invoke transport level-methods', () => {
    let logger = Logger(transport)
    logger.info('foo', 'bar')
    expect(transport.info).toBeCalledWith('foo', 'bar')
  })

  it('should not invoke transport level-methods', () => {
    let logger = Logger(transport)
    logger.error('foo', 'bar') // transport.error is missing
    expect(transport.log).toBeCalledWith('error', 'foo', 'bar')
  })

  it('should skip higher-levels, but log always be called', () => {
    let logger = Logger(transport, 'info')
    logger.debug('foo', 'bar')
    expect(transport.debug).not.toBeCalled()
    logger.log('foo', 'bar')
    expect(transport.log).toBeCalledWith('foo', 'bar')
  })
})