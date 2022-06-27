import React, { useState, useEffect } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import ReactHtmlParser from 'react-html-parser'
import sd from 'showdown'
const converter = new sd.Converter()
//import Icon from '../lib/icon'

const useStyles = createUseStyles({
  wrapper: {
    fontFamily: 'Libre Franklin',
    fontSize: '1.3em',
    margin: '4em auto',
    maxWidth: '1200px',
    width: '88vw',

    '& h1': {
      fontSize: '2em',
      textAlign: 'center',
      marginBottom: '1em',
    },

    '& li': { marginTop: '0.6em' },

    '& p': {
      width: '100%',

      '& img': {
        width: '100%',
      },
    },

    '@media (min-width: 800px)': { fontSize: '2em' },
  },
})

const RecorderInstructions = ({ defaultRecorderInstructions: { post } }) => {
  const { wrapper } = useStyles()

  const html = converter.makeHtml(post)
  return <div className={wrapper}>{ReactHtmlParser(html)}</div>
}

export default RecorderInstructions
