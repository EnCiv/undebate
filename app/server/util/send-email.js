'use strict';

import nodemailer from 'nodemailer';
import { Logger } from 'log4js';


var config;
if(process.env.NODEMAILER_SERVICE==='Zoho'){
	config={	
		service: 'Zoho',
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASS
		}
	}
}else if(process.env.NODEMAILER_SERVICE==='gmail'){
	config={
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			type: 'OAuth2',
			user: process.env.NODEMAILER_USER,
			serviceClient: process.env.NODEMAILER_SERVICE_CLIENT,
			privateKey: process.env.NODEMAILER_PRIVATE_KEY.replace(/\\n/g,'\n') // the key has \n in it that needs to be converted
		}
	}
}else {
	console.error("send-email NODEMAILER_SERVICE not supported", process.env.NODEMAILER_SERVICE)
}

var transporter;

async function start(){
	try{
		transporter = nodemailer.createTransport(config)
	} 
	catch (err){
		console.error("send-email createTransport failed", config, err)
	}
	try {
		await transporter.verify();
	}
	catch (err){
		console.error(err)
	}
}

if(process.env.NODEMAILER_SERVICE)
	start();


function sendEmail(options = {}) {
	console.log('Sending email', options);
	return new Promise(async (pass, fail) => {
		if (!options.to)
			return fail(new Error('Missing email recipient'));
		if (!options.subject)
			return fail(new Error('Missing email subject'));
		/*if (process.env.NODE_ENV !== 'production') {
			console.log('Not sending emails when not in production', process.env.NODE_ENV);
			return pass();
		}*/
		let results = await transporter.sendMail(options)
		if (parseInt(results.response) === 250) //'250 Message received' from Zoho but gmail is like '250 2.0.0 OK  1573250273 a21sm6579793pjq.1 - gsmtp'
			pass();
		else {
			console.error("sendEmail failed with:", results.response)
			fail(new Error(results.response));
		}
	});
}

export default sendEmail;
