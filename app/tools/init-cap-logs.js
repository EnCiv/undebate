'use strict'
const MongoModels = require('mongo-models')
const publicConfig = require('../../public.json')

const Log = { collectionName: 'logs' } // to follow the format of a MongoModel
async function main() {
  try {
    await MongoModels.connect({ uri: args.db }, { useUnifiedTopology: true })
    // find out if the collection exists without creating the collection
    var collections = await MongoModels.dbs['default'].listCollections({ name: Log.collectionName }).toArray()
    if (collections && collections.length === 1) console.info('Log.init collection already exists')
    console.info('Log.init creating collection')
    var result = await MongoModels.dbs['default'].createCollection(Log.collectionName, {
      capped: true,
      size: publicConfig.MongoLogsCappedSize,
    })
    if (!result) console.error('Log.init result failed')
    else console.info('succuess', result)
    MongoModels.disconnect()
  } catch (err) {
    console.error('Log.init error:', err)
    process.exit(1)
  }
}

global.args = {
  db: '',
  fromPath: '',
  toPath: '',
}

// fetch args from command line
var argv = process.argv
for (let arg = 2; arg < argv.length; arg++) {
  if (typeof global.args[argv[arg]] !== 'undefined') global.args[argv[arg]] = argv[++arg]
  else console.error('ignoring unexpected argument:', argv[arg])
}

;['db'].forEach(a => {
  if (!args[a]) {
    console.error(a, 'is required')
    process.exit(1)
  }
})

main()
