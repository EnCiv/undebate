import React from 'react'
import { createUseStyles } from 'react-jss'
import { useMode } from './phone-portrait-context'
import { HartfordLogo, EncivLogo } from './logos'
import OrangeButton from '../../OrangeButton'

const useStyles = createUseStyles({
  header: {
    '@media (min-aspect-ratio: 1/3)': {
      //maxHeight: '900px',
      // make a constant height
    },
    width: '100vw',
    backgroundColor: 'white',
    //height: 'calc( 100vh - 3.5em )',
    //minHeight: '500px',
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
  headerImages: {
    minHeight: '310px',
    gridArea: 'images',
    //for overlaying questions

    '& > div': {
      maxHeight: '719px',
      maxWidth: '1350px',
      minHeight: '310px',
      minWidth: '600px',
      display: 'grid',
      gridTemplateColumns: '1fr 3fr 3fr',
      gridTemplateRows: '1fr 3fr 1fr',
      gridTemplateAreas: `
    ". . ."
    ". . ."
    ". questions questions"`,
      '@media only screen and (max-device-width: 600px)': {
        minWidth: '0',
        minHeight: '0',
        position: 'relative',
        display: 'block',
        gridTemplateColumns: 0,
        gridTemplateRows: 0,
        gridTemplateAreas: 0,
      },
      justifyContent: 'center',
      margin: 'auto',
      '@media (min-aspect-ratio: 19/13)': {
        width: 'calc(( 83vh - 3.5em ) * 1.8)',
        height: 'calc(83vh - 3.5em)',
      },
      '@media (min-height: 490px) and not (min-device-height: 490px)': {
        minHeight: '368px',
      },
      //'@media (max-height: 540px) and (max-width: 750px)': {
      '@media (max-width: 600px)': {
        minHeight: '100%',
        minWidth: '100%',
        '@media (max-width: 660px)': {
          minHeight: '0px',
        },
      },
      width: '100%',
      height: 'calc(100vw * 0.53)',
    },
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
})

const HartfordLandingHeader = () => {
  const classes = useStyles()
  let isPortrait = useMode()

  return (
    <>
      <header className={classes.header} id="landing-header">
        {isPortrait ? null : <HartfordLogo />}
        <h1 className={classes.pageTitle}>Hartford Votes ~ Vota Coalition</h1>
        <h2 className={classes.subTitle}>Meet Hartford{"'"}s Candidates - August 11 Primary, State Representatives</h2>
        {isPortrait ? null : <EncivLogo />}
      </header>
    </>
  )
}

export default HartfordLandingHeader
