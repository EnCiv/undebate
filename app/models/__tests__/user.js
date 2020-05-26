'use strict;'

import User from '../user'
import MongoModels from 'mongo-models'

global.logger = {
  warn: jest.fn(),
  error: jest.fn(),
}

describe('user model tests', () => {
  beforeAll(async () => {
    if (!process.env.MONGODB_URI) {
      throw new Error('Missing MONGODB_URI')
    }
    await MongoModels.connect({ uri: process.env.MONGODB_URI }, {})

    while (MongoModels.toInit && MongoModels.toInit.length) {
      // any models that need to createIndexes will push their init function
      MongoModels.toInit.shift()()
    }
  })

  afterAll(async () => {
    await MongoModels.disconnect()
  })

  const newU = {
    name: 'User Bob',
    email: 'bob_user@example.com',
    password: 'Areallyinsecurepassword?',
  }

  it('should create new a user', async () => {
    var newUObj = await User.create(Object.assign({}, newU)) // create is overwriting the password of the passed object

    expect(newUObj.name).toEqual(newU.name)
    expect(newUObj.email).toEqual(newU.email)

    const foundUser = await User.findOne({ email: newU.email })
    expect(foundUser.name).toEqual(newU.name)
    const validatedPassword = await foundUser.validatePassword(newU.password)
    expect(validatedPassword).toBe(true)
    const failedPassword = await foundUser.validatePassword('wrong-password')
    expect(failedPassword).toBe(false)
    expect(logger.error).toHaveBeenCalledTimes(0)
  })

  it('should delete a users', async () => {
    const deletedUser = await User.findOneAndDelete({ email: newU.email })
    expect(deletedUser.name).toEqual(newU.name)
    expect(deletedUser.email).toEqual(newU.email)
  })

  it('should warn on creating an unexpected field', async () => {
    const newU = {
      name: 'User Unexpected',
      email: 'unexpected_user@example.com',
      password: 'Areallyinsecurepassword?',
      unexpected_field: 'unexpected',
    }

    var newUObj = await User.create(newU)

    expect(newUObj.name).toEqual(newU.name)
    expect(newUObj.email).toEqual(newU.email)
    expect(logger.error).toHaveBeenCalledTimes(0)
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })

  it('should warn on reading back an unexpected field', async () => {
    const newU = {
      name: 'User Alpha',
      email: 'unexpected_user_alpha@example.com',
      password: 'Areallyinsecurepassword?',
      unexpected_field: 'unexpected',
    }
    const deletedUser = await User.findOneAndDelete({ email: newU.email }) // it might exist from the last test- silently delete it
    const unexpectedUser = await MongoModels.dbs['default'].collection('users').insertOne(newU) // we are going around the model by doing this - only for testing

    var newUObj = await User.findOne({ email: newU.email })
    expect(newUObj.name).toEqual(newU.name)
    expect(newUObj.email).toEqual(newU.email)
    expect(newUObj.unexpected_field).toEqual(newU.unexpected_field)
    expect(logger.error).toHaveBeenCalledTimes(0)
    expect(logger.warn).toHaveBeenCalledTimes(1)
  })
})
