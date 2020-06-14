import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import OrangeButton from '../../OrangeButton'

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
    position: 'relative',
    background: 'none',
    '&:before': {
      position: 'absolute',
      content: '" "',
      backgroundColor: '#29316E',
      zIndex: 2,
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
      zIndex: '1',
      opacity: '0.14',
      background:
        'url(https://res.cloudinary.com/hf6mryjpf/image/upload/w_1200/q_auto:best/v1591726876/assets/HVC_Banner-1.jpg) center center no-repeat',
    },
    padding: 0,
    display: 'flex',
    '& > *': {
      color: '#29316E',
      // required to make text show above transparent background
      position: 'relative',
      zIndex: 2,

      '@media only screen and (max-device-width: 600px)': {
        textAlign: 'left',
        paddingLeft: '4vw',
        marginLeft: '0 !important',
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
        <form className={classes.findDistrict}>
          <input type="text" name="votersAddress" id="votersAddress" />
          <OrangeButton> Find your district</OrangeButton>
        </form>

        {/* districts in tabs */}
        <TabbedContainer
          tabs={[
            {
              name: 'first',
              contents: (
                <div>
                  <p>hello world</p>
                </div>
              ),
            },
            {
              name: 'second',
              contents: (
                <div>
                  <p>hello universe</p>
                </div>
              ),
            },
            {
              name: 'third',
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
