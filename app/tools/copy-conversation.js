#!/usr/bin/env node
'use strict'

// copy-conversation db $MONGODB_URI fromPath country:us/state:ca......-2020-06-02 toPath country:us/state:ca/...-2020-05-09
//
// copy a candidate conversation in the db matching fromPath to toPath
// this makes a copy of the viewerIota and the participantIotas, and creates a new field component.copiedFrom
//     that has the Id, stage_id, and/or candidate_stage_result_id for the original -
//     then in the copy stage_id or candidate_stage_result_id are not present - to prevent conflicts in the validity check.
//     the viewer has a new _id and the participants have parentId set to point to the new viewer
//
// did this to solve some problems that remained after cleaning up integration issues with the ballotpedia data
// that happened because election dates change and we needed the viewer to work with the old date in the url and the new date in the url
// but this was probably just a onetime issue and it shouldn't be a problem going forward.
//

import { Iota } from 'civil-server'
const MongoModels = require('mongo-models')

// Iota uses logger
const log4js = require('log4js')

if (!global.logger) {
  global.logger = log4js.getLogger('node')
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } },
  })
}

global.args = {
  db: '',
  fromPath: '',
  toPath: '',
}

async function main() {
  await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
  while (MongoModels.toInit && MongoModels.toInit.length) {
    // any models that need to createIndexes will push their init function
    MongoModels.toInit.shift()()
  }
  var iotaList = []
  const parentIota = await Iota.findOne({ path: '/' + args.fromPath }).catch(err => {
    console.error('getIota.findOne caught error', err, 'skipping')
    process.exit()
  })
  if (!parentIota || parentIota === 'null') return console.info('nothing found for path:', args.fromPath)
  let parentId = parentIota._id.toString() // grab the parentId before fix up
  iotaList.push(parentIota)
  var newParticipantIotas = await Iota.aggregate([
    { $match: { parentId, 'component.component': 'MergeParticipants' } },
    { $sort: { _id: -1 } },
    { $group: { _id: '$userId', latest: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$latest' } },
  ])

  if (!newParticipantIotas || !newParticipantIotas.length) return console.info('no participants found for path:', path)
  newParticipantIotas.forEach(iota => iotaList.push(iota))

  iotaList[0].path = '/' + args.toPath
  iotaList[0].component.copiedFrom = {
    _id: iotaList[0]._id,
    bp_info: {
      stage_id: iotaList[0].bp_info.stage_id,
    },
  }
  iotaList[0]._id = Iota.ObjectID()
  delete iotaList[0].bp_info.stage_id // delete is so that it doesn't show up as a duplicate error
  let newParentId = iotaList[0]._id.toString()
  for (let i = 1; i < iotaList.length; i++) {
    iotaList[i].component.copiedFrom = {
      _id: iotaList[i]._id,
      parentId: iotaList[i].parentId,
      component: {
        participant: {
          bp_info: {
            candidate_stage_result_id: iotaList[i].component.participant.bp_info.candidate_stage_result_id,
          },
        },
      },
    }
    iotaList[i]._id = Iota.ObjectID()
    delete iotaList[i].component.participant.bp_info.candidate_stage_result_id
    iotaList[i].parentId = newParentId
  }

  for await (const doc of iotaList) {
    try {
      const result = await Iota.insertOne(doc)
      if (typeof result !== 'object' || result.length !== 1) {
        logger.error('Iota.init result not ok', result, 'for', doc)
      }
    } catch (err) {
      if ((err.code = 11000 && /.*iotas.\$path/.test(err.message))) {
        logger.error('toPath already exists', doc.path)
        MongoModels.disconnect()
        process.exit(1)
      } else {
        logger.error('Iota.insertOn caught error', err, 'doc was', doc)
        throw err
      }
    }
  }
  MongoModels.disconnect()
}

// fetch args from command line
var argv = process.argv
for (let arg = 2; arg < argv.length; arg++) {
  if (typeof global.args[argv[arg]] !== 'undefined') global.args[argv[arg]] = argv[++arg]
  else console.error('ignoring unexpected argument:', argv[arg])
}

;['fromPath', 'toPath', 'db'].forEach(a => {
  if (!args[a]) console.error(a, 'is required')
})

main()
