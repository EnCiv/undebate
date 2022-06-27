'use strict'

import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

import DebugOverlay from '../components/debug-overlay'

import Join from '../components/join'

const styles = {
  join: {
    'margin-right': '1em',
    'button&': {
      'margin-left': '1em',
      'padding-top': '0.5em',
      'padding-bottom': '0.5em',
      '&:disabled': {
        'text-decoration': 'none',
        background: 'lightgray',
      },
    },
    'a&': {
      'margin-right': '0.25em',
    },
    'i&': {
      'margin-right': 0,
    },
  },
}

class TestJoin extends React.Component {
  state = { info: 'empty' }

  onUserLogin(info) {
    logger.info('onUserLogin', info)
    this.setState({ info })
  }

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh', textAlign: 'center', verticalAlign: 'middle' }}>
        <Join className={this.props.classes['join']} onChange={this.onUserLogin.bind(this)}></Join>
        <div>info: {JSON.stringify(this.state.info)}</div>
      </div>
    )
  }
}

export default injectSheet(styles)(TestJoin)
