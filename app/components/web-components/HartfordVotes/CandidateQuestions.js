import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import { useMode } from './phone-portrait-context'
import { HartfordLogo, EncivLogo } from './logos'
import OrangeButton from '../../OrangeButton'

const useStyles = createUseStyles({
  questions: {
    alignSelf: 'center',
    //color: 'white',
    fontWeight: '200',
    fontSize: '1.3em',
    textAlign: 'right',
    margin: '0px',
    gridArea: 'questions',
    width: '100%',
    paddingRight: '1em',
    //lineHeight: '4.3em',
    //'@media only screen and (max-device-width: 600px)': {
    color: '#333333',
    '& div a, & div': {
      height: '3em',
      lineHeight: '1.7em',
      display: 'inline-block',
      width: '100%',
    },
    marginTop: '1em',
    marginBottom: '1em',
    paddingLeft: '1em',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: '600',
    letterSpacing: '0.06em',
    //},
    //'@media only screen and (max-device-width: 415px)': {
    //'& button': {
    //width: '100%',
    //},
    //paddingLeft: '1em',
    //textAlign: 'center',
    //fontSize: '1.2em',
    //fontWeight: '600',
    //letterSpacing: '0.06em',
    //},
  },
})

const CandidateQuestions = () => {
  const classes = useStyles()

  return (
    <h3 className={classes.questions}>
      Have questions for the candidates? →{' '}
      <OrangeButton href="https://forms.gle/HgDH7TpewvBeecLe9" target="_blank">
        Click here to ask Questions
      </OrangeButton>
    </h3>
  )
}

export default CandidateQuestions
