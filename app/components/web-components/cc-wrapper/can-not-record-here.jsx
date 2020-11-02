'use strict;'

import { createUseStyles } from 'react-jss'
import ConversationHeader from '../../conversation-header'
import cx from 'classnames'
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows'
import LaptopIcon from '@material-ui/icons/Laptop'
import ChromeIcon from '../../../svgr/chrome-icon'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

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
    'background-color': 'white',
    top: 'calc( ( 100vh - min( 50vw, 50vh)) / 2 )',
    width: 'calc( min(60vw, 60vh) )',
    height: 'calc( min(70vw, 70vh) )',
    'box-shadow': `0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)`,
    left: 'calc( ( 100vw - min( 60vw, 60vh)) / 2 )',
    display: 'inline',
    transition: 'all .5s linear',
    fontSize: '2rem',
  },
  title: {
    'background-color': '#e5a650',
    'font-weight': '600',
    padding: '1em',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '3rem',
  },
  titleText: {
    height: '35px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '.5rem',
  },
  text: {
    padding: '2rem',
  },
  middle: {
    display: 'flex',
    padding: '2rem',
  },
  chrome: {
    height: '35px',
    float: 'left',
    width: '60%',
    display: 'flex',
    paddingLeft: '.5rem',
    alignItems: 'center',
  },
})

export const CanNotRecordHere = props => {
  const { subject, bp_info, logo } = props
  const classes = useStyles()
  return (
    <div className={cx(classes['outerBox'], classes['beginBox'])}>
      <ConversationHeader subject={subject} bp_info={bp_info} logo={logo} />
      <div className={classes['note']}>
        <div className={classes['title']}>
          <ErrorOutlineIcon style={{ fontSize: 30 }} />
          <div className={classes['titleText']}>Device not supported</div>
        </div>
        <div>
          <div className={classes['text']}>We recommend visiting this link from a:</div>
          <div className={classes['middle']}>
            <div style={{ float: 'left', width: '40%', textAlign: 'center' }}>
              <DesktopWindowsIcon style={{ fontSize: 50 }} />
              <div>Desktop</div>
            </div>
            <div style={{ display: 'block', float: 'left', width: '20%', textAlign: 'center' }}>
              <div>|</div>
              <div>OR</div>
              <div>|</div>
            </div>
            <div style={{ float: 'left', width: '40%', textAlign: 'center' }}>
              <LaptopIcon style={{ fontSize: 50 }} />
              <div>Laptop</div>
            </div>
          </div>
          <div className={classes['text']}>With the following browser:</div>
          <div style={{ paddingLeft: '2rem', paddingRight: '2rem' }}>
            <div style={{ float: 'left', width: '30%', textAlign: 'right' }}>
              <ChromeIcon width="50%" height="50%" />
            </div>
            <div className={classes['chrome']}>
              <div>Google Chrome</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CanNotRecordHere
