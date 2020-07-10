
import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultValue = {
  candidates:[[],]
  error:
  district:
  tab:
}
const AddressContext = createContext(defaultValue)

const AddressProvider = ({children})=>{
  let [candidates, setCandidates] = useState([])
  let [error, setError] = useState('')
  let [district, setDistrict] = useState(null)
  let [tab, selectTab] = useState(0)
  useEffect(()=>{

  })
  const store ={
    candidates:[candidates, setCandidates],
    error:[error, setError],
    district:[district, setDistrict],
    tab:[tab, selectTab],
  }
  return<>
}

useAddress(()=>{

})

export { useMode, AddressProvider}
