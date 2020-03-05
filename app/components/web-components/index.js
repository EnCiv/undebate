'use strict'
// @create-index
// imagine one day a program that automatically generates this
// until that day, this is manual
//
// TypeComponent will accept a function (.default) or a module (exports), so you don't need to add .default to new entries.
// Also, TypeComponent.attributes() will return module.attributes if it is defined.

const WebComponents = {
  TestJoin: require('./test-join'),
  Undebate: require('./undebate'),
  CandidateConversation: require('./candidate-conversation'),
  UndebateLine: require('./undebate-line'),
}

import React from 'react'

class WebComponent extends React.Component {
  static attributes(webComponent) {
    let WebComponent
    if (typeof webComponent === 'object') {
      WebComponent = WebComponents[webComponent.webComponent]
      if (typeof WebComponent === 'object') return WebComponent.attributes
      else return {}
    } else {
      WebComponent = WebComponents[webComponent]
      if (typeof WebComponent === 'object') return WebComponent.attributes
      else return {}
    }
  }
  render() {
    const objOrStr = this.props.webComponent
    var WebComponentClass
    var newProps = {}

    if (typeof objOrStr === 'object') {
      Object.assign(newProps, this.props, objOrStr)
      WebComponentClass = WebComponents[objOrStr.webComponent]
    } else {
      // string
      Object.assign(newProps, this.props)
      WebComponentClass = WebComponents[objOrStr]
    }
    if (typeof WebComponentClass === 'object')
      // commonJS module or require
      WebComponentClass = WebComponentClass.default

    if (newProps.webComponent) delete newProps.webComponent

    if (typeof WebComponentClass === 'function') return <WebComponentClass {...newProps} />
    logger.error('WebComponent not function', typeof WebComponentClass)
    return null
  }
}

export default WebComponent
