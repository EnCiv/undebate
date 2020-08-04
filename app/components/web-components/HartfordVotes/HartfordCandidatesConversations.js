import React, { useContext } from 'react'
import { createUseStyles } from 'react-jss'

import TabbedContainer from '../TabbedContainer'
import { useMode } from './phone-portrait-context'
import { useOffices, useAnimateTab, useTab } from './user-address-context'

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
})

const HartfordCandidatesConversations = ({ viewers }) => {
  const classes = useStyles()
  const { tab } = useTab()
  const { offices, setOffices } = useOffices()
  const { animateTab } = useAnimateTab()
  setOffices(viewers)

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
        //height: 'max-content',
        paddingBottom: '3vh',
        paddingTop: isPortrait ? '30%' : 'calc(30% - 22vmax)',
        margin: isPortrait ? '1em' : '4em',
        width: isPortrait ? 'calc(100% - 2em)' : 'calc(100% - 8em)',
        position: 'relative',
      }}
      className="coming_soon"
    >
      <div>
        <h3
          style={{
            width: '90%',
            textAlign: 'center',
            display: 'inline-block',
            color: '#29316E',
            margin: '0 auto 3vh auto',
            fontSize: isPortrait ? '4vw' : '2.3rem',
            fontWeight: '700',
          }}
        >
          There are no state representative candidates in the primary election for this district.
        </h3>
        <h3
          style={{
            color: '#29316E',
            display: 'inline-block',
            margin: '0 auto 9vh auto',
            textAlign: 'center',
            width: '90%',
            fontSize: isPortrait ? '6.6vw' : '4rem',
            fontWeight: '700',
          }}
        >
          Come Back for the General Election
        </h3>
        <a
          href="https://forms.gle/HgDH7TpewvBeecLe9"
          target="_blank"
          style={{
            boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
            textDecoration: 'none',
            height: '2.3em',
            lineHeight: 0,
            background: '#29316E',
            color: 'white',
            padding: '0.4em',
            paddingLeft: '13vmin',
            paddingRight: '13vmin',
            margin: 0,
            borderRadius: '.5em .5em',
            fontSize: isPortrait ? '4vw' : '3vmin',
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

  const makeContents = urls => {
    const viewers = []
    if (!Array.isArray(urls)) {
      return <div></div>
    } else {
      urls.forEach(url => {
        if (url === '') viewers.push(tabContentsComingSoon)
        else viewers.push(tabContentsExample)
      })
    }
    console.log(viewers)
    return viewers
  }

  //context holds information about districts
  const hartfordTabs = offices.map(office => {
    return { name: `District ${office.district}`, contents: makeContents(office.urls) }
  })

  return (
    <>
      <main className={classes.candidatesConversations}>
        {/* districts in tabs */}
        <TabbedContainer tabs={hartfordTabs} selected_tab={tab} transition={animateTab} />
      </main>
    </>
  )
}

export default HartfordCandidatesConversations
