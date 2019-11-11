'use strict';

import User from '../../models/user';

async function signIn(req, res, next) {
	try {
		const { password, ..._body } = req.body; // don't let the password appear in the logs
		logger.info({ signIn: _body });
		let { email } = req.body;
		if (!email) {
			res.statusCode = 400;
			res.json({ error: 'Missing email' });
		} else if (!password) {
			res.statusCode = 400;
			res.json({ error: 'Missing password' });
		} else {
			try {
				var user = await User.findOne({ email });
				if (!user) {
					res.statusCode = 404;
					res.json({ 'user/password error': email });
				}
				const validated = await user.validatePassword(password);
				if (!validated) {
					res.statusCode = 404;
					res.json({ 'user/password error': email });
				} else {
					delete user.password;
					req.user = user;
					var newInfo = {};
					let needsUpdate = false;
					Object.keys(_body).forEach(k => {
						if (k === 'email') return;
						if (_body[k] !== user[k]) {
							newInfo[k] = _body[k];
							needsUpdate = true;
						}
					})
					if (needsUpdate) {
						// update is done in the background - no waiting for success or failure
						User.updateOne({ _id: user._id }, newInfo).catch(err => { logger.err("sign_in trying to update user info failed", err, user, newInfo) })
					}
					next();
				}
			}
			catch(err){
				next(err)
			}
		} 
	}
	catch (error) {
		next(error);
	}
}

export default signIn;
