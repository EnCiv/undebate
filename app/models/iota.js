'use strict';
const Joi = require("@hapi/joi");
const MongoModels = require('mongo-models');
const iota = require('../../iota.json')
 
const schema = Joi.object({
    _id: Joi.object(),
    path: Joi.string(),
    subject: Joi.string().required(),
    description: Joi.string().required(),   
    webComponent: [Joi.string(),Joi.object()],
    participants: Joi.object(),
    component: Joi.object(),
    userId: Joi.string(),
    parentId: Joi.string()
});
 
class Iota extends MongoModels {
    static create(obj) {
        return new Promise(async (ok,ko)=>{
            try {
                const doc = new Iota(obj);
                const result=await this.insertOne(doc);
                if(result && result.length===1)
                    ok(result[0]);
                else {
                    const msg=`unexpected number of results received ${results.length}`
                    logger.error(msg)
                    ko(new Error(msg));
                }
            }
            catch(err){
                logger.error(`Iota.create caught error:`,err)
                ko(err);
            }
        })
    }
}
 
Iota.collectionName = 'iotas'; // the mongodb collection name
Iota.schema = schema;

async function init(){
    try {
        await Iota.createIndexes(
                [{key: {path: 1}, name: 'path', unique: true, partialFilterExpression: {path: {$exists: true}} }]
            );
        var count=await Iota.count();
        logger.info("Iota.init count",count)
        if(!count && iota && iota.length){
            iota.forEach(i=>{i._id=Iota.ObjectID(i._id.$oid)}); // converge object _id's to objects
            var writeResult=await Iota.insertMany(iota);
            if(!writeResult || !writeResult.length){
                logger.error("Iota.init error initializing collection");
            }else{
                logger.info("Iota.init collection initialized with", writeResult.length, "documents");
            }
        }
    }
    catch(err) {
        logger.error("Iota.createIndexes error:", err)
    }
}

if(MongoModels.dbs['default']) init();
else if(MongoModels.toInit) MongoModels.toInit.push(init);
else MongoModels.toInit=[init]

module.exports = Iota;