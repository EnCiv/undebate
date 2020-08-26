'use strict'

import 'core-js/stable'
import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/app'
import bconsole from './bconsole'
import socketlogger from './socketlogger'

window.socket = io()
window.reactSetPath = path => {
  ReactDOM.unmountComponentAtNode(window.reactContainer)
  reactProps.path = path
  window.history.pushState({}, '', path)
  render(reactProps)
}

if (typeof window !== 'undefined') {
  window.addEventListener('unload', e => {
    // Cancel the event
    //e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = ''
    window.socket.disconnect(true) // disconnect the socket so we don't see fewer connection timeouts on the server
  })
}

window.socket.on('welcome', user => {
  /*if ( ! user ) {
    new Facebook().on('ready', () => Facebook.connect(false));
  }*/
  render(Object.assign({}, reactProps, { user }))
})

// process has to be defined before log4js is imported on the browser side.
if (typeof window !== 'undefined') {
  if (typeof __webpack_public_path__ !== 'undefined') {
    // if using web pack, this will be set on the browser. Dont' set it on the server
    __webpack_public_path__ = 'http://localhost:3011/assets/webpack/'
    process.env.LOG4JS_CONFIG = { appenders: [] } // webpack doesn't initialize the socket logger right - so just prevent log4js from initializing loggers
    var log4js = require('log4js')
    log4js.configure({
      appenders: { bconsole: { type: bconsole }, socketlogger: { type: socketlogger } },
      categories: {
        default: { appenders: ['bconsole', 'socketlogger'], level: window.env === 'production' ? 'info' : 'trace' },
      },
      disableClustering: true,
    })
  } else {
    //process.env.LOG4JS_CONFIG= {appenders: [{ type: 'bconsole' }, {type: 'socketlogger'}]};
    process.env.LOG4JS_CONFIG = { appenders: [] } // webpack doesn't initialize the socket logger right - so just prevent log4js from initializing loggers
    var log4js = require('log4js')
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
