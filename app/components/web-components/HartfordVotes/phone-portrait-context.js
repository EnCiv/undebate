import React, { useState, useEffect, createContext, useContext } from 'react'

const defaultValue = null
const contextExists = 'yes'
const ModeContext = createContext(defaultValue)

const ModeProvider = ({ children }) => {
  let [isPortrait, setMode] = useState(null)

  useEffect(() => {
    const portraitPhone = window.matchMedia('only screen and (max-device-width: 600px)')
    const portraitPhoneListener = () => {
      if (portraitPhone.matches) {
        console.log('eureka')
        setMode(true)
      } else {
        console.log('nuts')
        setMode(false)
      }
    }
    if (isPortrait === null) {
      portraitPhoneListener()
    }
    //listen for changes to changes in mode
    portraitPhone.addListener(portraitPhoneListener)
    return () => portraitPhone.removeListener(portraitPhoneListener)
  }, [isPortrait])

  return <ModeContext.Provider value={isPortrait}>{children}</ModeContext.Provider>
}

const useMode = () => {
  const context = useContext(ModeContext)
  if (contextExists !== 'yes') {
    throw new Error('useMode  must be used within ModeProvider')
  }

  return context
}
export { useMode, ModeProvider }
