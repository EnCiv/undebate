import React, { useState, useRef, useCallback } from 'react'
import injectSheet from 'react-jss'
import SocialShareSVG from './socialShareSVG'
import { TwitterSVG } from './socialShareTwitterSVG'
import { FacebookSVG } from './socialShareFacebookSVG'
import { useOnClickOutside } from '../hooks'
const styles = {
  socialShareWrapper: {
    position: 'absolute',
    zIndex: '100',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '99%',
    bottom: '1rem',
  },
  shareDropDown: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
    padding: '0.1em',
    fontSize: '.8em',
    textAlign: 'center',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
}
const SocialShareBtn = props => {
  const [isOpen, setIsOpen] = useState(false)
  const shareLayoverRef = useRef(null)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  useOnClickOutside(
    shareLayoverRef,
    useCallback(() => setIsOpen(!isOpen), [isOpen])
  )
  const { classes, metaData } = props
  return (
    <div className={classes.socialShareWrapper} style={{ fontSize: props.fontSize }}>
      <SocialShareSVG isOpen={isOpen} handleClick={handleClick} />
      {isOpen && (
        <div className={classes.shareDropDown} ref={shareLayoverRef}>
          <div>SHARE</div>
          <div className={classes.iconWrapper}>
            <a
              className={classes.socialSVG}
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=Join%20the%20${metaData.subject}%20at&url=${window.location}`}
            >
              <TwitterSVG />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${window.location}&quote=Undebate%20join%20the%20${metaData.subject}`}
              target="_blank"
            >
              <FacebookSVG />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default injectSheet(styles)(SocialShareBtn)
