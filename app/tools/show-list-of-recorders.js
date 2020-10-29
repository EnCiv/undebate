#!/usr/bin/env node
'use strict;'

// read in a csv file, and delete the recorders denoted by the url in the file

var MongoClient = require('mongodb').MongoClient

// fetch args from command line
var argv = process.argv
var args = {}
for (let arg = 2; arg < argv.length; arg++) {
  switch (argv[arg]) {
    case 'url': // the csv file
    case 'db': // the mongo database URI
      args[argv[arg]] = argv[++arg]
      break
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}

async function main() {
  const client = await MongoClient.connect(args.db, { useUnifiedTopology: true })
  const db = client.db()
  const viewer = await db.collection('iotas').findOne({ path: args.url })
  if (!viewer) {
    console.error('viewer not found for', args.url)
    client.close()
    process.exit(1)
  }
  const recorders = await db
    .collection('iotas')
    .find({ parentId: viewer._id.toString(), 'component.component': 'UndebateCreator' })
    .toArray()
  if (!recorders || !recorders.length) {
    console.info('no recorders found')
    client.close()
    process.exit(0)
  }
  console.info('found:', recorders.length)
  recorders.forEach(recorder => {
    console.info(
      recorder.bp_info.candidate_name,
      recorder.bp_info.candidate_emails,
      recorder.bp_info.person_emails,
      recorder.bp_info.bp_url
    )
  })
  client.close()
  process.exit(0)
}
if (args.url && args.db) {
  main()
} else {
  console.error('usage: show-list-of-recorders uri <recorder path> db <database uri>')
  process.exit()
}
