import React from 'react'
import { createUseStyles } from 'react-jss'
import FindDistrict from '../HartfordVotes/FindDistrict'
import { AddressProvider } from '../HartfordVotes/user-address-context'

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
        <FindDistrict />
      </AddressProvider>
    </>
  )
}

export default HartfordViewers
