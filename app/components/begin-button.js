'use strict;'
import React from 'react'
import { createUseStyles } from 'react-jss'
import IconPlay from '../svgr/icon-play'

const useStyles = createUseStyles({
  outer: {
    width: '100%',
    height: '100%',
    '&:disabled': {
      backgroundColor: 'gray',
    },
    opacity: props => props.opacity,
    '& :hover': {
      opacity: props => props.opacity * 0.8,
    },
  },
  icon: {
    color: 'white',
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

const BeginButton = ({ children, width, height, onClick, disabled, ...props }) => {
  const classes = useStyles(props)
  return (
    <button className={classes.outer} onClick={onClick} disabled={disabled} title="Begin">
      <IconPlay width={width} height={height} className={classes.icon} data-testid="begin-button" />
    </button>
  )
}

BeginButton.defaultProps = {
  opacity: '0.8',
  circleColor: '#000',
  pathColor: '#FFF',
  width: '20%',
  height: '20%',
}

export default BeginButton
