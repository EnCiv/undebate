import MongoModels from 'mongo-models'
import getViewersByOffice from '../get-viewers-by-office'

global.logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}
jest.setTimeout(30000)

describe('get-viewers-by-office', () => {
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI')
    }
    await MongoModels.connect({ uri: process.env.MONGODB_URI }, {})

    for await (const init of MongoModels.toInit) {
      await init()
    }
  })

  afterAll(async () => {
    MongoModels.disconnect()
    console.info('disconnected')
  })

  test('should find a viewer', async () => {
    const expected = [
      expect.stringContaining(
        '/country:us/state:ct/state-legislative-upper:connecticut-state-senate-district-2/stage:primary/party:democratic-party/2020-08-11-qa'
      ),
    ]

    const viewers = await getViewersByOffice('8218')
    console.log(viewers, viewers.length)
    expect(viewers.length).toEqual(1)
    expect(viewers).toEqual(expect.arrayContaining(expected))
    return
  })

  test('should not find a viewer', async () => {
    const viewers = await getViewersByOffice('9999999999')
    expect(viewers.length).toEqual(0)
    return
  })
})
