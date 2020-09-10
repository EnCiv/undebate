import React, { useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import FindDistrict from '../HartfordVotes/FindDistrict'
import { AddressProvider, useCandidates } from '../HartfordVotes/user-address-context'

const useStyles = createUseStyles({
  landingPage: {
    fontFamily: 'Libre Franklin',
    '& button, & a': {
      fontFamily: 'Libre Franklin, SemiBold',
      fontWeight: 300,
    },
    '& h1, & h2, & h3, & h4': {
      fontFamily: 'Libre Franklin, Bold',
    },
    fontSize: '10px',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    '@media (min-width: 1250px) and (min-height: 1000px)': { fontSize: '16px' },

    '& *': {
      boxSizing: 'border-box',
    },
    width: '100vw',
    textAlign: 'center',
  },
})

const HartfordViewers = ({}) => {
  return (
    <>
      <AddressProvider>
        <DisplayViewers />
      </AddressProvider>
    </>
  )
}

const DisplayViewers = ({}) => {
  const { candidates } = useCandidates()

  //useEffect(() => {}, [candidates])
  //<iframe src={candidates.viewers[0][0]}/>
  //<div>{candidates.viewers[0][0]}</div>
  return <div>{candidates.viewers ? <iframe src={candidates.viewers[0][0]} /> : <FindDistrict />}</div>
}

export default HartfordViewers
