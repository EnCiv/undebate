'use strict'

import React from 'react'
import { hot } from 'react-hot-loader'
import AskWebRTC from './ask-webrtc'
import WebComponent from '../web-components'
import Footer from './footer'
import SiteFeedback from './site-feedback'
import ErrorBoundary from './error-boundary'

class App extends React.Component {
  render() {
    if (this.props.path === '/') return <AskWebRTC />
    else if (this.props.iota) {
      var { iota, ...newProps } = this.props
      Object.assign(newProps, this.props.iota)
      return (
        <ErrorBoundary>
          <div style={{ position: 'relative' }}>
            <WebComponent key="web-component" webComponent={this.props.iota.webComponent} {...newProps} />
            <Footer key="footer" />
            <SiteFeedback key="site-feedback" />
          </div>
        </ErrorBoundary>
      )
    } else
      return (
        <ErrorBoundary>
          <div style={{ position: 'relative' }}>
            <div>Nothing Here</div>
            <Footer />
            <SiteFeedback />
          </div>
        </ErrorBoundary>
      )
  }
}

export default hot(module)(App)
