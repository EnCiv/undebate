'use strict';
const Joi = require("@hapi/joi");
const MongoModels = require('mongo-models');
const bcrypt=require('bcrypt');
 
const schema = Joi.object({
    _id: Joi.object(),
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string(),
});
 
class User extends MongoModels {
    static create(user) {
        return new Promise(async (ok,ko)=>{
            var error;
            const {password, email, name}=user;
            if(password && email){
                bcrypt.hash(password,10, async (err, hash)=>{
                    if(err) {
                        logger.error((error=`User password encryption failed ${err}`));
                        ko(new Error(error));
                    } else {
                        user.password=hash;
                        const doc=new User(user);
                        try {
                            const result=await this.insertOne(doc);
                            if(result && result.length===1)
                                ok(result[0]);
                            else {
                                logger.error((error=`unexpected number of results received ${results.length}`))
                                ko(new Error(error))
                            }
                        }
                        catch(err){
                            ko(err);
                        }
                    }
                })
                return; // let bcrypt do it's think
            } else if(!email) {
                error=`User.create attempted, but no email. name=${name}`
            } else if(!password){
                error=`User.create attempted, but no password. name=${name}, email=${email}`
            }
            logger.error(error);
            ko(new Error(error));
        })
    }
    validatePassword(plainTextPassword){
        return new Promise((ok,ko)=>{
            bcrypt.compare(plainTextPassword,this.password, (err, res)=>{
                if(err) {
                    logger.error("User.validatePassword returned error:",err);
                    ko(newError(err));
                } else {
                    ok(res)
                }
            })
        })
    }
}

User.collectionName = 'users'; // the mongodb collection name
User.schema = schema;

async function init(){
    try {
        await User.createIndexes(
                [{key: {email: 1}, name: 'email', unique: true, partialFilterExpression: {email: {$exists: true}} }]
            );
        }
    catch(err) {
        logger.error("User.createIndexes error:", err)
    }
}

if(MongoModels.dbs['default']) init();
else if(MongoModels.toInit) MongoModels.toInit.push(init);
else MongoModels.toInit=[init]
 
module.exports = User;