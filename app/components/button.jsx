import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const styles = {
  Button: {
    color: 'white',
    background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '1.25em',
    padding: '1em',
    'margin-top': '1em',
  },
}

class Button extends React.Component {
  render() {
    const { className, classes, children, ...otherProps } = this.props
    return (
      <button className={cx(classes['Button'], className)} {...otherProps}>
        {children}
      </button>
    )
  }
}

export default injectSheet(styles)(Button)
