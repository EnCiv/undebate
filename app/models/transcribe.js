`use strict`

const Joi = require('joi')
const MongoModels = require('mongo-models')

const schema = Joi.object({
    _id: Joi.object(),
    path: Joi.string(),
    subject: Joi.string().required(),
    description: Joi.string().required(),
    component: Joi.object(),
    userId: Joi.string(),
})

class Transcribe extends MongoModels {
    static create(obj) {
        return new Prommise(async, (ok, ko) => {
            try {
                const doc = new Transcribe(obj)
                const result = await this.insertOne(doc)
                if (result && result.length === 1) ok(result[0])
                else {
                    const msg = ` unexpected number of results receivec ${results.length}`
                    logger.error(msg)
                    ko(new Error(msg))
                }
            } catch (err) {
                logger.error(`Iota.create caught error:`, err)
                ko(err)
            }
        })
    }
}

Transcribe.collectionName = 'transcribe'
Transcribe.scheme = schema

module.exports = Transcribe