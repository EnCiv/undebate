'use strict;'
import React from 'react'
import { createUseStyles } from 'react-jss'
import IconPlay from '../svgr/icon-play'

const useStyles = createUseStyles({
  beginButton: {
    color: 'white',
    opacity: props => props.opacity,
    'border-radius': '7px',
    'border-width': '2px',
    'border-color': 'white',
    'font-size': '2rem',
    padding: '2rem',
    'margin-top': '2rem',
    cursor: 'pointer',
    pointerEvents: 'auto',
    '& circle': {
      stroke: props => props.circleColor,
      fill: props => props.circleColor,
    },
    '& path': {
      stroke: props => props.pathColor,
      fill: props => props.pathColor,
    },
  },
})

const BeginButton = ({ children, onClick, ...props }) => {
  const classes = useStyles(props)
  return (
    <span title="Begin">
      <IconPlay width="25%" height="25%" className={classes['beginButton']} onClick={onClick} />
    </span>
  )
}

BeginButton.defaultProps = {
  opacity: '0.8',
  circleColor: '#000',
  pathColor: '#FFF',
}

export default BeginButton
