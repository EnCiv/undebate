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
      //logger.error(error, info);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return (
            <div>
                <h1>Something went wrong.</h1>
                <div style={{whiteSpace: 'pre-wrap'}}>
                <label>Info</label>
                {JSON.stringify(this.state.info)}
                </div>
                <div style={{whiteSpace: 'pre-wrap'}}>
                <label>Error</label>
                {JSON.stringify(this.state.error)}
                </div>
            </div>
        );
      }
      return this.props.children;
    }
  }