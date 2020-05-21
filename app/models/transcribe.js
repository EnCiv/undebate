`use strict`

const Joi = require('@hapi/joi')
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
        return new Prommise(async (ok, ko) => {
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
                logger.error(`Transcribe.create caught error:`, err)
                ko(err)
            }
        })
    }
}

Transcribe.collectionName = 'transcribe'
Transcribe.scheme = schema

async function init() {
    try {
        await Transcribe.createIndexes([
            { key: { email: 1 }, name: 'email' }
        ])
    } catch (err) {
        logger.error('User.createIndexes error:', err)
    }
}

if (MongoModels.dbs['default']) init()
else if (MongoModels.toInit) MongoModels.toInit.push(init)
else MongoModels.toInit = [init]

module.exports = Transcribe