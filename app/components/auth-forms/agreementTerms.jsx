import React from 'react'
import Icon from '../lib/icon'

export const AgreementTerms = ({ setHasAgreed, hasAgreed }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#18397D', marginTop: '1rem' }}>
      <Icon
        onClick={() => setHasAgreed(!hasAgreed)}
        className={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
        icon={hasAgreed ? 'fa-check-square-o' : 'fa-square-o'}
        size="2"
        name="agree"
      />
      <span style={{ color: '#18397D' }}>
        I agree to the{' '}
        <a href="https://enciv.org/terms/" target="_blank" style={{ color: '#18397D' }}>
          Terms of Service
        </a>{' '}
      </span>
    </div>
  )
}
