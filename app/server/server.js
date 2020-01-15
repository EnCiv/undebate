'use strict'

import fs                       from 'fs';
import http                     from 'http';
import { EventEmitter }         from 'events';

import express                  from 'express';
import bodyParser               from 'body-parser';
import cookieParser             from 'cookie-parser';

import printIt                  from './util/express-pretty';

import signInRoute              from './routes/sign-in';
import signUpRoute              from './routes/sign-up';
import tempIdRoute              from './routes/temp-id';
import signOutRoute             from './routes/sign-out';
import setUserCookie            from './routes/set-user-cookie';
import serverReactRender        from './routes/server-react-render';


import User                     from '../models/user';
import Iota                     from '../models/iota';

import API                      from './api';
import Sniffr                   from 'sniffr';
import Device                   from 'device';
import { DataComponent } from '../components/data-components';


class HttpServer extends EventEmitter {

  sockets = {};

  nextSocketId = 0;

  constructor (props) {
    super();

    this.props = props;

    this.setUserCookie=setUserCookie.bind(this); // user cookie needs this context so it doesn't have to lookup users in the DB every time

    this

      .on('message', (...messages) => {
        if ( this.props.verbose ) {
          console.log("server.constructor", ...messages);
        }
      })

      .on('request', printIt)

      .on('response', function (res) {
        printIt(res.req, res);
      });

      process.nextTick(() => {
        try {
          this.app = express();
 
          this.set();

          this.parsers();

          this.cookies();

          this.signers();

          this.cdn();

          this.router();

          this.notFound();

          this.error();

          this.start();
        }
        catch ( error ) {
          this.emit('error', error);
        }
      });

  }

  set () {
    this.app.set('port', +(process.env.PORT || 3012));
  }

  getBrowserConfig(){
    this.app.use((req, res, next) => {
      var sniffr = new Sniffr();
      sniffr.sniff(req.headers['user-agent']);
      var device = Device(req.headers['user-agent']);
      const browserConfig={
          os: sniffr.os,
          browser: sniffr.browser,
          type: device.type,
          model: device.model,
          referrer: req.headers['referrer'], //  Get referrer for referrer
          ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, // Get IP - allow for proxy
      }
      if(req.reactProps) req.reactProps.browserConfig=browserConfig;
      else req.reactProps={browserConfig};
      logger.info(req.method, req.originalUrl, req.headers['user-agent'], {browserConfig: req.reactProps.browserConfig});
      next();
    });
  }


  parsers () {
    this.app.use(
      bodyParser.urlencoded({ extended: true }),
      bodyParser.json(),
      bodyParser.text()
    );
  }

  cookies () {
    this.app.use(cookieParser());
  }

  signers () {
    function sendUserId(req, res){
      res.send({
        in: true,
        id: req.user._id
      });
    }

    this.app.post('/sign/in',
      signInRoute,
      this.setUserCookie,
      sendUserId
      );

    this.app.all('/sign/up',
      signUpRoute,
      this.setUserCookie,
      sendUserId
     );

    this.app.all('/tempid',
      tempIdRoute,
      this.setUserCookie,
      sendUserId
      );

    this.app.all('/sign/out', signOutRoute);
  }

  router () {
    /*if ( process.env.NODE_ENV !== 'production' ) */this.timeout();
    this.getBrowserConfig();
    this.app.get('/robots.txt', (req, res) => { res.type('text/plain'); res.send("User-agent: *\nAllow: /"); });
    this.httpToHttps();
    this.resetPassword(); // before /page/:page
    this.getLandingPage();
    this.getMarkDown();

    this.app.get('/page/:page', serverReactRender);

    this.app.get('/error', (req, res, next) => {
      next(new Error('Test error > next with error'));
    });

    this.app.get('/error/synchronous', (req, res, next) => {
      throw new Error('Test error > synchronous error');
    });

    this.app.get('/error/asynchronous', (req, res, next) => {
      process.nextTick(() => {
        throw new Error('Test error > asynchronous error');
      });
    });
    this.getIota();
  }

  httpToHttps(){
    this.app.enable('trust proxy');
    this.app.use((req,res,next) => {
      let hostName=req.hostname;
      if(hostName==='localhost') return next();
      let hostParts=hostName.split('.');
      if(hostParts.length===4 && hostParts[0]==='192' && hostParts[1]==='168') return next(); // it's coming from the lan
      let addWWW=false;
      /*
      if((hostParts.length && hostParts[1]!=="herokuapp") && (!hostParts.length || hostParts[0]!=='www')){
        hostParts.unshift("www");
        hostName=hostParts.join('.');
        addWWW=true;
      }*/
      console.info("httpToHttps",req.secure, req.protocol, req.hostname);
      if(!req.secure || addWWW){
        console.info("server.httpToHttps redirecting to ", req.secure, 'https://' + hostname + req.url)
        res.redirect('https://' + hostName + req.url);
      } else
        next(); /* Continue to other routes if we're not redirecting */
    })
  }

