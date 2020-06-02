import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
import TabbedContainer from '../TabbedContainer'

const styles = {
  candidatesConversations: {
    width: '100vw',
    padding: '1em',
    boxSizing: 'border-box',
    textAlign: 'center',
    backgroundColor: 'lightgray',
    height: 'min-content',
    '& h3': {
      margin: '1em',
      fontSize: '3.5em',
    },
  },
  conversationsHeader: {
    display: 'flex',
    boxSizing: 'border-box',
    margin: '0px',
    width: '90vw',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  electionDates: {
    width: 'max-content',
  },
  findDistrict: {
    marginBottom: '1em',
  },
}

let HartfordCandidatesConversations = ({ classes }) => {
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
        <form className={classes.findDistrict}>
          <input type="text" name="votersAddress" id="votersAddress" />
          <button> Find your district</button>
        </form>
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
          ]}
        />
      </main>
    </>
  )
}
HartfordCandidatesConversations = injectSheet(styles)(HartfordCandidatesConversations)
export default HartfordCandidatesConversations
