import fetch from './fetch'
import request from './request'

export default async(url, options) => await fetch(request)(url, options)