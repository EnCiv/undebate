import React from 'react'

export const Tab = ({ classes, handleClick, tabText }) => {
  return (
    <div className={classes} onClick={() => handleClick()}>
      {tabText}
    </div>
  )
}
