import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Icon from '../../lib/icon'
import { useMode } from './phone-portrait-context'
import { EncivLogo, HartfordLogo } from './logos'

const useStyles = createUseStyles({
  menu: {
    width: '100vw',
    fontSize: '1em',
    color: 'white',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: 'blue',
    paddingTop: '1em',
    height: '3.5em',
    //phones
    '@media only screen and (max-device-width:600px)': {
      width: '3.5em',
      backgroundColor: 'white',
    },
  },
  links: {
    listStyle: 'none',
    zIndex: 10,
    padding: '0px',
    margin: '0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',

    //phones
    '@media only screen and (max-device-width:600px)': {
      fontSize: '2em',
      color: 'black',
      flexDirection: 'column',
      width: '100vw',
      textAlign: 'left',
      position: 'absolute',
      left: '0px',
      top: '10vh',
      backgroundColor: 'white',
    },
  },
  linkContents: {
    '&+&': {
      marginLeft: '6em',
      '@media only screen and (max-device-width:600px)': {
        marginLeft: '1em',
      },
    },
    '@media only screen and (max-device-width:600px)': {
      margin: '1em',
    },
  },
  hamburger: {
    gridArea: 'ham',
    fontSize: '4vh',
    border: 'none',
    background: 'none',
    color: 'black',
    height: '1em',
  },
  smallscreen: {
    height: '10vh',
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 1fr',
    gridTemplateRows: '1fr',
    gridTemplateAreas: `"ham . logos-hartford logos-enciv"`,
    boxShadow: '0em 0.25em 0.2em rgba(0,0,0,0.1)',
    position: 'relative',
    zIndex: 2,
  },
  largescreen: {},
})
//include logos in here for portrait mode rendering as well
const HartfordLandingMenu = () => {
  const classes = useStyles()
  const [isOpen, toggleMenu] = useState(false)
  let isPortrait = useMode()

  const arrayOfLinks = [
    {
      display: 'Find your district',
      key: 'hartford-find-district',
    },
    {
      display: 'FAQs',
      key: 'hartford-faq',
    },
    {
      display: 'How & Where To Vote',
      key: 'hartford-how-where-vote',
    },
    {
      display: 'Contact Us',
      key: 'hartford-contact',
    },
  ]
  const links = (
    <ul className={classes.links}>
      {arrayOfLinks.map(link => (
        <li key={link.key} className={classes.linkContents}>
          <a>{link.display}</a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cx(isPortrait ? classes.smallscreen : classes.largescreen)}>
      {isPortrait ? (
        <nav key="smallscreen-hartford-nav" className={classes.menu}>
          <button className={classes.hamburger} onClick={() => toggleMenu(!isOpen)}>
            <Icon icon={'bars'} />
          </button>
          {isOpen && links}
        </nav>
      ) : (
        <nav key="largescreen-hartford-nav" className={classes.menu}>
          {links}
        </nav>
      )}
      {isPortrait ? (
        <>
          <EncivLogo />
          <HartfordLogo />
        </>
      ) : null}
    </div>
  )
}

export default HartfordLandingMenu
