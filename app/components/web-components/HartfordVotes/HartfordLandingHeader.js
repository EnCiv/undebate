import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useMode } from './phone-portrait-context'

const useStyles = createUseStyles({
  header: {
    width: '100vw',
    backgroundColor: 'pink',
    height: 'calc( 100vh - 3.5em )',
    boxSizing: 'border-box',
    padding: '1em 0em',

    //grid stuff
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr',
    gridTemplateRows: '1fr 1fr 10fr',
    gridTemplateAreas: `
    "logos-hartford page-title page-title page-title logos-enciv"
    "logos-hartford sub-title sub-title sub-title logos-enciv"
    ". images images images ."`,

    '@media only screen and (max-device-width: 600px)': {
      gridTemplateColumns: '1fr 2fr 1fr 2fr 1fr',
      gridTemplateRows: '1fr 1fr 6fr 4fr',
      gridTemplateAreas: `
    "logos-hartford page-title page-title page-title logos-enciv"
    "logos-hartford sub-title sub-title sub-title logos-enciv"
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
    margin: '0px',
    gridArea: 'sub-title',
    textAlign: 'center',
  },
  logos_enciv: {
    boxSizing: 'border-box',
    gridArea: 'logos-enciv',
    width: '100%',
    border: '2px solid green',
  },
  logos_hartford: {
    boxSizing: 'border-box',
    gridArea: 'logos-hartford',
    width: '100%',
    border: '2px solid lightgreen',
  },
  headerImages: {
    gridArea: 'images',
    //for overlaying questions
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

    boxSizing: 'border-box',
    width: '100%',
    border: '2px solid red',
  },
  questions: {
    alignSelf: 'center',
    fontSize: '1.3em',
    textAlign: 'right',
    border: '2px solid blue',
    margin: '0px',
    boxSizing: 'border-box',
    gridArea: 'questions',
    width: '100%',
    paddingRight: '1em',
  },
})

const HartfordLandingHeader = () => {
  const classes = useStyles()
  let isPortrait = useMode()

  const question = (
    <h3 className={classes.questions}>
      Have questions for the candidates? → <button>Click here to ask Questions</button>
    </h3>
  )
  const enciv_logos = <div className={classes.logos_enciv}>{/*logos*/}</div>
  const hartford_logos = <div className={classes.logos_hartford}>{/*logos*/}</div>
  return (
    <>
      <header className={classes.header} id="landing-header">
        {isPortrait ? null : hartford_logos}
        <h1 className={classes.pageTitle}>Hartford Votes ~ Vota Coalition</h1>
        <h2 className={classes.subTitle}>
          Meet the Candidates for CT State Senator and State Representative for Hartford
        </h2>
        {isPortrait ? null : enciv_logos}
        <div className={classes.headerImages}>
          {/* header images*/}
          {isPortrait ? null : question}
        </div>
        {isPortrait ? question : null}
      </header>
    </>
  )
}

export default HartfordLandingHeader
