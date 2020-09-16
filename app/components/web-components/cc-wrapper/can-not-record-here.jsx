'use strict;'

import { createUseStyles } from 'react-jss'
import ConversationHeader from '../../conversation-header'
import cx from 'classnames'

const ShadowBox = 10

const useStyles = createUseStyles({
  outerBox: {
    display: 'block',
    boxSizing: 'border-box',
    minHeight: '100vh',
  },
  beginBox: {
    position: 'absolute',
    top: 0,
  },
  note: {
    position: 'absolute',
    'background-color': 'lightyellow',
    top: 'calc( ( 100vh - min( 50vw, 50vh)) / 2 )',
    padding: '1em',
    width: 'calc( min(50vw, 50vh) )',
    height: 'calc( min(50vw, 50vh) )',
    'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
    left: 'calc( ( 100vw - min( 50vw, 50vh)) / 2 )',
    'font-weight': '600',
    display: 'table',
    transition: 'all .5s linear',
  },
})

export const CanNotRecordHere = props => {
  const { subject, bp_info, logo } = props
  const classes = useStyles()
  return (
    <div className={cx(classes['outerBox'], classes['beginBox'])}>
      <ConversationHeader subject={subject} bp_info={bp_info} logo={logo} />
      <div className={classes['note']}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
          <p style={{ fontSize: '150%' }}>Recording video from this device or browser is not yet supported.</p>
          <p>Please come back to this link from a Windows 10 PC or a Mac using the Chrome browser.</p>
        </div>
      </div>
    </div>
  )
}

export default CanNotRecordHere
