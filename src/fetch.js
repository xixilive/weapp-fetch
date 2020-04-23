import http from './http';
import Request from './request'
import Response from './response'

export default function fetch(input, init) {
  const req = new Request(input, init);
  if (req.signal && req.signal.aborted) {
    return Promise.reject(new Error('AbortError'))
  }

  const reqBody = typeof req._bodyInit === 'undefined' ? null : req._bodyInit;
  
  return http.request({
    url: req.url,
    method: req.method,
    header: req.headers.map,
    data: reqBody
  }).then(({ body, ...options }) => {
    return new Response(body, {...options, url: req.url})
  })
}
