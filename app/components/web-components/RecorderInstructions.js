import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
//import Icon from '../../lib/icon'

const useStyles = createUseStyles({
  wrapper: {
    margin: '4em',
  },
})

const RecorderInstructions = () => {
  const { wrapper } = useStyles()

  return <div className={wrapper}>Recorder Instructions</div>
}

export default RecorderInstructions
