import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useMode } from './phone-portrait-context'

const useStyles = createUseStyles({
  enciv_logos: {
    gridArea: 'logos-enciv',
    marginTop: 'auto',
    marginBottom: '9px',
    '& img': {
      height: '12vmin',
      minHeight: '9vw',
      '@media only screen and (max-device-width: 600px)': {
        maxHeight: '2.7em',
        position: 'absolute',
        top: '0',
        left: '10em',
      },
    },
  },
  hartford_logos: {
    gridArea: 'logos-hartford',
    width: '100%',
    height: 'min-content',
    marginTop: 'auto',
    '& img': {
      marginTop: '0px',
      height: '12vmin',
      minHeight: '9vw',
      paddingRight: '2vw',
      paddingLeft: '2vw',
      '@media only screen and (max-device-width: 600px)': {
        maxHeight: '1.7em',
        position: 'absolute',
        top: '.2em',
        left: '1em',
      },
      '@media (min-width: 2780px)': {},
    },
  },
})
const EncivLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.enciv_logos}>
      <img
        src={'https://res.cloudinary.com/hf6mryjpf/image/upload/v1591846510/assets/EnCivCandidateConversations.svg'}
      />
    </div>
  )
}
const HartfordLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.hartford_logos}>
      <img
        src={'https://res.cloudinary.com/hf6mryjpf/image/upload/v1591726798/assets/HVC_Logo-1.png'}
        alt="Hartford Votes. Hartford Vota. Coalition. Logo."
      ></img>
    </div>
  )
}

export { EncivLogo, HartfordLogo }
