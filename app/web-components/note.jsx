'use strict'

import React from 'react'
import cx from 'classnames'
import { createUseStyles } from 'react-jss'

export default function Note({ title, content }) {
  const classes = useStyles()
  return (
    <div className={cx(classes['outerBox'], classes['beginBox'])}>
      <div className={classes['note']}>
        <div style={{ width: '100%', height: '100%', display: 'table' }}>
          <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
            <p style={{ fontSize: '150%' }}>{title}</p>
            <p>{content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
const ShadowBox = 10

const useStyles = createUseStyles({
  outerBox: {
    display: 'block',
    width: '100vw',
    height: '100vh',
    boxSizing: 'border-box',
  },
  beginBox: {
    position: 'absolute',
    top: 0,
  },
  note: {
    position: 'absolute',
    'background-color': 'lightyellow',
    top: 'calc( 50vh - (25vw / 2) )', // yes vh - vw because the box is square
    padding: '1em',
    width: '25vw',
    height: '25vw', // yes vw because it's suppose to be square
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
    left: 'calc( 50vw - (25vw / 2))',
    'font-weight': '600',
    'font-size': '125%',
    display: 'table',
  },
})
