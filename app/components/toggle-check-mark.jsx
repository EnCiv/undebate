import React from 'react'
import Icon from './lib/icon'

export const toggleCheckMark = ({ agreed, toggleAgreed, className, size = '2', name = 'agree' }) => {
  return (
    <div className={className}>
      <Icon
        onClick={() => toggleAgreed(!agreed)}
        className={agreed ? 'fa-check-square-o' : 'fa-square-o'}
        icon={agreed ? 'fa-check-square-o' : 'fa-square-o'}
        size={size}
        name={name}
      />
    </div>
  )
}
export default toggleCheckMark
