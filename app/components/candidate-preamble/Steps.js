'use strict'
import React, { useState } from 'react'
import { createUseStyles } from 'react-jss'
import Button from '../button'
import cx from 'classnames'

const useStyles = createUseStyles({
  container: {
    textAlign: 'center',
    //steps area title
    '&>h3': {
      fontSize: '3rem',
      fontWeight: 600,
    },
  },
  Steps: {
    display: 'flex',
    gap: '3em',
    //flexDirection: 'column',
    listStyleType: 'none',
    flexWrap: 'wrap',
    paddingLeft: 0,
  },
  step: {
    flexGrow: 1,
    flexBasis: 'calc( calc(400px - 100%) * 999 )',
    position: 'relative',
    border: '1px solid gray',
    padding: '2em',

    '& p': {
      fontSize: '1.33em',
      color: '#646464',
      fontWeight: 400,
    },
    '&>div>*': {
      margin: 0, //reset the margin on all the children first
    },
    '& h4': {
      marginBottom: '2rem',
    },
    '& .__title': {
      fontSize: '1.666em',
      fontWeight: '700',
      //TODO: change the font Style for this so that it is bold.
    },
    '& .__icon': {
      height: '3.455em',
      marginBottom: '3.5em',
    },
  },
  stepLable: {
    color: 'white',
    backgroundColor: 'grey',
    padding: '0.4em',
    position: 'absolute',
    left: 0,
    top: 0,
  },
})

const makeStep = (index, title, icon, content, class_name) => {
  const classes = useStyles()

  return (
    <li className={class_name} key={'step' + index}>
      <div className={classes.stepLable}>Step {1 + index}</div>
      <div>
        {' '}
        <h4 className={'__icon'}>{icon}</h4>
        <h4 className={'__title'}>{title}</h4>
        <p>{content}</p>
      </div>
    </li>
  )
}

function Steps({}) {
  const classes = useStyles()
  const steps = [
    {
      title: 'Record',
      icon: <img src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1596687809/assets/record.svg" />,
      content: `When you start recording, an onscreen moderator will ask a series of questions, and you'll be prompted to record your answers.`,
    },
    {
      title: 'Review It',
      icon: <img src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1596687838/assets/review.svg" />,
      content: `Re-record any question as many times as you want; nothing is pulbished until you're ready.`,
    },
    {
      title: 'Post Your Video',
      icon: <img src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1596687849/assets/upload.svg" />,
      content: `Make a final review of the whole Conversation if you like, then hit "Post" and your video is automatically published on your Ballotpedia page.`,
    },
  ]

  return (
    <section className={classes.container}>
      <h3>Recording is Easy</h3>
      <ul className={classes.Steps}>
        {steps.map((step, index) => makeStep(index, step.title, step.icon, step.content, classes.step))}
      </ul>
    </section>
  )
}
export default Steps
