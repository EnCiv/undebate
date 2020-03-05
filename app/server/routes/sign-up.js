'use strict'

import User from '../../models/user'

function signUp(req, res, next) {
  try {
    let { password, ..._body } = req.body
    let { email } = req.body

    logger.info({ signUp: _body })

    if (!email) {
      res.statusCode = 400
      res.json({ error: 'Missing email' })
    } else if (!password) {
      res.statusCode = 400
      res.json({ error: 'Missing password' })
    } else {
      User.create(req.body).then(
        user => {
          req.user = user
          return next()
        },
        error => {
          if (/duplicate key/.test(error.message)) {
            res.statusCode = 401
            res.json({ error: `Email ${email} already in use`, message: error.message })
          } else {
            next(error)
          }
        }
      )
    }
  } catch (error) {
    next(error)
  }
}

export default signUp
