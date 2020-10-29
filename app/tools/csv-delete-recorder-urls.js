#!/usr/bin/env node
'use strict;'

// read in a csv file, and delete the recorders denoted by the url in the file

const cloneDeep = require('lodash/cloneDeep')
var MongoClient = require('mongodb').MongoClient
const csv = require('csvtojson')

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

if (args.src && args.db) {
  csv()
    .fromFile(args.src)
    .then(async csvRowObjList => {
      const client = await MongoClient.connect(args.db, { useUnifiedTopology: true })
      const db = client.db()
      for await (const csvRowObj of csvRowObjList) {
        const myURL = new URL(csvRowObj.recorder_url)
        try {
          const recorder = await db.collection('iotas').findOne({ path: myURL.pathname })
          if (!recorder) {
            console.info('can not find recorder for', csvRowObj.recorder_url)
            continue
          }
          console.info('delete', myURL.pathname, '_id:', recorder._id.toString())
          await db.collection('iotas').deleteOne({ path: myURL.pathname })
        } catch (err) {
          console.error('caught error trying:', csvRowObj.recorder_url, err.message || err)
        }
      }
      client.close()
    })
    .catch(err => {
      console.error('csv caught error', err)
    })
} else {
  console.error('usage: csv-delete-recorder-urls src <csv file> db <database uri>')
  process.exit()
}
