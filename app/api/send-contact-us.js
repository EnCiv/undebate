'use strict';

import sendEmail          from '../server/util/send-email';
import Config             from '../../public.json';


function sendContactUs (email, fname, lname, subject, message, cb) {
    let request={
      from      :   Config.sendEmailFrom,
      to        :   Config.sendFeedbackTo,
      subject   :   subject ,
      text      :   message
    }

    if(email)
      request.replyTo=fname + " " + lname + " <" + email + ">";

    logger.info("sendContactUs",request)

    if(process.env.NODEMAILER_SERVICE){
      let results = sendEmail(request);
      results.then(cb)
        .catch(error => cb({ error : error.message }));
    } else {
      cb();
    }
}

export default sendContactUs;
