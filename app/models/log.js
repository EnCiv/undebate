'use strict';
const MongoModels = require('mongo-models');
const Joi = require("@hapi/joi");
const publicConfig = require('../../public.json')

// DON'T USER LOGGER IN THIS FILE - it will create a loop

class Log extends MongoModels {
    static create(obj) {
        return new Promise(async (ok,ko)=>{
            try {
                if(!MongoModels.dbs["default"]){
                    console.error("Log: create before db is ready, discarding",obj);
                    return ok();
                }
                const doc = new Log(obj);
                const result=await this.insertOne(doc);
                if(result && result.length===1)
                    ok(result[0]);
                else {
                    console.error(`Log.create unexpected number of results received ${results.length}`)
                    ko()
                }
            }
            catch(err){
                console.error(`Log.create caught error:`,err)
                ko();
            }
        })
    }
}
 
Log.collectionName = 'logs'; // the mongodb collection name
Log.schema=Joi.object(); // and object with anything in it

async function init(){
    try {
        // find out if the collection exists without creating the collection
        var collections= await MongoModels.dbs['default'].listCollections({name: Log.collectionName}).toArray();
        if(collections && collections.length===1) return;  
        console.info("Log.init creating collection"); 
        var result= await MongoModels.dbs['default'].createCollection(Log.collectionName, { capped: true, size: publicConfig.MongoLogsCappedSize } );
        if(!result) console.error("Log.init result failed");
    }
    catch(err) {
        console.error("Log.init error:", err)
    }
}

if(MongoModels.dbs['default']) init();
else if(MongoModels.toInit) MongoModels.toInit.push(init);
else MongoModels.toInit=[init]

module.exports = Log;