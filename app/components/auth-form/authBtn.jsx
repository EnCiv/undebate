import React from 'react'

export const AuthBtn = ({ classes, handleClick, btnName }) => {
  return (
    <button className={classes} onClick={e => handleClick(e)}>
      {btnName}
    </button>
  )
}
