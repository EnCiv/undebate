import React, { useState, useRef, useCallback } from 'react'
import injectSheet from 'react-jss'
import { TwitterSVG } from './socialShareTwitterSVG'
import { FacebookSVG } from './socialShareFacebookSVG'
import { SocialShareSVG } from './socialShareSVG'
import useOnClickOutside from '../hooks/useOnClickOutside'
const styles = {
  shareDropDown: {
    backgroundColor: 'pink',
    width: '85px',
    height: '45px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '10px',
    fontSize: '12px',
  },

  socialSVG: {
    marginRight: '15px',
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
    <div>
      <div onClick={handleClick}>
        <SocialShareSVG />
      </div>
      {isOpen && (
        <div className={classes.shareDropDown} ref={shareLayoverRef}>
          <div>SHARE</div>
          <div>
            <a
              className={classes.socialSVG}
              target="_blank"
              href={`https://twitter.com/intent/tweet?text=Hello%20world`}
            >
              <TwitterSVG />
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=https://www.luismartinez.dev/${metaData.path}&quote=Undebate`}
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
