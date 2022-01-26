#!/usr/bin/env node
'use strict;'

// this file makes it possible to create conversation viewer and candidate-recorder link pairs by combining information from a spreadsheet file, and an object template (below)
// the csv file lists the election Race names, and links to the viewer and recorder for that race - if they exist
// the program creates or updates records in the db, and generates a new spreadsheet -out.csv that includes the new links.  If a link was changes, a column shows that it was changed.
// take pair as a parameter which is a js file that describes the data and how to operate on it

const MongoModels = require('mongo-models')
const csv = require('csvtojson')
const ObjectsToCsv = require('objects-to-csv')
const undebatesFromTemplateAndRows = require('../lib/undebates-from-template-and-rows')

function waitForKeyTryAgain(toDo) {
  if (!waitForKeyTryAgain.started) waitForKeyTryAgain.started = true
  // we only need to call this once to set things up
  else return
  // thanks to https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin for this code
  var stdin = process.stdin
  // without this, we would only get streams once enter is pressed
  stdin.setRawMode(true)
  // resume stdin in the parent process (node app won't quit all by itself
  // unless an error or process.exit() happens)
  stdin.resume()
  // i don't want binary, do you?
  stdin.setEncoding('utf8')
  // on any data into stdin
  stdin.on('data', function (key) {
    // ctrl-c ( end of text )
    if (key === '\u0003') {
      process.exit()
    }
    // write the key to stdout all normal like
    process.stdout.write(key)
    if (toDo) toDo()
  })
}

// Iota uses logger
const log4js = require('log4js')

if (!global.logger) {
  global.logger = log4js.getLogger('node')
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } },
  })
}

// fetch args from command line
var argv = process.argv
var args = {}
for (let arg = 2; arg < argv.length; arg++) {
  switch (argv[arg]) {
    case 'pair':
    case 'src': // the csv file
    case 'db': // the mongo database URI
      args[argv[arg]] = argv[++arg]
      break
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}

async function writeCSVAndExit(csvRowObjList) {
  const csvOut = new ObjectsToCsv(csvRowObjList)
  async function writeItOut() {
    try {
      await csvOut.toDisk(args.src) // write over the source file so changes will come back in
      console.info('csv File updated', args.src)
      process.exit(0)
    } catch (error) {
      if (error.code === 'EBUSY') {
        // happens when excel has the file open
        console.info(`${error.path} busy, try again? ^C to exit`)
        waitForKeyTryAgain(writeItOut)
      } else {
        console.error('error trying to write csv file', error)
        process.exit()
      }
    }
  }
  writeItOut()
}

if (args.src && args.db && args.pair) {
  const viewerRecorderPair = require(args.pair)
  csv()
    .fromFile(args.src)
    .then(async csvRowObjList => {
      await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
      /* skip the init
      while (MongoModels.toInit && MongoModels.toInit.length) {
        // any models that need to createIndexes will push their init function
        MongoModels.toInit.shift()()
      } */
      const messages = await undebatesFromTemplateAndRows(viewerRecorderPair, csvRowObjList)
      console.info('merge message:')
      console.info(messages.join('/n'))
      MongoModels.disconnect()
      writeCSVAndExit(csvRowObjList)
    })
    .catch(err => {
      console.error('csv caught error', err)
    })
} else {
  console.error(
    'usage: csv-create-cc-pair src <csv file> db <database uri> pair <viewer-recorder-pair.js> Note: pair must be relative to path of this program'
  )
  process.exit()
}
