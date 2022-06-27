import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { ModeProvider } from './hartford-votes/phone-portrait-context'
import Icon from '../components/lib/icon'
import HartfordLandingMenu from './hartford-votes/HartfordLandingMenu'
import ReactHtmlParser from 'react-html-parser'

const useStyles = createUseStyles({
  hartfordabout: {
    color: '#333333',
    fontWeight: 700,
    fontFamily: 'Libre Franklin',
    fontSize: '16px',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    width: '100vw',
    textAlign: 'center',
    gridTemplateRows: '1fr min-content',
    textAlign: 'left',
    minHeight: '100vh',
    '& article': {
      maxWidth: '64em',
      width: '80vw',
      margin: '0 auto',
      fontWeight: 100,
      '& h3': {
        wordSpacing: '.35em',
        letterSpacing: '.08em',
        '& + p': {
          marginLeft: '1em',
          marginBottom: '2em',
        },
      },
    },
    '& button, & a': {
      fontFamily: 'Libre Franklin, SemiBold',
      fontWeight: 500,
    },
    '& h1, & h2, & h3, & h4': {
      fontFamily: 'Libre Franklin, Bold',
    },
    '@media (min-width: 1000px) and (min-height: 1000px)': { fontSize: '20px' },

    '& *': {
      boxSizing: 'border-box',
    },
  },
})

const useHeaderStyles = createUseStyles({
  aboutheader: background => ({
    position: 'relative',
    marginBottom: '7em',
    height: '10em',
    padding: '1.6em',
    '& h1': {
      marginLeft: 'auto',
      marginRight: 'auto',
      margin: '1em auto 3em auto',
      width: 'max-content',
      maxWidth: '70vw',
      minWidth: 'min-content',
    },
    '& *': {
      color: '#29316E',
      position: 'relative',
      zIndex: 1,
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      right: '0',
      left: '0',
      bottom: '0',
      display: 'block',
      top: '0',
      zIndex: -1,
      opacity: '0.14',
      background: background,
    },
  }),
})

const FAQHeader = ({ homelink, background }) => {
  const classes = useHeaderStyles(background)
  console.log(useStyles)
  return (
    <div className={classes.aboutheader}>
      <div>
        <a href={homelink}>HOME</a>
        {'>'}About
      </div>
      <h1>About</h1>
    </div>
  )
}
FAQHeader.defaultProps = {
  background: 'red',
}

const About = ({ content, banner, homelink }) => {
  const classes = useStyles()

  return (
    <about-dom key="siteAbout">
      <ModeProvider>
        <div className={classes.hartfordabout}>
          <HartfordLandingMenu />
          <FAQHeader background={banner} homelink={homelink} />
          <article className={classes.article}>{ReactHtmlParser(content)}</article>
        </div>
      </ModeProvider>
    </about-dom>
  )
}

export default About
