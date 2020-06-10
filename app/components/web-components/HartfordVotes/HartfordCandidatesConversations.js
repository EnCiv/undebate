import React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import OrangeButton from '../../OrangeButton'

import TabbedContainer from '../TabbedContainer'

const useStyles = createUseStyles({
  candidatesConversations: {
    width: '100vw',
    padding: '1em',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: 'lightgray',

    height: 'min-content',
    '& > *': {
      maxWidth: '1300px',

      '@media (min-width: 1300px)': { margin: '0px auto !important' },
    },
  },
  conversationsHeader: {
    padding: 0,
    display: 'flex',
    border: '2px solid blue',
    '& > *': {
      border: '2px solid blue',
      '@media only screen and (max-device-width: 600px)': { textAlign: 'left', paddingLeft: '4vw' },
    },
    '& h3': {
      margin: 'auto 0',
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
    border: '2px solid blue',
    width: '100%',
    padding: '1em',
    margin: '2em 0',
    '& > *': {
      boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
    },
    '& > #votersAddress': {
      height: '2.3em',
      border: 'none',
      marginRight: '1em',
      width: '60vw',
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
