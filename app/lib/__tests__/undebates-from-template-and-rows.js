import MongoModels from 'mongo-models'
import { Iota } from 'civil-server'
import undebatesFromTemplateAndRows from '../undebates-from-template-and-rows'
import viewerRecorderTemplate from '../../tools/2021-nac-viewer-recorder'

// dummy out logger for tests
if (!global.logger) {
  global.logger = console
}

beforeAll(async () => {
  await MongoModels.connect({ uri: global.__MONGO_URI__ }, { useUnifiedTopology: true })
  // run the init functions that models require - after the connection is setup
  const { toInit = [] } = MongoModels.toInit
  MongoModels.toInit = []
  for await (const init of toInit) await init()
})

afterAll(async () => {
  MongoModels.disconnect()
})

const inputRowObjs = [
  { Seat: 'President', Name: 'John Doe', Email: 'johndoe@example.com' },
  { Seat: 'President', Name: 'Jane Doe', Email: 'janedoe@doe.com' },
]

test('create an election in the db', async () => {
  const { rowObjs, messages } = await undebatesFromTemplateAndRows(viewerRecorderTemplate, inputRowObjs)
  console.info('messages', messages)
  expect(rowObjs[0].viewer_url).toBe('https://cc.enciv.org/country:us/organization:cfa/office:president/2021-03-21')
  expect(rowObjs[0].recorder_url).toMatch(
    /https:\/\/cc.enciv.org\/country:us\/organization:cfa\/office:president\/2021-03-21-recorder-[a-f\d]{24}$/
  )
  const viewers = await Iota.find({ path: '/country:us/organization:cfa/office:president/2021-03-21' })
  expect(viewers[0]).toMatchObject(viewerRecorderTemplate.candidateViewer)
  const [recorder0] = await Iota.find({ 'bp_info.candidate_name': rowObjs[0].Name })
  expect(recorder0).toMatchObject(viewerRecorderTemplate.candidateRecorder)
  const [recorder1] = await Iota.find({ 'bp_info.candidate_name': rowObjs[1].Name })
  expect(recorder1).toMatchObject(viewerRecorderTemplate.candidateRecorder)
  expect(recorder0.parentId).toBe(MongoModels.ObjectID(viewers[0]._id).toString())
  expect(recorder1.parentId).toBe(MongoModels.ObjectID(viewers[0]._id).toString())
})
