'use strict'

var civilServer = require('civil-server').default
const path = require('path')
import { Iota } from 'civil-server'
import moduleIotas from '../node_modules/civil-server/iota.json'
import iotas from '../iotas.json'
import App from './components/app'

Iota.load(moduleIotas)
Iota.load(iotas) // set the initial data for the database
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function start() {
  try {
    const server = new civilServer()
    server.App = App // set the outer React wrapper for this site
    await server.earlyStart() // connect to the database, and such
    server.routesDirPaths.push(path.resolve(__dirname, './routes'))
    server.socketAPIsDirPaths.push(path.resolve(__dirname, './socket-apis'))
    server.serverEventsDirPaths.push(path.resolve(__dirname, './events'))
    await server.start()
    logger.info('started')
  } catch (error) {
    logger.error('error on start', error)
  }
}

start()
