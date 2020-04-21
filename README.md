# A fetch-like API for wechat mini-program

![Travis](https://img.shields.io/travis/xixilive/weapp-fetch/master.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/weapp-fetch.svg)
![npm](https://img.shields.io/npm/dt/weapp-fetch.svg)
![NpmVersion](https://img.shields.io/npm/v/weapp-fetch.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/xixilive/weapp-fetch/badge.svg)](https://snyk.io/test/github/xixilive/weapp-fetch)
![NpmLicense](https://img.shields.io/npm/l/weapp-fetch.svg)

## Install

```
npm i weapp-fetch
```

## Usage

### basic

A simple example of use fetch function, see `API` section in document for details.

```js
import fetch from 'weapp-fetch'

fetch('http://example.com')
  .then(res => console.log(res))
```

### use http

It exposes a http wrapper for `wx.request`.

```js
import {http, Logger} from 'weapp-fetch'

http.logger = new Logger(console, 'debug')

// interpolate request
http.before = (params) => {
  params.someKey = 'someValue'
}

// interpolate response
http.after = (res) => {
  res.someKey = 'someValue'
}

const client = http('https://example.com')

client.get('/api').then(console.log)
client.head('/api').then(console.log)
client.post('/api', data).then(console.log)
client.put('/api', data).then(console.log)
client.patch('/api', data).then(console.log)
client.delete('/api').then(console.log)
```

### config http.logger

> by default, http.logger will log nothing, see `API` section for details.

```js
import fetch, {http, Logger} from 'weapp-fetch'

// use wx RealtimeLogManager
const realtimeTransport = wx.getRealtimeLogManager()
http.logger = new Logger(realtimeTransport, 'debug')

// or use wx LogManager
const localTransport = wx.getLogManager()
http.logger = new Logger(localTransport, 'debug')

// or use wx console
const consoleTransport = console
http.logger = new Logger(consoleTransport, 'debug')

// ...
// will process logging during fetch/http requests
```

## API

### fetch function

```ts
function fetch(url: string, init: any): Promise<any>;
```

### http

```ts
// to create an http instance
function http(base: string, defaultHeaders: object): HttpInstance

interface HttpInstance {
  get(path: string, header:any): Promise<any>;
  head(path: string, header:any): Promise<any>;
  post(path: string, data: any, header: any): Promise<any>;
  put(path: string, data: any, header: any): Promise<any>;
  patch(path: string, data: any header: any): Promise<any>;
  delete(path: string, header: any): Promise<any>;
}

class http {
  // to send a request directly
  static request(options: wxRequestOptions): Promise<any>;

  // get or set logger
  static logger: Logger;

  // get or set request interpolator
  static before: RequestInterpolator;

  // get or set response interpolator
  static after: ResponseInterpolator;
}

function RequestInterpolator(params: object): void;
function ResponseInterpolator(response: object): void;
```

### Logger

```ts
interface transport {
  // basic method
  log(...args: string[]): void;
  // level relative methods
  debug?(...args: string[]): void;
  info?(...args: string[]): void;
  warn?(...args: string[]): void;
  error?(...args: string[]): void;
}

class Logger {
  constructor(transport: Transport, level: LoggerLevel = LoggerLevel.DEBUG);
  log(level: string, ...args: string[]): Logger;
  debug(...args: string[]): Logger;
  info(...args: string[]): Logger;
  warn(...args: string[]): Logger;
  error(...args: string[]): Logger;

  static levels :LoggerLevel;
}

enum LoggerLevel {
  ERROR = 1,
  WARN = 2,
  INFO = 4,
  DEBUG = 8,
}
```

## Incompatible features of fetch

- Does not support FormData
- Does not support Blob
- Does not support abort yet