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
    margin: '0.4rem 0 0 0',
    fontSize: '2rem',
    marginTop: '0.75rem',
  },
  shareDropDown: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '20%',
    maxWidth: '7rem',
    height: '9%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '0.5rem',
    fontSize: '1.5rem',
    marginRight: '0.3rem',
    textAlign: 'center',
  },

  socialSVG: {
    marginRight: '0.8rem',
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
    <div className={classes.socialShareWrapper}>
      <SocialShareSVG isOpen={isOpen} handleClick={handleClick} />
      {isOpen && (
        <div className={classes.shareDropDown} ref={shareLayoverRef}>
          <div>SHARE</div>
          <div>
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
