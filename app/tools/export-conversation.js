#!/usr/bin/env node
'use strict'

// this file makes it possible to create conversation viewer and candidate-recorder link pairs by combining information from a spreadsheet file, and an object template (below)
// the csv file lists the election Race names, and links to the viewer and recorder for that race - if they exist
// the program creates or updates records in the db, and generates a new spreadsheet -out.csv that includes the new links.  If a link was changes, a column shows that it was changed.

import Iota from '../models/iota'
import MongoModels from 'mongo-models'
var fs = require('fs')

// Iota uses logger
import log4js from 'log4js'

if (!global.logger) {
  global.logger = log4js.getLogger('node')
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } },
  })
}

async function exportConversation(path) {
  console.info('path:', path)
  await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
  while (MongoModels.toInit && MongoModels.toInit.length) {
    // any models that need to createIndexes will push their init function
    MongoModels.toInit.shift()()
  }
  var iotaList = []
  const parentIota = await Iota.findOne({ path: '/' + path }).catch(err => {
    console.error('getIota.findOne caught error', err, 'skipping')
    process.exit()
  })
  if (!parentIota || parentIota === 'null') return console.info('nothing found for path:', path)
  iotaList.push(parentIota)
  var newParticipantDocs = await Iota.aggregate([
    { $match: { parentId: parentIota._id.toString(), 'component.component': 'MergeParticipants' } },
    { $sort: { _id: -1 } },
    { $group: { _id: '$userId', latest: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latest' } },
  ])
  if (!newParticipantDocs || !newParticipantDocs.length) return console.info('no participants found for path:', path)
  Array.prototype.push.apply(iotaList, newParticipantDocs)

  var output = JSON.stringify(iotaList)
  fs.writeFile(path + '.json', output, function(err) {
    if (err) throw err
    console.log(path + '.json' + ' saved')
  })
}

// fetch args from command line
var argv = process.argv
var args = {}
for (let arg = 2; arg < argv.length; arg++) {
  switch (argv[arg]) {
    case 'db':
    case 'path': // the csv file
      args[argv[arg]] = argv[++arg]
      break
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}
if (!args.path) {
  console.error('path expected')
  process.exit()
}
if (!args.db) {
  console.error('db expected')
  process.exit()
}
exportConversation(args.path)
