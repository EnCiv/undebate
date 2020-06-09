import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'

const useStyles = createUseStyles({
  enciv_logos: {
    gridArea: 'logos-enciv',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    '& img': {
      height: '5vh',
    },
    '& :nth-child(2)': {
      marginLeft: '2em',
    },
    '& :first-child': {
      marginLeft: '-7em',
      marginTop: '2vh',
    },
  },
  hartford_logos: {
    gridArea: 'logos-hartford',
    width: '100%',
    height: '100%',
    '& img': {
      height: '13vh',
    },
  },
})
const EncivLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.enciv_logos}>
      <img
        src={
          'https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png'
        }
        alt="Candidate Conversations by ballotpedia and ENCIV logo"
      ></img>
      <img src={'https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png'} alt="enciv logo"></img>
    </div>
  )
}
const HartfordLogo = () => {
  const classes = useStyles()
  return (
    <div className={classes.hartford_logos}>
      <img
        src={
          'https://public-v2links.adobecc.com/10d56feb-0e4d-49df-772d-f0f2dc06d4c3/component?params=component_id%3A100f8488-95b7-4b66-bb86-1fa0242fc044&params=version%3A0&token=1591719228_da39a3ee_1661a618f83196c652d57925c916ceff7f4e6f0a&api_key=CometServer1'
        }
        alt="Hartford Votes. Hartford Vota. Coalition. Logo."
      ></img>
    </div>
  )
}

export { EncivLogo, HartfordLogo }
