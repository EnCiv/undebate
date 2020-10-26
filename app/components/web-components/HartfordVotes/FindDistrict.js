import React from 'react'
import { createUseStyles } from 'react-jss'
import OrangeButton from '../../OrangeButton'

import { useMode } from './phone-portrait-context'
import { useNotification, useCandidates, useError } from './user-address-context'

const useStyles = createUseStyles({
  findDistrict: {
    backgroundColor: 'white',
    width: '100%',
    padding: '1.5em',
    margin: '0 0 1em',
    '& > *': {
      boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
    },
    '& > #votersAddress': {
      '&::placeholder': {
        color: '#515989',
      },
      paddingLeft: '.5em',
      height: '2.3em',
      border: '1px solid #c7c7c7',
      marginRight: '1em',
      width: '60%',
      maxWidth: '850px',

      '@media only screen and (max-device-width: 600px)': {
        width: '100%',
        marginBottom: '0.3em',
      },
    },

    '& > button': {
      maxWidth: '390px',
      width: '30vw',
      '@media only screen and (max-device-width: 600px)': {
        width: '100%',
      },
    },
    '@media only screen and (max-device-width: 600px)': {
      marginTop: 0,
    },
  },
  notificationBox: {
    boxShadow: 'none !important',
    padding: '.5em',
    margin: '0 auto',
    textAlign: 'left',
    width: '90vw',
    maxWidth: '1240px',

    '@media only screen and (max-device-width: 600px)': {
      padding: '.6em 2vw',
    },
  },
  '@keyframes progress': {
    to: { color: '#515989' },
    from: { color: '#E0E2E8' },
  },
  '@keyframes progress2': {
    from: { marginLeft: '-20%' },
    to: { marginLeft: '100%' },
  },
  workingBackground: {
    // loading bar animation
    content: '" "',
    position: 'absolute',
    top: 0,
    zIndex: '2',
    color: '#E0E2E8',
    backgroundColor: '#515989',
    backgroundImage:
      ' linear-gradient(to right, rgba(224, 226, 232, .99) 25%, rgba(224, 226, 232,.1) 50%, rgba(224, 226, 232,.99) 75%)',
    height: '100%',
    width: '20%',
    animationName: '$progress2',
    animationDuration: '0.7s',
    animationTimingFunction: 'ease-out',
    animationDirection: 'alternate',
    animationIterationCount: 'infinite',
  },
  working: {
    maxWidth: '600px',
    position: 'relative',
    overflow: 'hidden',
    animationName: '$progress',
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-out',
    animationDirection: 'alternate',
    animationIterationCount: 'infinite',
  },
})

const FindDistrict = () => {
  const classes = useStyles()

  const { candidates, setCandidates } = useCandidates()
  const { error, setError } = useError()
  const { notification, setNotification } = useNotification()
  let isPortrait = useMode()

  // TODO need to get viewers by office to populate the tabs
  // first list the offices in the area by office id
  const valid_zip_codes = [
    '06101',
    '06105',
    '06114',
    '06126',
    '06141',
    '06145',
    '06151',
    '06156',
    '06176',
    '06102',
    '06106',
    '06115',
    '06132',
    '06142',
    '06146',
    '06152',
    '06160',
    '06180',
    '06103',
    '06108',
    '06120',
    '06134',
    '06143',
    '06147',
    '06154',
    '06161',
    '06183',
    '06104',
    '06112',
    '06123',
    '06140',
    '06144',
    '06150',
    '06155',
    '06167',
  ]

  console.log(candidates)
  return (
    <form
      className={classes.findDistrict}
      onSubmit={event => {
        event.preventDefault()
        setError(false)
        //TODO validation here use setError if the user inputs a bad string.
        setNotification(
          <div className={classes.working}>
            Working to find your candidates. . .<div className={classes.workingBackground}></div>
          </div>
        )
        const votersAddress = event.target.votersAddress.value

        console.log('validation: ', votersAddress.match(/hartford/gi))
        console.log('validation: ', votersAddress.match(/ct/gi))

        console.log('validation: ', votersAddress.match(/\bct\s+\d{5}(-\d{4})?/gi))
        const state_and_zip = votersAddress.match(/\bct\s+\d{5}(-\d{4})?/gi)
        if (state_and_zip) {
          const has_valid_zip = !!valid_zip_codes.find(element => element === state_and_zip[0].match(/\b\d{5}\b/gi)[0])
          console.log('validation: ', `${has_valid_zip ? 'has' : "doesn't have"} a valid zip`)
          window.socket.emit('hartford address lookup', event.target.votersAddress.value, setCandidates)
        } else {
          setNotification(
            <div style={{ color: '#9d0000' }}>
              Sorry, we cannot find your address, Please enter a valid Hartford address. You must enter city, state and
              zip code.
            </div>
          )
          setError('invalid address')
        }
      }}
    >
      <input
        style={{ border: error ? '3px solid #9d0000' : '' }}
        type="text"
        name="votersAddress"
        placeholder="1234 Main St. Hartford CT 06103"
        id="votersAddress"
      />
      {isPortrait ? null : <OrangeButton>Find your District</OrangeButton>}
      <div className={classes.notificationBox}>{notification}</div>
      {isPortrait ? <OrangeButton>Find your District</OrangeButton> : null}
    </form>
  )
}
export default FindDistrict
