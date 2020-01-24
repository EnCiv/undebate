'use strict';

import React from 'react'; // needed by render to string
import {renderToString} from 'react-dom/server';
import App from '../../components/app';
import { JssProvider, SheetsRegistry } from 'react-jss'
import publicConfig from '../../../public.json';
import cloneDeep from 'lodash/cloneDeep';

function serverReactRender(req, res, next) {
    try {
        const dev=process.env.NODE_ENV || 'development';

        let isIn = null;

        if (req.cookies && req.cookies.synuser) {
            isIn = req.cookies.synuser;

            if (typeof isIn === 'string') {
                isIn = JSON.parse(isIn);
            }
        }

        const props = Object.assign({
            env: dev,
            path: req.path,
            user: isIn,
            notFound: req.notFound,
            error: res.locals.error,
        },cloneDeep(req.reactProps));

        const sheets= new SheetsRegistry()

        const body = renderToString(
                <JssProvider registry={sheets}>
                    <App {...props}/>
                </JssProvider>
        )

        return res.send(
            `<!doctype html>
            <html>
                <head>
                    <meta charSet="UTF-8"/>
                    <title>Undebate</title>
                    <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
                    <meta name='viewport' content='width=device-width, maximum-scale=1.0, initial-scale=1.0' />

                    <link rel='icon' type='image.png' href='/assets/images/favicon-16x16.png' sizes='16x16'/>
                    <link rel='icon' type='image/png' href='/assets/images/favicon-32x32.png' sizes='32x32'/>
                    <link rel="apple-touch-icon" sizes="180x180"  href="/assets/images/apple-touch-icon.png" />
                    <link rel="manifest"  href="/assets/images/site.webmanifest"/>
                    <link rel="shortcut icon" href="/assets/images/favicon.ico" />
                    <meta name="theme-color" content="#ffffff"/>


                    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">

                    <style type="text/css">
                        ${sheets.toString()}
                    </style>

                    <script>window.reactProps=${JSON.stringify(props)+''}</script>
                    <script>window.env="${props.env}"</script>
                    <script src="https://kit.fontawesome.com/7258b64f3b.js" crossorigin="anonymous" async></script>

                </head>
                <body style="margin: 0; padding: 0">
                    <div id="synapp">${body}</div>
                    ${ ( ( props.browserConfig ) && 
                        (
                            ( props.browserConfig.browser.name=="chrome" && props.browserConfig.browser.version[0] >= 54)
                        || ( props.browserConfig.browser.name=="safari" && props.browserConfig.browser.version[0] >= 11)
                        || ( props.browserConfig.browser.name=="opera" && props.browserConfig.browser.version[0] >= 41)
                        || ( props.browserConfig.browser.name=="firefox" && props.browserConfig.browser.version[0] >= 50)
                        || ( props.browserConfig.browser.name=="edge" && props.browserConfig.browser.version[0] >= 15)
                        )
                    ) ? (logger.info("index browser supports ES6"),"")
                        : (logger.info("index browser does not support ES6"),"")
                    }
                    <script src='/socket.io/socket.io.js' ></script>
                    <script src='/assets/webpack/main.js' ></script>
                    <script src='/assets/js/socket.io-stream.js'></script>
                    ${dev==='production' ? `<script>{(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga');ga('create', "${publicConfig['google analytics'].key}", 'auto'); ga('send', 'pageview');}</script>`:''}
                    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
                </body>
            </html>`
        );
    }
    catch (error) {
        logger.info("server-react-render failed", req.path);
        next(error);
    }
}

export default serverReactRender;
