import React from 'react'
import injectSheet from 'react-jss'
import { LookupForm } from './lookupForm'

const Preinject = props => {
  return (
    <>
      <LookupForm />
      <button></button>
    </>
  )
}

export const CandidateLookup = Preinject
