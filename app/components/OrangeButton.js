import React from 'react'

export default function OrangeButton({ children, href, target, onClick }) {
  return (
    <>
      {href ? (
        <div style={{ display: 'inline-block' }}>
          <a
            style={{
              boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
              minHeight: '2.3em',
              border: '3px solid white',
              background: 'rgb(223,174,128)',
              color: 'white',
              textDecoration: 'none',
              background: 'linear-gradient(to bottom, #F0A236 0%, #DD7915 100%)',
              padding: '0.4em',
            }}
            target={target}
            href={href}
          >
            {children}
          </a>
        </div>
      ) : (
        <button
          style={{
            boxShadow: '0.14em 0.15em .2em rgba(0,0,0,0.2)',
            height: '2.3em',
            lineHeight: 0,
            border: '3px solid white',
            background: 'rgb(223,174,128)',
            color: 'white',
            background: 'linear-gradient(to bottom, #F0A236 0%, #DD7915 100%)',
            padding: '0.4em',
            margin: 0,
          }}
          onClick={() => onClick}
        >
          {children}
        </button>
      )}
    </>
  )
}
