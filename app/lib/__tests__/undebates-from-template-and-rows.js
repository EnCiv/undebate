import MongoModels from 'mongo-models'
import { Iota } from 'civil-server'
import undebatesFromTemplateAndRows from '../undebates-from-template-and-rows'
import viewerRecorderTemplate from '../../tools/2021-nac-viewer-recorder'
import { cloneDeep } from 'lodash'

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

let outRowObjs

test('create an election in the db', async () => {
  const { rowObjs, messages } = await undebatesFromTemplateAndRows(viewerRecorderTemplate, inputRowObjs)
  expect(messages).toMatchInlineSnapshot(
    [
      expect.stringMatching(
        /created recorder President, \/country:us\/organization:cfa\/office:president\/2021-03-21, \/country:us\/organization:cfa\/office:president\/2021-03-21-recorder-[0-9a-fA-F]{24}$/
      ),

      expect.stringMatching(
        /created recorder President, \/country:us\/organization:cfa\/office:president\/2021-03-21, \/country:us\/organization:cfa\/office:president\/2021-03-21-recorder-[0-9a-fA-F]{24}$/
      ),
    ],
    `
    Array [
      StringMatching /created recorder President, \\\\/country:us\\\\/organization:cfa\\\\/office:president\\\\/2021-03-21, \\\\/country:us\\\\/organization:cfa\\\\/office:president\\\\/2021-03-21-recorder-\\[0-9a-fA-F\\]\\{24\\}\\$/,
      StringMatching /created recorder President, \\\\/country:us\\\\/organization:cfa\\\\/office:president\\\\/2021-03-21, \\\\/country:us\\\\/organization:cfa\\\\/office:president\\\\/2021-03-21-recorder-\\[0-9a-fA-F\\]\\{24\\}\\$/,
    ]
  `
  )
  outRowObjs = rowObjs
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

test('update the agenda', async () => {
  const modifiedViewerRecorderTemplate = cloneDeep(viewerRecorderTemplate)
  modifiedViewerRecorderTemplate.candidateViewer.webComponent.participants.moderator.agenda = [
    ['New Introductions', '1- Name', '2- Planet', '3- language', '4- What role are you running for?'],
    ['How did you evolve?'],
    ['What is your favorite pet'],
    ['How do we get off this planet'],
    [
      'What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?',
    ],
    ['Thank you!'],
  ]
  modifiedViewerRecorderTemplate.candidateRecorder.component.participants.moderator.agenda = [
    ['1- How To', '2- Record Placeholder'],
    ['New Introductions', '1- Name', '2- Planet', '3- language', '4- What role are you running for?'],
    ['How did you evolve?'],
    ['What is your favorite pet'],
    ['How do we get off this planet'],
    ['This on has fewer rows'],
  ]
  modifiedViewerRecorderTemplate.candidateRecorder.webComponent.instructionLink = undefined

  const { rowObjs, messages } = await undebatesFromTemplateAndRows(modifiedViewerRecorderTemplate, outRowObjs)
  expect(messages).toMatchInlineSnapshot(`
    Array [
      "webComponent.participants.moderator.agenda[0][0]: changing \\"Introductions\\" to \\"New Introductions\\"",
      "webComponent.participants.moderator.agenda[0][2]: changing \\"2- City and State\\" to \\"2- Planet\\"",
      "webComponent.participants.moderator.agenda[0][3]: changing \\"3- One word to describe yourself\\" to \\"3- language\\"",
      "webComponent.participants.moderator.agenda[1][0]: changing \\"How did you get started with your brigade?\\" to \\"How did you evolve?\\"",
      "webComponent.participants.moderator.agenda[2][0]: changing \\"A prospective volunteer comes to you and asks \\\\\\"what can I do as part of the CfA Brigade Network that I can’t accomplish anywhere else?\\\\\\" How would you answer?\\" to \\"What is your favorite pet\\"",
      "webComponent.participants.moderator.agenda[3][0]: changing \\"Brigades of all sizes struggle with attracting and retaining volunteers, but this is especially draining for small brigades in less populous communities. What ideas do you have for supporting participation in situations where the Brigade model is not thriving?\\" to \\"How do we get off this planet\\"",
      "component.participants.moderator.agenda[1][0]: changing \\"Introductions\\" to \\"New Introductions\\"",
      "component.participants.moderator.agenda[1][2]: changing \\"2- City and State\\" to \\"2- Planet\\"",
      "component.participants.moderator.agenda[1][3]: changing \\"3- One word to describe yourself\\" to \\"3- language\\"",
      "component.participants.moderator.agenda[2][0]: changing \\"How did you get started with your brigade?\\" to \\"How did you evolve?\\"",
      "component.participants.moderator.agenda[3][0]: changing \\"A prospective volunteer comes to you and asks \\\\\\"what can I do as part of the CfA Brigade Network that I can’t accomplish anywhere else?\\\\\\" How would you answer?\\" to \\"What is your favorite pet\\"",
      "component.participants.moderator.agenda[4][0]: changing \\"Brigades of all sizes struggle with attracting and retaining volunteers, but this is especially draining for small brigades in less populous communities. What ideas do you have for supporting participation in situations where the Brigade model is not thriving?\\" to \\"How do we get off this planet\\"",
      "component.participants.moderator.agenda[5][0]: changing \\"What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?\\" to \\"This on has fewer rows\\"",
      "deleting component.participants.moderator.agenda[6]: Thank you!",
      "deleting webComponent.instructionLink: ",
      "component.participants.moderator.agenda[1][0]: changing \\"Introductions\\" to \\"New Introductions\\"",
      "component.participants.moderator.agenda[1][2]: changing \\"2- City and State\\" to \\"2- Planet\\"",
      "component.participants.moderator.agenda[1][3]: changing \\"3- One word to describe yourself\\" to \\"3- language\\"",
      "component.participants.moderator.agenda[2][0]: changing \\"How did you get started with your brigade?\\" to \\"How did you evolve?\\"",
      "component.participants.moderator.agenda[3][0]: changing \\"A prospective volunteer comes to you and asks \\\\\\"what can I do as part of the CfA Brigade Network that I can’t accomplish anywhere else?\\\\\\" How would you answer?\\" to \\"What is your favorite pet\\"",
      "component.participants.moderator.agenda[4][0]: changing \\"Brigades of all sizes struggle with attracting and retaining volunteers, but this is especially draining for small brigades in less populous communities. What ideas do you have for supporting participation in situations where the Brigade model is not thriving?\\" to \\"How do we get off this planet\\"",
      "component.participants.moderator.agenda[5][0]: changing \\"What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?\\" to \\"This on has fewer rows\\"",
      "deleting component.participants.moderator.agenda[6]: Thank you!",
      "deleting webComponent.instructionLink: ",
    ]
  `)
  delete modifiedViewerRecorderTemplate.candidateRecorder.webComponent.instructionLink // setting to undefined above will cause deletion
  expect(rowObjs[0].viewer_url).toBe('https://cc.enciv.org/country:us/organization:cfa/office:president/2021-03-21')
  expect(rowObjs[0].recorder_url).toMatch(
    /https:\/\/cc.enciv.org\/country:us\/organization:cfa\/office:president\/2021-03-21-recorder-[a-f\d]{24}$/
  )
  const viewers = await Iota.find({ path: '/country:us/organization:cfa/office:president/2021-03-21' })
  expect(viewers[0]).toMatchObject(modifiedViewerRecorderTemplate.candidateViewer)
  const [recorder0] = await Iota.find({ 'bp_info.candidate_name': rowObjs[0].Name })

  expect(recorder0).toMatchObject(modifiedViewerRecorderTemplate.candidateRecorder)
  const [recorder1] = await Iota.find({ 'bp_info.candidate_name': rowObjs[1].Name })
  expect(recorder1).toMatchObject(modifiedViewerRecorderTemplate.candidateRecorder)
  expect(recorder0.parentId).toBe(MongoModels.ObjectID(viewers[0]._id).toString())
  expect(recorder1.parentId).toBe(MongoModels.ObjectID(viewers[0]._id).toString())
})