  // a minute after a request has been received, check and see if the response has been sent.
  timeout () {
    this.app.use((req, res, next) => {
      setTimeout(() => {
         if ( ! res.headersSent ) {
          logger.error("timeout headersSent:", res.headersSent, "originalUrl", req.originalUrl, "ip", req.ip);
          next(new Error('Test error > timeout headers not sent'));
        }
      }, 1000 * 29);
      next();
    });
  }

  getLandingPage () {
      this.app.get('/',(req,res,next) => {     
        try {   
            res.redirect('https://EnCiv.org');
        }
        catch ( error ) {
          this.emit('error', error);
        }
      })
  }

  getIota() {
    this.app.get("/*",this.setUserCookie, async (req,res,next)=>{
      try {
        const iota = await Iota.findOne({path: '/'+req.params[0]}).catch(err=>{console.error("getIota.findOne caught error",err,"skipping"); next()});
        if(!iota || iota==='null') return next('route');
        if(req.reactProps) req.reactProps.iota=iota;
        else req.reactProps={iota};
        if(iota.component){
          const dataComponent=DataComponent.fetch(iota.component);
          await dataComponent.fetch(iota);
          // the fetch'ed operation must operate on the Object passed
          next();
        } else {
          next();
        }
        // be careful - the await inside the if(iota.component) will fall through - so don't put the next() outside the else
      }
      catch(err){
        console.error("Server getIota caught error:",err);
        next(err);
      }
    }, serverReactRender)
  }
  
  getMarkDown () {
    this.app.get('/doc/:mddoc', (req, res, next) => {
      fs
        .createReadStream(req.params.mddoc)
        .on('error', next)
        .on('data', function (data) {
          if ( ! this.data ) {
            this.data = '';
          }
          this.data += data.toString();
        })
        .on('end', function () {
          res.header({ 'Content-Type': 'text/markdown; charset=UTF-8'});
          res.send(this.data);
        });
    });
  }
 
  resetPassword(){
    this.app.get(['/page/reset-password/:token','/page/reset-password/:token/*'], (req, res, next) => {
      try{
        if(req.params.token){
          User.findOne({activation_token: req.params.token}).then(user=>{
              if(user && user._id){
                req.user=user.toJSON();
                req.cookies.synuser={id: req.user._id, email: req.user.email} // passing the activation key also
                req.activation_key=user.activation_key;
                this.setUserCookie(req,res,next);
              }else
                next();
            },
            (error)=>{console.info("resetPassord found error",error); next(error)}
          )
        }
      }
      catch(error){
        next(error);
      }
    },serverReactRender)
  }

  cdn () {
    this.app.use('/assets/',      express.static('assets'));
  }

  notFound () {
    this.app.use((req, res, next) => {
      res.statusCode = 404;
      req.notFound = true;
      next();
    }, serverReactRender);
  }

  error () {
    this.app.use((error, req, res, next) => {
      // res.send('hello')
      this.emit('error', error);

      res.statusCode = 500

      res.locals.error = error;

      next();
    }, serverReactRender);
  }

  start () {
    this.server = http.createServer(this.app);
    this.server.timeout=3*60*1000;

    this.server.on('error', error => {
      this.emit('error', error);
    });

    this.server.listen(this.app.get('port'),  () => {
      logger.info('Server is listening', {
        port    :   this.app.get('port'),
        env     :   this.app.get('env'),
      });

      this.emit('listening', { port : this.app.get('port') });

      this.socketAPI = new API(this)
        .on('error', error => this.emit('error', error))
        .on('message', this.emit.bind(this, 'message'));
    });

    this.server.on('connection', socket => {
      // Add a newly connected socket
      const socketId = this.nextSocketId++;
      this.sockets[socketId] = socket;

      // Remove the socket when it closes
      socket.on('close', () => {
        delete this.sockets[socketId];
      });

      // Extend socket lifetime for demo purposes
      // socket.setTimeout(4000);
    });
  }

  stop () {
    return new Promise((ok, ko) => {
      this.socketAPI.disconnect().then(
        () => {
          this.server.close(ok);

          for (let socketId in this.sockets) {
            logger.info('destroying socket', socketId);
            this.sockets[socketId].destroy();
          }
        },
        ko
      );
    });
  }

}

export default HttpServer;
