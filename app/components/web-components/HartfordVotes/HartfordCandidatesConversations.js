import React, { useContext } from 'react'
import { createUseStyles } from 'react-jss'

import TabbedContainer from '../TabbedContainer'
import { useMode } from './phone-portrait-context'
import { useAnimateTab, useCandidates, useTab, AddressContext } from './user-address-context'

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
    marginBottom: '1em',
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
})

const HartfordCandidatesConversations = () => {
  const classes = useStyles()
  const { candidates } = useCandidates()
  const { tab } = useTab()
  const { representatives_office_ids } = useContext(AddressContext)
  const { animateTab } = useAnimateTab()
  console.log(candidates)

  let isPortrait = useMode()

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

        {/* districts in tabs */}
        <TabbedContainer tabs={hartfordTabs} selected_tab={tab} transition={animateTab} />
      </main>
    </>
  )
}

export default HartfordCandidatesConversations
