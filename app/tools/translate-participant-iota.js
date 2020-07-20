#!/usr/bin/env node
'use strict;'

// this file makes it possible to create conversation viewer and candidate-recorder link pairs by combining information from a spreadsheet file, and an object template (below)
// the csv file lists the election Race names, and links to the viewer and recorder for that race - if they exist
// the program creates or updates records in the db, and generates a new spreadsheet -out.csv that includes the new links.  If a link was changes, a column shows that it was changed.
// take pair as a parameter which is a js file that describes the data and how to operate on it

const Iota = require('../models/iota')
const MongoModels = require('mongo-models')
import { transcribeParticipantIota } from '../server/events/transcribe'

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
    case 'participantId':
    case 'db': // the mongo database URI
      args[argv[arg]] = argv[++arg]
      break
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}

if (!(args.db && args.participantId)) {
  console.error('db and participantId are required')
  process.exit(1)
}

function finished(result) {
  MongoModels.disconnect()
  process.exit(result)
}

async function main() {
  await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
  for await (const init of MongoModels.toInit) {
    await init()
  }
  try {
    const participantIota = await Iota.findOne({ _id: Iota.ObjectID(args.participantId) })
    if (!participantIota) {
      console.error('participantId not found', args.participantId)
      finished(1)
    }
    const transcriptionIota = await transcribeParticipantIota(participantIota)
    console.info('transcriptionIota', transcriptionIota)
    finished(0)
  } catch (error) {
    logger.error('caught error trying to translate', error)
    finished(1)
  }
}

main()
