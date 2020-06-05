import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import Icon from '../../lib/icon'

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
      top: '1.75em',
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
    fontSize: '1.5em',
    border: 'none',
    background: 'none',
    color: 'black',
    height: '1em',
  },
  smallscreen: {
    display: 'none',
    //phones
    '@media only screen and (max-device-width:600px)': {
      display: 'block',
    },
  },
  largescreen: {
    display: 'none',
    //phones
    '@media (min-device-width:601px)': {
      display: 'block',
    },
  },
})
//include logos in here for portrait mode rendering as well
const HartfordLandingMenu = () => {
  const classes = useStyles()
  const [isOpen, toggleMenu] = useState(false)

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
    <div>
      <nav key="smallscreen-hartford-nav" className={cx(classes.menu, classes.smallscreen)}>
        <button className={classes.hamburger} onClick={() => toggleMenu(!isOpen)}>
          <Icon icon={'bars'} />
        </button>
        {isOpen && links}
      </nav>

      <nav key="largescreen-hartford-nav" className={cx(classes.menu, classes.largescreen)}>
        {links}
      </nav>
    </div>
  )
}

export default HartfordLandingMenu
