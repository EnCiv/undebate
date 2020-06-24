import MongoModels from 'mongo-models'
import getViewersByOffice from '../get-viewers-by-office'

global.logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}

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

  it('should find a viewer', async () => {
    const viewers = await getViewersByOffice('8218')
    expect(viewers.length).toEqual(1)
    expect(viewers[0].bp_info.race.office.id).toEqual('8218')
  })

  it('should not find a viewer', async () => {
    const viewers = await getViewersByOffice('9999999999')
    expect(viewers.length).toEqual(0)
  })
})
