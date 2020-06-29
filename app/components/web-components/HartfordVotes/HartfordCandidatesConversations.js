import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import OrangeButton from '../../OrangeButton'

import TabbedContainer from '../TabbedContainer'
import { useMode } from './phone-portrait-context'

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
    backgroundColor: '#BABABA',
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
})

//{
//name: 'District 1',
//contents: (
//),
//},
const HartfordCandidatesConversations = () => {
  const classes = useStyles()
  let [candidates, setCandidates] = useState([])
  let [error, setError] = useState('')
  let [district, setDistrict] = useState(null)
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
        'https://public-v2links.adobecc.com/10d56feb-0e4d-49df-772d-f0f2dc06d4c3/component?params=component_id%3A4658210e-530e-458d-aff1-1aff2fe84e01&params=version%3A0&token=1593185349_da39a3ee_1f78828f8f60fb9826df5e4c77884176e7e559be&api_key=CometServer1'
      ) center center no-repeat`,
        backgroundSize: '70vmax',
        //maxHeight: '53.5em',
        height: 'max-content',
        paddingBottom: '3vh',
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
            fontSize: '4vmin',
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
            fontSize: '6.6vmin',
            fontWeight: '700',
          }}
        >
          COMING SOON
        </h3>
        <a
          style={{
            boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
            height: '2.3em',
            lineHeight: 0,
            background: '#29316E',
            color: 'white',
            padding: '0.4em',
            paddingLeft: '13vmin',
            paddingRight: '13vmin',
            margin: 0,
            borderRadius: '.5em .5em',
            fontSize: '4vmin',
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
          height: 'max-content',
          bottom: '-1.8em',
          right: isPortrait ? 'calc(50% - 1em)' : 'calc(50% - 2em)',
          padding: '0.25em 0.3em',
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

  // TODO use useEffect in the case where candidates gets set to either some sort of usable set of offices or returns an error from one of the api calls.
  useEffect(() => {
    if (candidates.ok) {
      //confirm that the string matches Conneticut House of Representatives \d
      candidates.officeNames.forEach((office, index) => {
        office.names.match(/^Connecticut House of Representatives District \d/)
        //get the index to get viewers of the same index
      })
      //change the tab you are in

      //prominently display what address_found
    } else {
      //display error and recommend action
    }
  }, [candidates, error])

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
            //TODO validation here use setError if the user inputs a bad string.
            window.socket.emit('hartford address lookup', event.target.votersAddress.value, setCandidates)
          }}
        >
          <input type="text" name="votersAddress" placeholder="1234 Main St. Hartford CT" id="votersAddress" />
          <OrangeButton> Find your district</OrangeButton>
        </form>

        {/* districts in tabs */}
        <TabbedContainer
          tabs={[
            {
              name: 'District 1',
              contents: tabContentsComingSoon,
            },
            {
              name: 'District 3',
              contents: (
                <div>
                  <p>hello universe</p>
                </div>
              ),
            },
            {
              name: 'District 4',
              contents: (
                <div>
                  <p>hello galaxy</p>
                </div>
              ),
            },
            {
              name: 'District 5',
              contents: (
                <div>
                  <p>hello galaxy</p>
                </div>
              ),
            },

            {
              name: 'District 6',
              contents: (
                <div>
                  <p>hello galaxy</p>
                </div>
              ),
            },
            {
              name: 'District 7',
              contents: (
                <div>
                  <p>hello galaxy</p>
                </div>
              ),
            },
            {
              name: 'District 8',
              contents: (
                <div>
                  <p>hello galaxy</p>
                </div>
              ),
            },
          ]}
        />
      </main>
    </>
  )
}

export default HartfordCandidatesConversations
