'use strict;'
import React from 'react'
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
  button: {
    width: '12vw',
    '& button': {
      height: '5.5rem',
      color: 'white',
      background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
      'border-radius': '7px',
      'border-width': '2px',
      'border-color': 'white',
      'font-size': '1.25rem',
      padding: '1rem',
      height: '100%',
      whiteSpace: 'no-wrap',
      cursor: 'pointer',
    },
    '& button:hover': {
      background: 'red',
    },
  },
  callToAction: {
    fontSize: '1rem',
    display: 'inline-block',
    maxWidth: '32em',
    verticalAlign: 'middle',
    fontWeight: 'normal',
    marginTop: '.5rem',
    textAlign: 'justify',
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
})

function DonateButton({
  url = 'https://ballotpedia.org/Donate:_Candidate_Conversations',
  name = 'Donate',
  callToAction = 'Contribute today to help us continue producing Candidate Conversations.',
}) {
  const classes = useStyles()
  return (
    <div>
      <span className={classes.button}>
        <button
          onClick={() => {
            logger.info('DonateButton.onClick from', window.location.pathname, url, name, callToAction)
            let win = window.open(url, '_blank')
            win.focus()
          }}
        >
          {name}
        </button>
      </span>
      <span>
        <div className={classes.callToAction}>{callToAction}</div>
      </span>
    </div>
  )
}

export default DonateButton
