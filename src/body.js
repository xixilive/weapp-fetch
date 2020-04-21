import {bufferClone} from './utils'

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

export default function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (typeof body === 'object') {
      this._bodyObject = body
    } else if (body instanceof ArrayBuffer || ArrayBuffer.isView(body)) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      }
    }
  }

  this.blob = () => {
    throw new Error('Blob is not be supported in wx yet')
  }

  this.formData = () => {
    throw new Error('FormData is not be supported in wx yet')
  }

  this.arrayBuffer = function() {
    if (this._bodyArrayBuffer) {
      return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
    } else {
      throw new Error('could not read body as arrayBuffer')
    }
  }

  this.text = function() {
    const rejected = consumed(this)
    if (rejected) {
      return rejected
    }
    if (this._bodyObject) {
      return JSON.stringify(this._bodyObject);
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  this.json = function() {
    if (this._bodyObject) {
      return Promise.resolve(this._bodyObject);
    }
    return this.text().then(JSON.parse)
  }

  return this
}