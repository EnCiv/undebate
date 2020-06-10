import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useMode } from './phone-portrait-context'

const useStyles = createUseStyles({
  enciv_logos: {
    gridArea: 'logos-enciv',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    '& img': {
      height: '5vmin',
      minHeight: '5vw',
      '@media (min-width: 2780px)': {
        height: '118px',
        minHeight: '0',
      },
    },
    '& :nth-child(2)': {
      marginLeft: '2em',
    },
    '& :first-child': {
      marginTop: '2vh',
    },
  },
  hartford_logos: {
    gridArea: 'logos-hartford',
    width: '100%',
    height: '100%',
    '& img': {
      height: '12vmin',
      minHeight: '9vw',
      '@media (min-width: 2780px)': {
        height: '213px',
        minHeight: '0',
      },
    },
  },
})
const EncivLogo = () => {
  const classes = useStyles()
  const isPortrait = useMode()
  return (
    <div className={classes.enciv_logos}>
      {isPortrait ? (
        <img
          src={
            'https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png'
          }
        />
      ) : (
        <>
          <img
            src={
              'https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png'
            }
            alt="Candidate Conversations by ballotpedia and ENCIV logo"
          ></img>
          <img src={'https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png'} alt="enciv logo"></img>
        </>
      )}
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
