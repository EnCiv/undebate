import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultValue = {
  candidates: [[], () => {}],
  error: ['', () => {}],
  district: [null, () => {}],
  tab: [3, () => {}],
  animateTab: [false, () => {}],
  notification: ['Enter your address to meet the candidates in your district.', () => {}],
  offices: [
    { id: 0, district: 0, urls: [''] },
    { id: 1, district: 1, urls: [''] },
  ],
}
const AddressContext = createContext(defaultValue)

const AddressProvider = ({ children, value }) => {
  let [candidates, setCandidates] = useState([])
  let [error, setError] = useState('')
  let [district, setDistrict] = useState(null)
  let [tab, selectTab] = useState(value ? value.tab : 0)
  let [animateTab, makeTabAnimate] = useState(false)
  let [notification, setNotification] = useState('Enter your address to meet the candidates in your district.')
  let [offices, setOffices] = useState([
    { id: 0, district: 0, urls: [''] },
    { id: 1, district: 1, urls: [''] },
  ])

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

  // TODO use useEffect in the case where candidates gets set to either some sort of usable set of offices or returns an error from one of the api calls.
  useEffect(() => {
    if (candidates.ok) {
      //confirm that the string matches Conneticut House of Representatives \d
      const office = candidates.officeNames[0]
      //office.name.match(/^Connecticut House of Representatives District \d/)
      //get the index to get viewers of the same index
      let tab_index = offices.findIndex(element => element.district === office.district_number)
      //change the tab you are in
      selectTab(tab_index)
      makeTabAnimate(true)
      setTimeout(() => makeTabAnimate(false), 4000)
      //prominently display what address_found
      setNotification(
        <>
          {candidates.address_found} matched with your entry.
          <br />
          <strong>YOU ARE IN DISTRICT {candidates.officeNames[0].district_number}.</strong>
          <br />
          We have changed the tab below.
        </>
      )
    } else if (!Array.isArray(candidates)) {
      console.log('candidates=', candidates)
      //display error and recommend action
      setNotification(
        <div style={{ color: '#9d0000' }}>
          Sorry, we cannot find your address, Please enter a valid Hartford address. You must enter city, state and zip
          code.
        </div>
      )
      setError('something happened on the server')
    }
  }, [candidates])

  const store = {
    candidates: [candidates, setCandidates],
    error: [error, setError],
    district: [district, setDistrict],
    tab: [tab, selectTab],
    notification: [notification, setNotification],
    animateTab: [animateTab, makeTabAnimate],
    offices: [offices, setOffices],
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

const useTab = defaultTab => {
  const {
    tab: [tab, selectTab],
  } = useContext(AddressContext)
  if (defaultTab) selectTab(defaultTab)
  return { tab, selectTab }
}

const useNotification = () => {
  const {
    notification: [notification, setNotification],
  } = useContext(AddressContext)
  return { notification, setNotification }
}

const useAnimateTab = () => {
  const {
    animateTab: [animateTab, makeTabAnimate],
  } = useContext(AddressContext)
  return { animateTab, makeTabAnimate }
}

const useOffices = () => {
  const {
    offices: [offices, setOffices],
  } = useContext(AddressContext)
  return { offices, setOffices }
}

export {
  useCandidates,
  useError,
  useDistrict,
  useTab,
  useNotification,
  useAnimateTab,
  useOffices,
  AddressProvider,
  AddressContext,
}
