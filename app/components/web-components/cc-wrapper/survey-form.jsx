'use strict;'

const surveyForm = props => {
  const { closing } = props
  const innerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920
  return (
    (closing.iframe && (
      <iframe
        src={closing.iframe.src}
        width={Math.min(closing.iframe.width, innerWidth)}
        height={closing.iframe.height}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        style={{ pointerEvents: 'all' }}
      >
        Loading...
      </iframe>
    )) ||
    (closing.link && (
      <div style={{ fontSize: '150%' }}>
        <a href={closing.link.url} target={closing.link.target || '_self'}>
          {closing.link.name}
        </a>
      </div>
    ))
  )
}

export default surveyForm
