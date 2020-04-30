// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  from: { email: 'noreply@enciv.org', name: 'EnCiv.org' },
  to: 'ddfridley@gmail.com',
  subject: 'this is not the subject in the template',
  dynamic_template_data: {
    //asm_global_unsubscribe_raw_url: 'https://enciv.org/unsubscribe',
    candidate_name: 'David D. Fridley',
    viewer_url: 'https://cc.enciv.org/schoolboard-conversation',
  },
  template_id: 'd-000f4e702e8b42d19c5a416febfa5e8c',
}
sgMail.send(msg).then(result => {
  console.info('sent')
}, console.error)
