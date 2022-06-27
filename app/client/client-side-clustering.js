'use strict'

// clustering is a node thing, dummy it out on the client side

export function isMaster() {
  return true
}

export function onlyOnMaster(f1, f2) {
  return f1()
}

export function onMessage() {
  return
}
export function send() {
  return
}
