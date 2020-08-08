import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Icon from '../../lib/icon'
import { useMode } from './phone-portrait-context'
import { EncivLogo, HartfordLogo } from './logos'

const useStyles = createUseStyles({
  menu: {
    width: '100vw',
    fontSize: '1.3vw',
    color: 'white',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: '#29316E',
    paddingTop: '1.2em',
    height: '3.5em',
    maxHeight: '10vh',
    //phones
    '@media only screen and (max-device-width:600px)': {
      fontSize: '1em',
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
      color: '#333333',
      flexDirection: 'column',
      width: '60vw',
      minWidth: '200px',
      textAlign: 'left',
      position: 'absolute',
      right: '2em',
      zIndex: 2,
      boxShadow: '0em 1em 0.9em 1em rgba(0,0,0,0.1)',
      top: '2.45em',
      backgroundColor: 'white',
      '& :last-child': {
        paddingBottom: 'calc((100vh - (9 * 1em)) / 18 )',
        border: 'none',
      },
    },
  },
  linkContents: {
    lineHeight: 1,
    borderBottom: '1px dotted rgba(0,0,0,0.1)',
    '@media only screen and (max-device-width:600px)': {
      paddingTop: 'calc((100vh - (9 * 1em)) / 18 )',
      paddingBottom: 'calc((100vh - (9 * 1em)) / 18 )',
      paddingLeft: '1em',
      marginLeft: 0,
      marginRight: 0,
    },
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    '&+&': {
      marginLeft: '6em',
      '@media only screen and (max-device-width:600px)': {
        paddingLeft: '1em',
        marginLeft: 0,
        marginRight: 0,
      },
    },
  },
  hamburger: {
    position: 'absolute',
    top: '.5em',
    right: '.5em',
    color: '#333333',
    gridArea: 'ham',
    fontSize: '2em',
    border: 'none',
    background: 'none',
    height: '1em',
  },
  smallscreen: {
    height: '4.9em',
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
      display: 'FAQs',
      key: 'hartford-faq',
      href: '/hartford/faq',
      target: '',
    },
    {
      display: 'Candidate Bios',
      key: 'hartford-candidate-bios',
      href: '/hartford/bios',
      target: '',
    },
    {
      display: 'How & Where To Vote',
      key: 'hartford-how-where-vote',
      href: 'https://portaldir.ct.gov/sots/LookUp.aspx',
      target: '_blank',
    },
    {
      display: 'Contact Us',
      key: 'hartford-contact',
      href: 'mailto:HartfordVota@gmail.com',
      target: '_blank',
    },
    {
      display: 'About',
      key: 'about',
      href: '/hartford/about',
      target: '',
    },
    {
      display: 'Rank the Candidates',
      key: 'score',
      href: '/assets/hartfordScoreCard.pdf',
      target: '_blank',
    },
  ]
  const links = (
    <ul className={classes.links}>
      {arrayOfLinks.map(link => (
        <li key={link.key} className={classes.linkContents}>
          <a href={link.href} target={link.target}>
            {link.display}
          </a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cx(isPortrait ? classes.smallscreen : classes.largescreen)}>
      {isPortrait ? (
        <>
          <EncivLogo />
          <HartfordLogo />
        </>
      ) : null}
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
    </div>
  )
}

export default HartfordLandingMenu
