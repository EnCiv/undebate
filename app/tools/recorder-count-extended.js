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

const YYYY_MM_DD = '2020-11-03'
const GE_DATE = '2020-11-04'

async function main(title) {
  await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })

  var viewers = await Iota.find({
    'bp_info.stage_id': { $exists: true },
    'webComponent.webComponent': 'CandidateConversation',
    'bp_info.election_date': { $gte: YYYY_MM_DD },
    //    'bp_info.election_date': { $lt: GE_DATE },
  })
  console.info('viewers', viewers.length)

  var recorders = await Iota.find({
    _id: { $gte: args.start },
    'bp_info.candidate_stage_result_id': { $exists: true },
    'bp_info.election_date': { $gte: YYYY_MM_DD },
    //    'bp_info.election_date': { $lt: GE_DATE },
  })
  console.info('recorders', recorders.length)

  var participants = await Iota.find({
    'component.participant.bp_info.election_date': { $gte: YYYY_MM_DD },
    //    'component.participant.bp_info.election_date': { $lt: GE_DATE },
    'component.participant.bp_info.candidate_stage_result_id': {
      $exists: true,
    },
  })
  console.info('participants', participants.length)

  var uniqueParticipants = {}
  participants.forEach(p => {
    if (!p.userId) return
    if (uniqueParticipants[p.userId]) {
      if (uniqueParticipants[p.userId]._id + '' > p._id + '') return
    }
    uniqueParticipants[p.userId] = p
  })

  console.info('unique participants', Object.keys(uniqueParticipants).length)
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
      break
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
