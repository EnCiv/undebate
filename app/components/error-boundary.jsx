'use strict'

import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: '', info: '' }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true, error: error.message, info: info })
    // You can also log the error to an error reporting service
    logger.error(
      'ErrorBoundary caught error:',
      error.message,
      error.stack,
      info,
      this.props.browserConfig,
      location.href
    )
  }

  render() {
    if (this.state.hasError) {
      if (process.env.NODE_ENV === 'development') {
        return (
          <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.info.componentStack}
            </details>
          </div>
        )
      }
      // You can render any custom fallback UI
      // return this if we are in production
      return (
        <div style={{ height: '100vh', width: '100vw' }}>
          <h1>Something went wrong.</h1>
          <p>{this.state.error}</p>
        </div>
      )
    } else return this.props.children
  }
}
