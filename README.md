# A fetch-like API for wechat mini-program

![Travis (.org) branch](https://img.shields.io/travis/xixilive/weapp-fetch/master)
![npm bundle size](https://img.shields.io/bundlephobia/min/@xixilive/weapp-fetch)
![npm (scoped)](https://img.shields.io/npm/v/@xixilive/weapp-fetch)
![Known Vulnerabilities](https://snyk.io/test/github/xixilive/weapp-fetch/badge.svg)
![NPM](https://img.shields.io/npm/l/@xixilive/weapp-fetch)

## Installation

```sh
# 小程序开发者工具构建npm包时仅处理production依赖,因此要加`--save-prod`
npm i @xixilive/weapp-fetch --save-prod
```

## Usage

### basic

A simple example of use fetch function, see `API` section in document for details.

```js
import fetch from '@xixilive/weapp-fetch'

fetch('http://example.com').then(res => console.log(res))
```

### use http

It exposes a http wrapper for `wx.request`.

```js
import {http, Logger} from '@xixilive/weapp-fetch'

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
import fetch, {http, Logger} from '@xixilive/weapp-fetch'

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

## Build Tips

This package was prebuilt as es module to `dist` folder, and all of source code not be transpiled to ES5 version.
If you use this package's default build, you should turn on the `ES6 to ES5` option in devtools.
If you want a custom build, please clone this repo.

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



