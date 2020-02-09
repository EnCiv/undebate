'use strict';

import React from 'react';


export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: '', info: '' };
    }
  
    componentDidCatch(error, info) {
      // Display fallback UI
      this.setState({ hasError: true, error: error, info: info });
      // You can also log the error to an error reporting service
      logger.error("ErrorBoundary caught error:",error, info, this.props.browserConfig, location.href);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div style={{height: "100vh", width: "100vw"}}>
                <h1>Something went wrong.</h1>
            </div>
        );
      } else 
      return this.props.children;
    }
  }