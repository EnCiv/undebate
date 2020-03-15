// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'ddfridley@yahoo.com',
  from: 'noreply@enciv.org',
  //subject: 'Sending with Twilio SendGrid is Fun',
  //text: 'and easy to do anywhere, even with Node.js',
  //html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  template_id: 'd-81624978fcea4731bb3ef0656992a1bf',
}
sgMail.send(msg).then(() => {
  console.info('sent')
}, console.error)
