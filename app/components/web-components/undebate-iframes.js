'use strict'

import React from 'react'
import injectSheet from 'react-jss'

const styles = {
  title: {
    color: 'black',
    fontSize: '2rem',
    textAlign: 'center',
  },
  frame: { marginTop: '1em', marginBottom: '1em', width: '100vw' },
}

class UndebateIframes extends React.Component {
  render() {
    const { classes } = this.props
    const width = typeof window !== 'undefined' ? window.innerWidth : 1920
    const height = typeof window !== 'undefined' ? window.innerHeight : 1080

    return (
      <div>
        <div>
          <span className={classes['title']}>These are the Undebates</span>
        </div>
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race1"
          src="https://cc.enciv.org/san-francisco-district-attorney"
        />
        <iframe
          className={classes.frame}
          height={height * 0.9}
          width={width}
          name="race2"
          src="https://cc.enciv.org/country:us/state:wi/office:city-of-onalaska-mayor/2020-4-7"
        />
      </div>
    )
  }
}

export default injectSheet(styles)(UndebateIframes)
