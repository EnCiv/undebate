import React from 'react'

export const FormInput = props => {
  const { labelName, handleChange, handleBlur, name, type, value, width, placeHolder } = props
  return (
    <label style={{ color: '#18397D', textAlign: 'left', fontWeight: '900', width }}>
      {labelName}
      <input
        name={name}
        style={{
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          border: 'none',
          fontSize: '1.4rem',
          height: '2rem',
          padding: '0.5rem',
        }}
        onChange={e => handleChange(e)}
        onBlur={() => (handleBlur ? handleBlur() : null)}
        type={type}
        required
        value={value}
        placeholder={placeHolder}
      />
    </label>
  )
}

FormInput.defaultProps = {
  type: 'text',
}
