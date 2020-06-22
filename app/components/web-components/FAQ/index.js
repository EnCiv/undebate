import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { ModeProvider } from '../HartfordVotes/phone-portrait-context'
import Icon from '../../lib/icon'
import HartfordLandingMenu from '../HartfordVotes/HartfordLandingMenu'

const useStyles = createUseStyles({
  hartfordfaq: {
    color: '#333333',
    fontWeight: 700,
    fontFamily: 'Libre Franklin',
    fontSize: '16px',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    width: '100vw',
    textAlign: 'center',
    gridTemplateRows: '1fr min-content',
    textAlign: 'left',
    minHeight: '100vh',
    '& button, & a': {
      fontFamily: 'Libre Franklin, SemiBold',
      fontWeight: 500,
    },
    '& h1, & h2, & h3, & h4': {
      fontFamily: 'Libre Franklin, Bold',
    },
    '@media (min-width: 1000px) and (min-height: 1000px)': { fontSize: '20px' },

    '& *': {
      boxSizing: 'border-box',
    },
  },
  AccordionButton: {
    border: 'none',
    backgroundColor: 'white',
    color: '#8083A8',
    gridArea: 'acc',
    textAlign: 'right',
  },
  answer: {
    fontWeight: 500,
    marginBottom: '1.3em',
    paddingTop: '1em',
  },
  question: {
    borderBottom: '1px solid #707070',
    width: '70%',
    maxWidth: '1400px',
    paddingBottom: '1em',
    margin: '1.3em auto',

    '&__qbar': {
      display: 'grid',
      gridTemplateRows: '1fr',
      gridTemplateColumns: '20fr 3fr',
      gridTemplateAreas: `
      "q acc"`,
    },
    '&__q': {
      backgroundColor: 'white',
      gridArea: 'q',
    },
  },
})

const useHeaderStyles = createUseStyles({
  faqheader: background => ({
    position: 'relative',
    marginBottom: '7em',
    height: '10em',
    padding: '1.6em',
    '& h1': {
      marginLeft: 'auto',
      marginRight: 'auto',
      margin: '1em auto 3em auto',
      width: 'max-content',
      maxWidth: '70vw',
      minWidth: 'min-content',
    },
    '& *': {
      color: '#29316E',
      position: 'relative',
      zIndex: 1,
    },
    '&:after': {
      content: '" "',
      position: 'absolute',
      right: '0',
      left: '0',
      bottom: '0',
      display: 'block',
      top: '0',
      zIndex: -1,
      opacity: '0.14',
      background: background,
    },
  }),
})

const AccordionButton = ({ isOpen, toggleAccordion }) => {
  const classes = useStyles()
  return (
    <button className={classes.AccordionButton} onClick={() => toggleAccordion()}>
      {isOpen ? <Icon icon={'chevron-up'} /> : <Icon icon={'chevron-down'} />}
    </button>
  )
}

const Question = ({ questionAndAnswer }) => {
  const { question, answer } = questionAndAnswer
  let [isExpanded, toggleAnswer] = useState(false)
  const classes = useStyles()
  return (
    <div className={classes.question}>
      <div className={classes.question + '__qbar'}>
        <div className={classes.question + '__q'}>{question}</div>
        <AccordionButton isOpen={isExpanded} toggleAccordion={() => toggleAnswer(!isExpanded)} />
      </div>
      {isExpanded ? <Answer answer={answer} /> : null}
    </div>
  )
}

const Answer = ({ answer }) => {
  const classes = useStyles()
  return <div className={classes.answer}>{answer}</div>
}

const FAQHeader = ({ homelink, background }) => {
  const classes = useHeaderStyles(background)
  console.log(useStyles)
  return (
    <div className={classes.faqheader} style={{}}>
      <div>
        <a href={homelink}>HOME</a>
        {'>'}FAQ
      </div>
      <h1>Frequently Asked Questions (FAQ)</h1>
    </div>
  )
}
FAQHeader.defaultProps = {
  background: 'red',
}

const FAQ = ({ questions_and_answers, banner, homelink }) => {
  const classes = useStyles()

  return (
    <faq-dom key="hartfordFAQ">
      <ModeProvider>
        <div className={classes.hartfordfaq}>
          <HartfordLandingMenu />
          <FAQHeader background={banner} homelink={homelink} />
          <div>
            {questions_and_answers.map((faq, index) => (
              <Question key={index} questionAndAnswer={{ question: faq.q, answer: faq.a }} />
            ))}
          </div>
        </div>
      </ModeProvider>
    </faq-dom>
  )
}

export default FAQ
