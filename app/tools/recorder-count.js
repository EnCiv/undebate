'use strict'

import Iota from '../models/iota'
import MongoModels from 'mongo-models'

import log4js from 'log4js'

if (!global.logger) {
  global.logger = log4js.getLogger('node')
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } },
  })
}

async function main(title) {
  await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
  for await (const func of MongoModels.toInit) {
    // any models that need to createIndexes will push their init function
    await func()
  }
  var recorders = await Iota.find({
    _id: { $gte: args.start },
    'bp_info.candidate_stage_result_id': { $exists: true },
  })
  console.info(recorders.length)
  MongoModels.disconnect()
}

// fetch args from command line
var argv = process.argv
var args = {}
for (let arg = 2; arg < argv.length; arg++) {
  switch (argv[arg]) {
    case 'db':
      args[argv[arg]] = argv[++arg]
      break
    case 'start':
      args[argv[arg]] = Iota.ObjectId.createFromTime(
        ~~(new Date(new Date().getTime() - parseInt(argv[++arg]) * 60000) / 1000)
      )
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}
if (!args.start) {
  console.error('start expected')
  process.exit()
}
if (!args.db) {
  console.error('db expected')
  process.exit()
}
main()
