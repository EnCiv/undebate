import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useMode } from './phone-portrait-context'
import { HartfordLogo, EncivLogo } from './logos'
import OrangeButton from '../../OrangeButton'

const useStyles = createUseStyles({
  container: {
    '& div a, & div': {
      height: '3em',
      lineHeight: '1.7em',
      display: 'inline-block',
      width: '100%',
    },
    marginTop: '1em',
    marginBottom: '1em',
    paddingLeft: '1em',
    fontSize: '2em',
  },
  questions: {
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: '0.06em',
    alignSelf: 'center',
    fontWeight: '200',
    fontSize: '3rem',
    margin: '0px',
    width: '100%',
    paddingRight: '1em',
    color: '#333333',
  },
})

const CandidateQuestions = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <h3 className={classes.questions}>Have questions for the candidates?</h3>
      <OrangeButton href="https://forms.gle/HgDH7TpewvBeecLe9" target="_blank">
        Click here to ask Questions
      </OrangeButton>
    </div>
  )
}

export default CandidateQuestions
