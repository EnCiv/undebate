'use strict'

function sendLinkRoute(req, res, next) {
  try {
    logger.info('####this is the link route#####', req.body)
    res.statusCode = 200
    res.json({ message: 'successful, email is being sent' })
  } catch (error) {
    next(error)
  }
}

export default sendLinkRoute
