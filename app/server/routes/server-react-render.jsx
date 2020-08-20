'use strict'

import React from 'react' // needed by render to string
import { renderToString } from 'react-dom/server'
import App from '../../components/app'
import { JssProvider, SheetsRegistry, createGenerateId } from 'react-jss'
import cloneDeep from 'lodash/cloneDeep'

function serverReactRender(req, res, next) {
  try {
    const dev = process.env.NODE_ENV || 'development'

    let isIn = null

    if (req.cookies && req.cookies.synuser) {
      isIn = req.cookies.synuser

      if (typeof isIn === 'string') {
        isIn = JSON.parse(isIn)
      }
    }

    const props = Object.assign(
      {
        env: dev,
        path: req.path,
        user: isIn,
        notFound: req.notFound,
        error: res.locals.error,
      },
      cloneDeep(req.reactProps)
    )

    const sheets = new SheetsRegistry()
    const generateId = createGenerateId()

    const body = renderToString(
      <JssProvider registry={sheets} generateId={generateId}>
        <App {...props} />
      </JssProvider>
    )

    // extract meta tags from the web component
    const metaTags = () =>
      (props.iota &&
        props.iota.webComponent &&
        props.iota.webComponent.metaTags &&
        props.iota.webComponent.metaTags.reduce((acc, meta) => acc + `<meta ${meta}>\n`, '')) ||
      ''

    // figure out if browsers supports ES6 or not.
    const ifES6 = () =>
      props.browserConfig &&
      ((props.browserConfig.browser.name == 'chrome' && props.browserConfig.browser.version[0] >= 54) ||
        (props.browserConfig.browser.name == 'safari' && props.browserConfig.browser.version[0] >= 11) ||
        (props.browserConfig.browser.name == 'opera' && props.browserConfig.browser.version[0] >= 41) ||
        (props.browserConfig.browser.name == 'firefox' && props.browserConfig.browser.version[0] >= 50) ||
        (props.browserConfig.browser.name == 'edge' && props.browserConfig.browser.version[0] >= 15))
        ? (logger.info('index browser supports ES6'), '')
        : (logger.info('index browser does not support ES6'), '')

    // add google analitics code if env is set - usually only set in production
    const googleAnalytics = () =>
      process.env.GOOGLE_ANALYTICS
        ? `<!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-158107083-2"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.GOOGLE_ANALYTICS}');
      </script>`
        : ''

    return res.send(
      `<!doctype html>
            <html>
                <head>
                    <meta charSet="UTF-8"/>
                    <title>${(props.iota && props.iota.subject) || 'Candidate Conversations'}</title>
                    <meta httpEquiv='X-UA-Compatible' content='IE=edge'/>
                    <meta name='viewport' content='width=device-width, maximum-scale=1.0, initial-scale=1.0' />
                    <link rel='icon' type='image.png' href='/assets/images/favicon-16x16.png' sizes='16x16'/>
                    <link rel='icon' type='image/png' href='/assets/images/favicon-32x32.png' sizes='32x32'/>
                    <link rel="apple-touch-icon" sizes="180x180"  href="/assets/images/apple-touch-icon.png" />
                    <link rel="manifest"  href="/assets/images/site.webmanifest"/>
                    <link rel="shortcut icon" href="/assets/images/favicon.ico" />
                    <meta name="theme-color" content="#ffffff"/>
                    ${metaTags()}
                    <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
                    <style type="text/css">
                        ${sheets.toString()}
                    </style>
                    <script>window.reactProps=${JSON.stringify(props) + ''}</script>
                    <script>window.env="${props.env}"</script>
                    <script src="https://kit.fontawesome.com/7258b64f3b.js" crossorigin="anonymous" async></script>
                    <script>function setFontSize(){document.getElementsByTagName("html")[0].style.fontSize=Math.round(Math.min(window.innerWidth,window.innerHeight))/100*(15/(1080/100))+'px'}; window.onresize=setFontSize; setFontSize();</script>
                </head>
                <body style="margin: 0; padding: 0">
                    <div id="synapp">${body}</div>
                    ${ifES6()}
                    <script src='/socket.io/socket.io.js' ></script>
                    <script src='/assets/webpack/main.js' ></script>
                    <script src='/assets/js/socket.io-stream.js'></script>
                    ${googleAnalytics()}
                    <script src="https://webrtc.github.io/adapter/adapter-latest.js"></script>
                </body>
            </html>`
    )
  } catch (error) {
    logger.info('server-react-render failed', req.path)
    next(error)
  }
}

export default serverReactRender
