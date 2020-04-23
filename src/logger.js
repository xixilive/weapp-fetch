// A simple logger compatible with wx console, LogManager and RealtimeLogManager
const isFn = arg => 'function' === typeof arg

function log(levelName, levelNum, ...message) {
  if(this.level < levelNum) {
    return
  }
  const args = this.prefix ? [`${this.prefix}`] : []
  if(isFn(this.transport[levelName])) {
    this.transport[levelName](...args.concat(message))
  } else {
    this.log(...args.concat([levelName], message))
  }
}

const levelNames = ['debug', 'info', 'warn', 'error']

function Logger(transport, level = Logger.levels.DEBUG, prefix = null) {
  if(!(this instanceof Logger)) {
    return new Logger(transport, level, prefix);
  }
  
  if(!transport || !isFn(transport.log)) {
    throw new Error('a transport must have log function')
  }

  level = 'string' === typeof level ? Logger.levels[level.toUpperCase()] : parseInt(level, 10)
  if(!level || !Object.values(Logger.levels).includes(level)) {
    throw new Error('invalid logger level')
  }

  this.transport = transport
  this.level = level
  this.prefix = 'string' === typeof prefix ? prefix : null
}

Logger.prototype.log = function(level, ...message) {
  const args = this.prefix ? [`${this.prefix}`, level, ...message]: [level, ...message]
  this.transport.log(...args)
  return this
}

levelNames.forEach(level => {
  Logger.prototype[level] = function(...message) {
    const levelNum = Logger.levels[level.toUpperCase()]
    log.call(this, level, levelNum, ...message)
    return this
  }
})

Logger.prototype.constructor = Logger

Logger.levels = {
  ERROR: 1,
  WARN: 2,
  INFO: 4,
  DEBUG: 8
}

export default Logger