const cloneDeep = require('lodash/cloneDeep')

function sameKeys(dstKeys, srcKeys) {
  if (dstKeys.length !== srcKeys.length) return false
  for (let i = 0; i < dstKeys.length; i++) {
    if (dstKeys[i] !== srcKeys[i]) {
      return false
    }
  }
  return true
}

function stringify(obj, key) {
  const value = obj[key]
  if (typeof value === 'undefined' && !Object.keys(obj).includes(key)) return 'not-present'
  if (typeof value === 'function') return (value.name || 'unnamed') + '()'
  return JSON.stringify(value, null, 2)
}

function setOrDeleteKeyWithMessages(dst, src, messages, keyPath, key) {
  if (typeof dst[key] === 'object' && typeof src[key] === 'object')
    setOrDeleteWithMessages(dst[key], src[key], messages, keyPath)
  else {
    if (typeof src[key] === 'object') {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      dst[key] = cloneDeep(src[key])
    } else if (dst[key] !== src[key]) {
      if (messages) messages.push(`${keyPath}: changing ${stringify(dst, key)} to ${stringify(src, key)}`)
      dst[key] = src[key]
    }
  }
}

export default function setOrDeleteWithMessages(dst, src, messages, keyPath) {
  if (typeof dst === 'object' && typeof src === 'object') {
    const dstKeys = Object.keys(dst)
    const srcKeys = Object.keys(src)
    if (Array.isArray(dst) && Array.isArray(src)) {
      for (const key of srcKeys)
        setOrDeleteKeyWithMessages(dst, src, messages, `${keyPath ? keyPath : ''}[${key}]`, key)
      if (!sameKeys(dstKeys, srcKeys)) {
        for (const key of dstKeys.reverse()) {
          // reverse because splice changes order each time
          if (srcKeys.includes(key)) continue
          else {
            if (messages) messages.push(`deleting ${keyPath ? keyPath : ''}[${key}]: ${dst[key]}`)
            dst.splice(key, 1)
          }
        }
        return
      }
    } else {
      for (const key of srcKeys) {
        if (typeof src[key] === 'undefined') {
          if (messages) messages.push(`deleting ${keyPath ? keyPath + '.' : ''}${key}: ${dst[key]}`)
          delete dst[key]
        } else setOrDeleteKeyWithMessages(dst, src, messages, (keyPath ? keyPath + '.' : '') + key, key)
      }
    }
  } else {
    if (messages) messages.push(`${keyPath ? keyPath + ': c' : 'C'}an not change type ${typeof dst} to ${typeof src}`)
  }
}
