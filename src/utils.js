export function hasOwnProp(o, prop) {
  return Object.prototype.hasOwnProperty.call(o, prop)
}

export const pick = (obj, ...keys) => {
  return keys.reduce((memo, key) => {
    if(hasOwnProp(obj, key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {})
}

export function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

export function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
export function iteratorFor(items) {
  const iterator = {
    next: function() {
      const value = items.shift()
      return {done: value === undefined, value: value}
    }
  }
  iterator[Symbol.iterator] = function() {
    return iterator
  }
  return iterator
}

export function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    const view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

const methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'CONNECT', 'TRACE'];
export function normalizeMethod(method) {
  const upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}