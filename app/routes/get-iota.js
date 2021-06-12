'use strict'
// this route will overwrite the route by the same name from civil-server
// we need to do this in this repo because DataComponent needs to come from this repo, not the empty one in the civil-server repo

import serverReactRender from '../../node_modules/civil-server/dist/server/routes/server-react-render'
import Sniffr from 'sniffr'
import Device from 'device'
import { DataComponents } from '../data-components'
import { Iota } from 'civil-server'

async function getIota(req, res, next) {
  try {
    let path = req.params[0]
    if (path.startsWith('country:us') && path[path.length - 1] === '!') path = path.substring(0, path.length - 1) // 2020Feb17: The Ballotpedia emails had a ! at the end of the link. This is a correction for that.  This should be removed after Nov 2020 elections - if not before
    const iota = await Iota.findOne({ path: '/' + path }).catch(err => {
      console.error('getIota.findOne caught error', err, 'skipping')
      next()
    })
    if (!iota || iota === 'null') return next('route')
    if (req.reactProps) req.reactProps.iota = iota
    else req.reactProps = { iota }
    if (iota.component) {
      const dataComponent = DataComponents.fetch(iota.component)
      await dataComponent.fetch(iota)
      // the fetch'ed operation must operate on the Object passed
      next()
    } else {
      next()
    }
    // be careful - the await inside the if(iota.component) will fall through - so don't put the next() outside the else
  } catch (err) {
    console.error('Server getIota caught error:', err)
    next(err)
  }
}

function cacheControl(req, res, next) {
  if (process.env.NODE_ENV === 'production')
    res.set('Cache-Control', `public, max-age=${process.env.IOTA_MAX_AGE || 60 * 60}`) // age in seconds - only an hour because candidates may be added, or rerecord
  next()
}

function getBrowserConfig(req, res, next) {
  var sniffr = new Sniffr()
  sniffr.sniff(req.headers['user-agent'])
  var device = Device(req.headers['user-agent'])
  const browserConfig = {
    os: sniffr.os,
    browser: sniffr.browser,
    type: device.type,
    model: device.model,
    referrer: req.headers['referrer'], //  Get referrer for referrer
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, // Get IP - allow for proxy
  }
  if (req.reactProps) req.reactProps.browserConfig = browserConfig
  else req.reactProps = { browserConfig }
  logger.info(req.method, req.originalUrl, req.headers['user-agent'], {
    browserConfig: JSON.stringify(req.reactProps.browserConfig),
  })
  next()
}

export default function route() {
  const serverReactRenderApp = (...args) => serverReactRender(this.App, ...args)
  this.app.get('/*', this.setUserCookie, getBrowserConfig, getIota, cacheControl, serverReactRenderApp)
}
