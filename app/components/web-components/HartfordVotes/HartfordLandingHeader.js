import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const styles = {
  header: {
    width: '100vw',
    backgroundColor: 'pink',
    height: '88vh',
    borderBox: 'box-sizing',

    //grid stuff
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    gridTemplateRows: '1fr 3fr 1fr 1fr',
    gridTemplateAreas: `
    "page-title page-title page-title page-title logos"
    "images images images images images "
    ". . sub-title sub-title sub-title"
    ". questions questions questions questions"`,
  },
  pageTitle: {
    gridArea: 'page-title',
    textAlign: 'left',
    margin: 0,
    padding: '1em 0em 0em 1em',
  },
  subTitle: {
    gridArea: 'sub-title',
    paddingRight: '1em',
    textAlign: 'right',
  },
  logos: {
    boxSizing: 'border-box',
    gridArea: 'logos',
    width: '100%',
    border: '2px solid green',
  },
  headerImages: {
    gridArea: 'images',
    boxSizing: 'border-box',
    width: '100%',
    border: '2px solid red',
  },
  questions: {
    textAlign: 'right',
    border: '2px solid blue',
    boxSizing: 'border-box',
    gridArea: 'questions',
    width: '100%',
    paddingRight: '1em',
  },
}

let HartfordLandingHeader = ({ classes }) => {
  return (
    <header className={classes.header}>
      <h1 className={classes.pageTitle}>
        Hartford Votes ~ Vota Coalition CT State Senator and state Representative Candidates
      </h1>
      <div className={classes.logos}>{/*logos*/}</div>
      <div className={classes.headerImages}>{/* header images*/}</div>
      <h2 className={classes.subTitle}>Connecticut State Senators and State Representatives for the Hartford area</h2>
      <h3 className={classes.questions}>
        Have questions for the candidates? {'->'}
        <button>Click here to ask Questions</button>
      </h3>
    </header>
  )
}

HartfordLandingHeader = injectSheet(styles)(HartfordLandingHeader)
export default HartfordLandingHeader
