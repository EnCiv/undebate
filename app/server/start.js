#!/usr/bin/env node

'use strict'

import { EventEmitter } from 'events'
import Server from './server'

import log4js from 'log4js'
import MongoModels from 'mongo-models'
import mongologger from './util/mongo-logger'

log4js.configure({
  appenders: {
    browserMongoAppender: { type: mongologger, source: 'browser' },
    err: { type: 'stderr' },
    nodeMongoAppender: { type: mongologger, source: 'node' },
  },
  categories: {
    browser: { appenders: ['err', 'browserMongoAppender'], level: 'debug' },
    node: { appenders: ['err', 'nodeMongoAppender'], level: 'debug' },
    default: { appenders: ['err'], level: 'debug' },
  },
})

if (!global.bslogger) {
  // bslogger stands for browser socket logger - not BS logger.
  global.bslogger = log4js.getLogger('browser')
}

if (!global.logger) {
  global.logger = log4js.getLogger('node')
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function start(emitter = false) {
  logger.info({ emitter })

  if (!emitter) {
    emitter = new EventEmitter()
    process.nextTick(() => {
      asyncStart(emitter)
    })
    return emitter
  }
}

async function asyncStart(emitter) {
  try {
    var verbose = false
    if (process.env.NODE_ENV === 'production') {
      process.title = 'synappprod'
    } else {
      process.title = 'synappdev'
      verbose = true
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI')
    }
    await MongoModels.connect({ uri: process.env.MONGODB_URI }, {})
    // any models that need to createIndexes will push their init function
    for await (const init of MongoModels.toInit) {
      await init()
    }

    await new Promise((ok, ko) => {
      try {
        new Server(verbose)
          .on('listening', status => {
            logger.info('HTTP server is listening', { status })
            return ok()
          })
          .on('error', error => {
            emitter.emit(error)
            ko()
          })
          .on('message', message => {
            emitter.emit(message)
            ok()
          })
      } catch (error) {
        console.error('HTTP server caught error on start', error)
        ko(error)
      }
    })

    require('./events/notify-of-new-participant') // no need to assign it to anything

    emitter.emit.bind(emitter, 'message', 'started')
  } catch (error) {
    emitter.emit('error', error)
  }
}

const file = process.argv[1]

if (file === __filename || file === __filename.replace(/\.js$/, '')) {
  start()
    .on('message', (...messages) => console.log('start', ...messages))
    .on('error', error => {
      logger.error({ error })
      console.log('Start: Error'.bgRed)
      if (error && error.stack) {
        console.log('start:', error.stack.red)
      } else {
        console.log('start:', error)
      }
    })
}
