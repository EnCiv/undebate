import React from 'react'
import { createUseStyles } from 'react-jss'
import { useMode } from './phone-portrait-context'
import { HartfordLogo, EncivLogo } from './logos'
import OrangeButton from '../../OrangeButton'

const useStyles = createUseStyles({
  header: {
    '@media (min-aspect-ratio: 1/3)': {},
    width: '100vw',
    backgroundColor: 'white',
    padding: '1em 0em',

    //grid stuff
    display: 'grid',
    gridTemplateColumns: '1fr 4fr 1fr 4fr 1fr',
    gridTemplateRows: '1fr 1fr',
    gridTemplateAreas: `
    "logos-hartford page-title page-title page-title logos-enciv"
    "logos-hartford sub-title sub-title sub-title logos-enciv"`,
  },
  pageTitle: {
    alignSelf: 'center',
    fontSize: '3em',
    color: '#333333',
    gridArea: 'page-title',
    textAlign: 'center',
    margin: '0px',
  },
  subTitle: {
    marginBottom: '1em',
    fontSize: '1.6em',
    fontFamily: 'Helvetica Neue, Regular !important',
    color: '#707070',
    fontWeight: 500,
    padding: '0px 5em',
    '@media only screen and (max-device-width: 900px)': {
      padding: '0px 0em',
    },
    margin: '0px',
    gridArea: 'sub-title',
    textAlign: 'center',
  },
})

const HartfordLandingHeader = () => {
  const classes = useStyles()
  let isPortrait = useMode()

  return (
    <>
      <header className={classes.header} id="landing-header">
        {isPortrait ? null : <HartfordLogo />}
        <h1 className={classes.pageTitle}>Meet Hartford{"'"}s Candidates</h1>
        <h2 className={classes.subTitle}>
          Your information source for the local candidates in the Hartford CT November General Election
        </h2>
        {isPortrait ? null : <EncivLogo />}
      </header>
    </>
  )
}

export default HartfordLandingHeader
