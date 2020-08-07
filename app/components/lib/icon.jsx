'use strict'

import React from 'react'

class Icon extends React.Component {
  render() {
    let classes = ['fa']
    const { icon, size, list, spin, circle, mute, flip, ...newProps } = this.props

    if (icon) {
      classes.push(`fa-${icon}`)
    }

    if (size) {
      classes.push(`fa-${size}x`)
    }

    if (list) {
      classes.push('fa-li')
    }

    if (spin) {
      classes.push('fa-spin')
    }
    if (flip) {
      classes.push(`fa-flip-${flip}`)
    }

    if (this.props.className) {
      for (let cls of this.props.className.split(/\s+/)) {
        classes.push(cls)
      }
    }

    if (circle) {
      classes.push('fa-stack-1x')
      return (
        <span className="fa-stack fa-lg">
          <i className="fa fa-circle-o fa-stack-2x"></i>
          <i {...newProps} className={classes.join(' ')}></i>
        </span>
      )
    } else {
      return <i {...newProps} className={classes.join(' ')}></i>
    }
  }
}

export default Icon
