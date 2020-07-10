import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultValue = {
  candidates: [[], () => {}],
  error: ['', () => {}],
  district: [null, () => {}],
  tab: [0, () => {}],
}
const AddressContext = createContext(defaultValue)

const AddressProvider = ({ children }) => {
  let [candidates, setCandidates] = useState([])
  let [error, setError] = useState('')
  let [district, setDistrict] = useState(null)
  let [tab, selectTab] = useState(0)
  //useEffect(() => {})

  const store = {
    candidates: [candidates, setCandidates],
    error: [error, setError],
    district: [district, setDistrict],
    tab: [tab, selectTab],
  }

  return <AddressContext.Provider value={store}>{children}</AddressContext.Provider>
}

const useCandidates = () => {
  const {
    candidates: [candidates, setCandidates],
  } = useContext(AddressContext)
  console.log(setCandidates)
  return { candidates, setCandidates }
}

const useError = () => {
  const {
    error: [error, setError],
  } = useContext(AddressContext)
  return { error, setError }
}

const useDistrict = () => {
  const {
    district: [district, setDistrict],
  } = useContext(AddressContext)
  return { district, setDistrict }
}

const useTab = () => {
  const {
    tab: [tab, selectTab],
  } = useContext(AddressContext)
  return { tab, selectTab }
}

export { useCandidates, useError, useDistrict, useTab, AddressProvider, AddressContext }
