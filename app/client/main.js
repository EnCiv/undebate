'use strict'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/app'
import bconsole from './bconsole'
import socketlogger from './socketlogger'

if (
  !(
    // don't do sockets in these cases
    (
      location.hostname.startsWith('cc2020') || // host is the CDN
      location.hostname.startsWith('undebate-stage1') || // host is stage-1 for testing
      (reactProps.iota &&
        reactProps.iota.webComponent &&
        reactProps.iota.webComponent.participants &&
        !reactProps.iota.webComponent.participants.human &&
        window.env === 'production')
    ) // production this is a viewer and not a recorder
  )
) {
  // do not use socket.io if connecting through the CDN. socket.io will not connect and it will get an error
  window.socket = io()
  window.addEventListener('unload', e => {
    // Cancel the event
    //e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = ''
    window.socket.disconnect(true) // disconnect the socket so we don't see fewer connection timeouts on the server
  })
  window.socket.on('welcome', user => {
    /*if ( ! user ) {
        new Facebook().on('ready', () => Facebook.connect(false));
      }*/
    render(Object.assign({}, reactProps, { user }))
  })
} else {
  window.NoSocket = true
  window.socket = {
    emit: (...args) => {
      console.error('emit was called with', ...args)
    },
    NoSocket: true,
  }
}

// process has to be defined before log4js is imported on the browser side.
process.env.LOG4JS_CONFIG = { appenders: [] } // webpack doesn't initialize the socket logger right - so just prevent log4js from initializing loggers
var log4js = require('log4js')
if (window.socket.NoSocket) {
  log4js.configure({
    appenders: { bconsole: { type: bconsole } },
    categories: {
      default: { appenders: ['bconsole'], level: 'error' },
    },
    disableClustering: true,
  })
} else if (typeof __webpack_public_path__ !== 'undefined') {
  // if using web pack, this will be set on the browser. Dont' set it on the server
  __webpack_public_path__ = 'http://localhost:3011/assets/webpack/'
  log4js.configure({
    appenders: { bconsole: { type: bconsole }, socketlogger: { type: socketlogger } },
    categories: {
      default: { appenders: ['bconsole', 'socketlogger'], level: window.env === 'production' ? 'info' : 'trace' },
    },
    disableClustering: true,
  })
} else {
  // haven't seen this case in a while. mostly, __webpack_public_path is ''
  log4js.configure({
    appenders: { bconsole: { type: bconsole }, socketlogger: { type: socketlogger } },
    categories: {
      default: { appenders: ['bconsole', 'socketlogger'], level: window.env === 'production' ? 'info' : 'trace' },
    },
    disableClustering: true,
  })
}

window.logger = log4js.getLogger('browser')
logger.info('client main running on browser', window.location.pathname, reactProps.browserConfig)

if (!window.language) {
  // a button may change the language later
  window.language = navigator.language.slice(0, 2)
}

function render(props) {
  try {
    window.reactContainer = document.getElementById('synapp')
    if (!window.Synapp) window.Synapp = {}
    window.Synapp.fontSize = parseFloat(
      window.getComputedStyle(window.reactContainer, null).getPropertyValue('font-size')
    )
    ReactDOM.render(<App {...props} />, window.reactContainer)
  } catch (error) {
    document.getElementsByTagName('body')[0].style.backgroundColor = 'red'
    logger.error('render Error', error)
  }
}

function hydrate(props) {
  try {
    if (!(window.reactContainer = document.getElementById('synapp'))) logger.error('synapp id not found')

    if (!window.Synapp) window.Synapp = {}
    window.Synapp.fontSize = parseFloat(
      window.getComputedStyle(window.reactContainer, null).getPropertyValue('font-size')
    )
    ReactDOM.hydrate(<App {...props} />, window.reactContainer) // should be hydrate
  } catch (error) {
    document.getElementsByTagName('body')[0].style.backgroundColor = 'red'
    logger.info('hydrate Error', error)
  }
}

hydrate(reactProps)
