import React from 'react'
import Icon from '../lib/icon'

export const AgreementTerms = ({ setHasAgreed, hasAgreed, classes }) => {
  return (
    <div className={classes}>
      <Icon
        onClick={() => setHasAgreed(!hasAgreed)}
        className={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
        icon={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
        size="2"
        name="agree"
      />
      <span>
        I agree to the{' '}
        <a href="https://enciv.org/terms/" target="_blank" style={{ color: '#18397D' }}>
          Terms of Service
        </a>{' '}
      </span>
    </div>
  )
}
