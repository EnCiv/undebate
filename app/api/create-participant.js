'use strict';

import Iota from '../models/iota'

export default async function createParticipant (obj, cb) {
    if(!this.synuser) cb(); // if no user do nothing
    obj.userId=this.synuser.id;
    try{
        var result=await Iota.create(obj);
        cb(result)
    }
    catch(err){
        logger.error('createParticipant error:',err);
    }
}
