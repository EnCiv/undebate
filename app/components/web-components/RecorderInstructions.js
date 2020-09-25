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
    margin: '4em',
    '& p': {
      width: '100%',
      '& img': {
        width: '100%',
      },
    },
  },
})

const RecorderInstructions = ({ defaultRecorderInstructions: { post } }) => {
  const { wrapper } = useStyles()

  const html = converter.makeHtml(post)
  return <div className={wrapper}>{ReactHtmlParser(html)}</div>
}

export default RecorderInstructions
