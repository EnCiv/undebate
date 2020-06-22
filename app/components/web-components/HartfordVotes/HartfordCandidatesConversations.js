import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import OrangeButton from '../../OrangeButton'
//import listOffices from '../../../api/hartford-address-lookup.js'

import TabbedContainer from '../TabbedContainer'

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

const HartfordCandidatesConversations = () => {
  const classes = useStyles()
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
            //listOffices(event.target.votersAddress.value)
            window.socket.emit('hartford address lookup', event.target.votersAddress.value)
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
              contents: (
                <div>
                  <h3>San Francisco District Attorney</h3>
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://cc.enciv.org/san-francisco-district-attorney"
                    title="San Francisco District Attorney"
                  />
                </div>
              ),
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
