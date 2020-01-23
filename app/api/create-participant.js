'use strict';

import Iota from '../models/iota'

export default async function createParticipant(obj, cb) {
    if (!this.synuser) cb(); // if no user do nothing
    obj.userId = this.synuser.id;
    try {
        var result = await Iota.create(obj);
        cb(result);
        notifyOfNewParticipant(result)
    }
    catch (err) {
        logger.error('createParticipant error:', err);
    }
}
import sendEmail from '../server/util/send-email';
import Config from '../../public.json';
import os from 'os';

if(!process.env.NOTIFY_OF_NEW_PARTICIPANT_TO){
    console.error("NOTIFY_OF_NEW_PARTICIPANT_TO not set in env");
}
async function notifyOfNewParticipant(iota) {
    const viewer = await Iota.findOne({ _id: Iota.ObjectID(iota.parentId) });

    let request = {
        from: Config.sendEmailFrom,
        to: process.env.NOTIFY_OF_NEW_PARTICIPANT_TO || "davidfridley@enciv.org",
        subject: "New Participant Recording",
        text: `New recording from ${iota.component.participant.name} running for ${iota.subject}. View it at https://${process.env.HOSTNAME}${viewer.path}\n\nbp_info=${JSON.stringify(iota.component.participant.bp_info, null, '\t')}`
    }

    logger.info("notifyOfNewParticipant", request);
    sendEmail(request).catch(error => cb({ error: error.message })); // no then because we we have nothing to do but send it out
}
