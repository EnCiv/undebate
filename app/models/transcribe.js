;`use strict`

const Joi = require('@hapi/joi')
const MongoModels = require('mongo-models')

const schema = Joi.object({
  _id: Joi.object(),
  path: Joi.string(),
  subject: Joi.string().required(),
  description: Joi.string().required(),
  component: Joi.object(),
  words: Joi.object(),
  userId: Joi.string(),
  parentId: Joi.string(),
})

class Transcribe extends MongoModels {
  static create(obj) {
    /*const document = new Transcribe2({
            path,
            subject,
        })
        return this.insertOne(document); */
    return new Promise(async (ok, ko) => {
      try {
        const doc = new Transcribe(obj)
        const result = await this.insertOne(doc)
        if (result && result.length === 1) ok(result[0])
        else {
          const msg = ` unexpected number of results received ${results.length}`
          logger.error(msg)
          ko(new Error(msg))
        }
      } catch (err) {
        logger.error(`Transcribe.create caught error:`, err)
        ko(err)
      }
    })
  }
  speak() {
    logger.info(`The file is located + ${this.path} and the file is about ${this.subject}`)
  }
}

Transcribe.collectionName = 'Transcribe'
Transcribe.schema = schema

module.exports = Transcribe
