
import {useState} React from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { ModeProvider } from './phone-portrait-context'
import Icon from './app/components/lib/icon'

const useStyles = createUseStyles({
  hartfordfaq: {
    fontFamily: 'Libre Franklin',
    '& button': {
      fontFamily: 'Libre Franklin, SemiBold',
    },
    '& h1, & h2, & h3, & h4': {
      fontFamily: 'Libre Franklin, Bold',
    },
    fontSize: '10px',
    wordSpacing: '0.3em',
    letterSpacing: '0.01em',
    boxSizing: 'border-box',
    '@media (min-width: 1000px) and (min-height: 1000px)': { fontSize: '16px' },

    '& *': {
      boxSizing: 'border-box',
    },
    width: '100vw',
    textAlign: 'center',
  },
})


const AccordionButton = ({isOpen}) =>{

  const classes = useStyles()
  return (
  <button className={classes.AccordionButton}>{ isOpen?
    <Icon icon={"fa-chevron-up"}/> 
    :<Icon icon={"fa-chevron-down"}/>
  }</button>)
}

const Question = ({ questionAndAnswer: {question:question, answer:answer} }) =>{
let [isExpanded, toggleQuestion] = useState(false)

  return ( <div className={classes.question}>
    {toggleQuestion()}
    {question}
    {isExpanded? <Answer answer={answer}/> : null}
    <AccordionButton isOpen={isExpanded }/>
    </div> )
}

const Answer = ({answer}) =>{

  const classes = useStyles()
  return ( <div className={ classes.answer }>{answer}</div> )
}

const FAQ = () => {
  const classes = useStyles()

  return (
    <faq-dom key="hartfordFAQ">
      <ModeProvider>
      </ModeProvider>
    </faq-dom>
  )
}

export default FAQ
