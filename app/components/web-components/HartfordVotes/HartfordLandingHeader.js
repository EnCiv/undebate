import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useMode } from './phone-portrait-context'
import { HartfordLogo, EncivLogo } from './logos'
import OrangeButton from '../../OrangeButton'

const useStyles = createUseStyles({
  header: {
    width: '100vw',
    backgroundColor: 'white',
    height: 'calc( 100vh - 3.5em )',
    minHeight: '375px',
    padding: '1em 0em',

    //grid stuff
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr',
    gridTemplateRows: '1fr 1fr 10fr',
    gridTemplateAreas: `
    "logos-hartford page-title page-title page-title logos-enciv"
    "logos-hartford sub-title sub-title sub-title logos-enciv"
    "images images images images images"`,

    '@media only screen and (max-device-width: 600px)': {
      gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr',
      gridTemplateRows: '1fr 1fr 6fr 4fr',
      gridTemplateAreas: `
    "page-title page-title page-title page-title page-title"
    "sub-title sub-title sub-title sub-title sub-title"
    "images images images images images"
    "questions questions questions questions questions"`,
    },
  },
  pageTitle: {
    alignSelf: 'center',
    fontSize: '3em',
    gridArea: 'page-title',
    textAlign: 'center',
    margin: '0px',
  },
  subTitle: {
    fontSize: '1.5em',
    fontWeight: '200',
    color: 'grey',
    padding: '0px 5em',
    '@media only screen and (max-device-width: 900px)': {
      padding: '0px 0em',
    },
    margin: '0px',
    gridArea: 'sub-title',
    textAlign: 'center',
  },
  logos_enciv: {},
  logos_hartford: {},
  headerImages: {
    minHeight: '250px',
    gridArea: 'images',
    //for overlaying questions

    '& > div': {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr 3fr',
      gridTemplateRows: '1fr 3fr 1fr',
      gridTemplateAreas: `
    ". . ."
    ". . ."
    ". questions questions"`,
      '@media only screen and (max-device-width: 600px)': {
        position: 'relative',
        display: 'block',
        gridTemplateColumns: 0,
        gridTemplateRows: 0,
        gridTemplateAreas: 0,
      },
      border: '2px solid red',
      justifyContent: 'center',
      margin: 'auto',
      '@media (min-aspect-ratio: 19/13)': {
        width: 'calc(( 83vh - 3.5em ) * 1.8)',
        height: 'calc(83vh - 3.5em)',
      },
      width: '100%',
      height: 'calc(100vw * 0.55)',
    },
    border: '2px solid green',
    '& img': {
      height: '100%',
      position: 'relative',
      zIndex: 2,
    },
    background:
      'url(https://res.cloudinary.com/hf6mryjpf/image/upload/w_1200/q_auto:best/v1591726876/assets/HVC_Banner-1.jpg) top center no-repeat',
    '@media only screen and (max-device-width: 600px)': {
      background:
        'url(https://res.cloudinary.com/hf6mryjpf/image/upload/w_600/q_auto:best/v1591726876/assets/HVC_Banner-1.jpg) top center no-repeat',
    },
    backgroundSize: 'contain',
    position: 'relative',
  },
  questions: {
    alignSelf: 'center',
    color: 'white',
    fontWeight: '200',
    fontSize: '1.3em',
    textAlign: 'right',
    border: '2px solid blue',
    margin: '0px',
    gridArea: 'questions',
    width: '100%',
    paddingRight: '1em',
    '@media only screen and (max-device-width: 600px)': {
      color: 'black',
    },
    '@media only screen and (max-device-width: 415px)': {
      '& button': {
        width: '100%',
      },
      paddingLeft: '1em',
      textAlign: 'center',
      fontSize: '2em',
      fontWeight: '600',
      letterSpacing: '0.06em',
    },
  },
})

const HartfordLandingHeader = () => {
  const classes = useStyles()
  let isPortrait = useMode()

  const question = (
    <h3 className={classes.questions}>
      Have questions for the candidates? → <OrangeButton>Click here to ask Questions</OrangeButton>
    </h3>
  )
  return (
    <>
      <header className={classes.header} id="landing-header">
        {isPortrait ? null : <HartfordLogo />}
        <h1 className={classes.pageTitle}>Hartford Votes ~ Vota Coalition</h1>
        <h2 className={classes.subTitle}>
          Meet the Candidates for CT State Senator and State Representative for Hartford
        </h2>
        {isPortrait ? null : <EncivLogo />}
        <div className={classes.headerImages}>
          <div>{isPortrait ? null : question}</div>
        </div>
        {isPortrait ? question : null}
      </header>
    </>
  )
}

export default HartfordLandingHeader
