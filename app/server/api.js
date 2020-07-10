'use strict'

import { EventEmitter } from 'events'
import fs from 'fs'
import path from 'path'
import SocketIO from 'socket.io'
import S from 'underscore.string'
import cookieParser from 'cookie-parser'
import ss from 'socket.io-stream'
import cloudinary from 'cloudinary'
import User from '../models/user'

// this is not catching the errors from hartford-address-lookup when there is not MAPS Api set - but still maybe it will catch some other error
function handlerWrapper(handler, ...args) {
  try {
    handler.apply(this, args)
  } catch (error) {
    logger.error('caught error from api handler', handler.name, error.message, 'continuing', error)
  }
}

class API extends EventEmitter {
  constructor(server) {
    super()

    if (server) {
      process.nextTick(() => {
        try {
          this.server = server
          this.users = []
          this.handlers = {}
          this.sockets = []
          this.fetchHandlers().then(() => this.start(), this.emit.bind(this, 'error'))
        } catch (error) {
          this.emit('error', error)
        }
      })
    }
  }

  disconnect() {
    return new Promise((ok, ko) => {
      if (!this.sockets.length) {
        return ok()
      }

      const promises = this.sockets.map(
        socket =>
          new Promise((ok, ko) => {
            if (!socket.connected) {
              return ok()
            }

            socket.on('disconnect', ok).disconnect(true)
          })
      )

      Promise.all(promises).then(results => {
        // this.io.close(closed => console.log('{ closed }'));
        ok()
      }, ko)
    })
  }

  fetchHandlers() {
    return new Promise(async (ok, ko) => {
      try {
        var filenames = await new Promise((ok, ko) => {
          return fs.readdir(path.resolve(__dirname, '../api'), (err, filenames) => (err ? ko(err) : ok(filenames)))
        })
        filenames.forEach(file => {
          try {
            if (!/[\w|\d|-]+.js$/.test(file)) {
              // ignore .map files, and files that don't end in .js and don't fit the pattern
              return
            } else {
              const name = S(file.replace(/\.js$/, ''))
                .humanize()
                .value()
                .toLowerCase()

              const handler = require('../api/' + file).default

              if (typeof handler !== 'function') {
                throw new Error(`API handler ${name} (${file}) is not a function`)
              }

              this.handlers[name] = handler

              this.handlers[name].slugName = file.replace(/\.js$/, '')
            }
          } catch (error) {
            logger.error(`Error requiring api file ${file} on start, skipping`, error)
            return // keep processing more files
          }
        })
        ok()
      } catch (err) {
        console.error('api', err)
        ko(err)
      }
    })
  }

  start() {
    try {
      this.io = SocketIO.listen(this.server.server)
      logger.info('socketIO listening')
      this.io
        .use(this.identify.bind(this))
        .on('connection', this.connected.bind(this))
        .on('connect_error', error => {
          logger.error('socket io connection_error', error, this)
        })
        .on('connect_timeout', error => {
          logger.error('socket io connection_timeout', error, this)
        })
    } catch (error) {
      this.emit('error', error)
    }
  }

  async validateUserCookie(cookie, ok, ko) {
    var usr = this.users.reduce((found, user) => {
      if (user.id === cookie.id) {
        found = user
      }
      return found
    }, null)
    if (usr) return ok()
    else {
      usr = await User.findOne({ _id: User.ObjectID(cookie.id) })
      if (!usr) {
        logger.error(`API:validateUserCookie id ${cookie.id} not found in this server/db`)
        if (ko) ko()
      } else {
        this.users.push(cookie)
        return ok()
      }
    }
  }

  /** Identify client
   *  @arg      {Socket} socket
   *  @arg      {Function} next
   */

  identify(socket, next) {
    try {
      const req = {
        headers: {
          cookie: socket.request.headers.cookie,
        },
      }

      cookieParser()(req, null, () => {})

      let cookie = req.cookies.synuser

      if (cookie) {
        if (typeof cookie === 'string') {
          cookie = JSON.parse(cookie)
        }
        this.validateUserCookie(
          cookie,
          () => {
            socket.synuser = cookie
            next()
          },
          () => {
            next(new Error(`API: User id ${cookie.id} not found in this server/db`))
          }
        )
      } else next()
    } catch (error) {
      this.emit('error', error)
    }
  }

  /** On every client's connection
   *  @arg      {Socket} socket
   */

  connected(socket) {
    try {
      this.sockets.push(socket)

      socket.on('error', error => {
        console.error('socket got error event')
        this.emit('error', error)
      })
      socket.on('connect_timeout', error => logger.error('socket connected timeout', error))
      socket.on('connect_error', error => logger.error('socket connect_error', error))

      socket.on('disconnect', () => {})

      socket.emit('welcome', socket.synuser)

      socket.broadcast.emit('online users', this.users.length)
      socket.emit('online users', this.users.length)
      logger.trace('socket connected', { id: socket.id, synuser: socket.synuser, onlineUsers: this.users.length })

      socket.ok = (event, ...responses) => {
        const formatted = responses.map(res => {
          let stringified = JSON.stringify(res)

          if (typeof stringified === 'undefined') {
            return 'undefined'.magenta
          }

          return stringified.magenta
        })

        // this.emit('message', '>>>'.green.bold, event.green.bold, ...formatted);
        logger.trace('api: connected: socket.ok ', event, ...responses)
        socket.emit('OK ' + event, ...responses)
      }

      socket.error = error => {
        this.emit('error', error)
      }

      for (let handler in this.handlers) {
        socket.on(handler, handlerWrapper.bind(socket, this.handlers[handler]))
      }

      this.stream(socket)
    } catch (error) {
      this.emit('error', error)
    }
  }

  stream(socket) {
    try {
      ss(socket).on('upload image', (stream, data) => {
        const filename = '/tmp/' + data.name
        logger.info('upload image', { stream }, { data }, { filename })
        stream.pipe(fs.createWriteStream(filename)).on('error', err => {
          logger.error('Error uploading file:', filename, err)
        })
      })
      ss(socket).on('upload video', (stream, data, cb) => {
        const public_id = data.name.split('.')[0]

        var cloudStream = cloudinary.v2.uploader.upload_stream(
          {
            resource_type: 'video',
            public_id,
            eager_async: true,
            //raw_convert => "google_speech",
            eager: [
              { quality: 'auto:good', format: 'mp4' },
              { start_offset: 0, format: 'png' },
            ],
          },
          (err, result) => {
            // you can't set the timeout:120000 option in the first paramater - it gets an error 504
            if (err) {
              logger.error('upload video cloudinary.uploader.upload_stream error:', err, data)
              cb()
            } else {
              cb(result.secure_url)
            }
          }
        )
        stream.pipe(cloudStream).on('error', err => {
          logger.error('Error uploading stream:', filename, err)
          cb()
        })
        cloudStream.on('error', err => {
          console.info('cloudStream error:', err)
          cb()
        })
      })
    } catch (error) {
      this.emit('error', error)
    }
  }
}

export default API
