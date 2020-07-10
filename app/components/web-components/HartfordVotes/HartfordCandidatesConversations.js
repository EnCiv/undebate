import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import OrangeButton from '../../OrangeButton'

import TabbedContainer from '../TabbedContainer'
import { useMode } from './phone-portrait-context'
import { useCandidates, useError, useDistrict, useTab } from './user-address-context'

const useStyles = createUseStyles({
  candidatesConversations: {
    width: '100vw',
    boxSizing: 'border-box',
    textAlign: 'center',

    height: 'min-content',
    '& > *': {
      maxWidth: '1600px',

      '@media (min-width: 1300px)': {
        marginLeft: 'auto !important',
        marginRight: 'auto !important',
      },
    },
  },
  conversationsHeader: {
    marginTop: '2em',
    position: 'relative',
    background: 'none',
    '&:before': {
      position: 'absolute',
      content: '" "',
      backgroundColor: '#29316E',
      zIndex: 1,
      top: '0',
      bottom: '0',
      width: '1.5em',
    },
    // sets a background that has transparency
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
      background:
        'url(https://res.cloudinary.com/hf6mryjpf/image/upload/w_1700/q_auto:best/v1591726876/assets/HVC_Banner-1.jpg) center center no-repeat',
    },
    padding: 0,
    display: 'flex',
    '& > *': {
      color: '#29316E',
      // required to make text show above transparent background
      position: 'relative',
      zIndex: 1,

      '@media only screen and (max-device-width: 600px)': {
        textAlign: 'left',
        paddingLeft: '6.5vw',
        marginLeft: '0 !important',
        marginTop: '1em !important',
      },
    },
    '& h3': {
      margin: 'auto 0 auto 1.5em',
      fontSize: '2.5em',
    },
    boxSizing: 'border-box',
    margin: '0px',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    '@media only screen and (max-device-width: 600px)': {
      flexDirection: 'column',
    },
  },
  electionDates: {
    fontSize: '1.2em',
    fontWeight: '200',
    margin: 'auto 1rem auto auto',
    '@media only screen and (max-device-width: 600px)': {
      margin: 0,
    },
  },
  findDistrict: {
    backgroundColor: '#EBEAEA',
    width: '100%',
    padding: '1.5em',
    margin: '2em 0',
    '& > *': {
      boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
    },
    '& > #votersAddress': {
      '&::placeholder': {
        color: '#515989',
      },
      paddingLeft: '.5em',
      height: '2.3em',
      border: 'none',
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
    padding: '.6em 0 1em 6vw',
    textAlign: 'left',
    width: '90vw',

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

const HartfordCandidatesConversations = () => {
  const classes = useStyles()
  const { candidates, setCandidates } = useCandidates()
  const { error, setError } = useError()
  const { district, setDistrict } = useDistrict()
  const { tab, selectTab } = useTab()

  let [animateTab, makeTabAnimate] = useState(false)
  let [notification, setNotification] = useState(
    'Enter full address to see candidates running in your assembly district'
  )

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
  const representatives_office_ids = [
    {
      id: 7976,
      district: 1,
    },
    {
      id: 318,
      district: 3,
    },
    {
      id: 8254,
      district: 4,
    },
    {
      id: 9803,
      district: 5,
    },
    {
      id: 21641,
      district: 6,
    },
    {
      id: 6527,
      district: 7,
    },
  ]
  // make a list of those offices and sort them into districts

  console.log(candidates)
  const tabContentsComingSoon = (
    <div
      style={{
        border: '1em solid #6D6889',
        background: `url(
        'https://res.cloudinary.com/hf6mryjpf/image/upload/v1593540680/assets/connecticut_flag.png'
      ) center center no-repeat`,
        backgroundSize: '70vmax',
        maxHeight: '53.5em',
        height: 'max-content',
        paddingBottom: '3vh',
        paddingTop: isPortrait ? '30%' : 'calc(30% - 21vmax)',
        margin: isPortrait ? '1em' : '4em',
        width: isPortrait ? 'calc(100% - 2em)' : 'calc(100% - 8em)',
        position: 'relative',
      }}
      className="coming_soon"
    >
      <div
        style={{
          margin: '7vh auto',
        }}
      >
        <h3
          style={{
            color: '#29316E',
            margin: '0 auto 3vh auto',
            width: 'max-content',
            width: 'max-content',
            fontSize: isPortrait ? '4vw' : '4vmin',
            fontWeight: '700',
          }}
        >
          Candidate Conversations
        </h3>
        <h3
          style={{
            color: '#29316E',
            margin: '0 auto 9vh auto',
            width: 'max-content',
            fontSize: isPortrait ? '6.6vw' : '6.6vmin',
            fontWeight: '700',
          }}
        >
          COMING SOON
        </h3>
        <a
          href="https://forms.gle/HgDH7TpewvBeecLe9"
          target="_blank"
          style={{
            boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
            textDecoration: 'none',
            height: '2.3e',
            lineHeight: 0,
            background: '#29316E',
            color: 'white',
            padding: '0.4em',
            paddingLeft: '13vmin',
            paddingRight: '13vmin',
            margin: 0,
            borderRadius: '.5em .5em',
            fontSize: isPortrait ? '4vw' : '4vmin',
          }}
        >
          Get Notified
        </a>
      </div>
      <h3
        style={{
          fontSize: '2.5em',
          fontWeight: 700,
          position: 'absolute',
          backgroundColor: 'white',
          color: '#6D6889',
          bottom: '-1.15em',
          right: isPortrait ? 'calc(40% - 1em)' : 'calc(50% - 1em)',
          left: isPortrait ? 'calc(40% - 1em)' : '',
          padding: '0.25em 0.3em',
          height: '.4em',
          minWidth: isPortrait ? '' : '4em',
          lineHeight: '0.4',
          padding: '-0.55em 0.6em',
          textAlign: 'center',
        }}
      >
        2020
      </h3>
    </div>
  )

  const hartfordTabs = representatives_office_ids.map(office => {
    return { name: `District ${office.district}`, contents: tabContentsComingSoon }
  })

  const tabContentsExample = (
    <div>
      <h3>San Francisco District Attorney</h3>
      <iframe
        width="100%"
        height="100%"
        src="https://cc.enciv.org/san-francisco-district-attorney"
        title="San Francisco District Attorney"
      />
    </div>
  )

  // TODO use useEffect in the case where candidates gets set to either some sort of usable set of offices or returns an error from one of the api calls.
  useEffect(() => {
    if (candidates.ok) {
      //confirm that the string matches Conneticut House of Representatives \d
      const office = candidates.officeNames[0]
      //office.name.match(/^Connecticut House of Representatives District \d/)
      //get the index to get viewers of the same index
      let tab_index = representatives_office_ids.findIndex(element => element.district === office.district_number)
      //change the tab you are in
      selectTab(tab_index)
      makeTabAnimate(true)
      setTimeout(() => makeTabAnimate(false), 4000)
      //prominently display what address_found
      setNotification(
        <>
          {candidates.address_found} matched with your entry.
          <br />
          <strong>YOU ARE IN DISTRICT {candidates.officeNames[0].district_number}.</strong>
          <br />
          We have changed the tab below.
        </>
      )
    } else if (!Array.isArray(candidates)) {
      console.log('candidates=', candidates)
      //display error and recommend action
      setNotification(
        <div style={{ color: '#9d0000' }}>
          Sorry, we cannot find your address, Please enter a valid Hartford address. You must enter city, state and zip
          code.
        </div>
      )
      setError('something happened on the server')
    }
  }, [candidates])

  return (
    <>
      <main className={classes.candidatesConversations}>
        <div className={classes.conversationsHeader}>
          <h3> Candidates Conversations </h3>
          <div className={classes.electionDates}>
            <h4>Primary Election: 08/11/2020</h4>
            <h4>General Election: 11/03/2020</h4>
          </div>
        </div>

        {/* search for district */}
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
              const has_valid_zip = !!valid_zip_codes.find(
                element => element === state_and_zip[0].match(/\b\d{5}\b/gi)[0]
              )
              console.log('validation: ', `${has_valid_zip ? 'has' : "doesn't have"} a valid zip`)
              window.socket.emit('hartford address lookup', event.target.votersAddress.value, setCandidates)
            } else {
              setNotification(
                <div style={{ color: '#9d0000' }}>
                  Sorry, we cannot find your address, Please enter a valid Hartford address. You must enter city, state
                  and zip code.
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
            placeholder="1234 Main St. Hartford CT"
            id="votersAddress"
          />
          <OrangeButton> Find your district</OrangeButton>
          <div className={classes.notificationBox}>{notification}</div>
        </form>

        {/* districts in tabs */}
        <TabbedContainer tabs={hartfordTabs} selected_tab={tab} transition={animateTab} />
      </main>
    </>
  )
}

export default HartfordCandidatesConversations
