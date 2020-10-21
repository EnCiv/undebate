import cx from 'classnames'
import React from 'react'
import { createUseStyles } from 'react-jss'
import TabbedContainer from './TabbedContainer'
import Transcription from './transcription'

const AgendaItem = ({ agendaItem }) => {
  const classes = useStyles()
  return (
    <div className={classes['innerAgenda']}>
      {agendaItem && (
        <>
          <div className={classes['agendaItem']}>
            <ul className={classes['agendaList']}>
              {agendaItem &&
                agendaItem.map((item, i) => (
                  <li className={classes['item']} key={item + i}>
                    {item}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export const AgendaTranscript = ({ className, style, agendaItem, transcript, element }) => {
  const classes = useAgendaStyles()
  let tabs = [
    {
      name: 'Agenda',
      contents: <AgendaItem agendaItem={agendaItem} />,
    },
  ]
  if (transcript && transcript.languages && transcript.languages.es) {
    tabs.push({
      name: 'English',
      contents: <Transcription transcript={transcript} element={element} language="en" />,
    })
    tabs.push({
      name: 'Español',
      contents: <Transcription transcript={transcript} element={element} language="es" />,
    })
  } else {
    tabs.push({
      name: 'Transcript',
      contents: <Transcription transcript={transcript} element={element} language="en" />,
    })
  }
  return (
    <div style={{ ...style, border: '5px solid #1d3491' }} className={cx(className, classes.agenda)}>
      <TabbedContainer tabs={tabs} />
    </div>
  )
}

export default AgendaTranscript

const useAgendaStyles = createUseStyles({
  agenda: {
    textAlign: 'center',
    backgroundColor: 'white',
    'box-shadow': '0px 4px 4px rgba(0,0,0,0.25)',
    'box-sizing': 'border-box',
    'font-weight': '600',
    display: 'table',
  },
})

const useStyles = createUseStyles({
  agenda: {
    textAlign: 'center',
    backgroundColor: 'white',
    'box-shadow': '0px 4px 4px rgba(0,0,0,0.25)',
    'box-sizing': 'border-box',
    'font-weight': '600',
    display: 'table',
  },
  innerAgenda: {},
  agendaList: {
    padding: '0',
    listStyleType: 'none',
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 0,
    '& li:first-child': {
      fontWeight: 'bold',
    },
    '& li': {},
  },
  agendaItem: {
    marginBlockStart: '0',
    textAlign: 'left',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    fontWeight: '200',
    listStyleType: 'none',
    paddingLeft: '0',
  },
  item: {
    fontFamily: 'Roboto',
    fontSize: '2rem',
    fontWeight: 'normal',
    backgroundColor: 'white',
    borderBottom: '1px solid lightGray',
    paddingTop: '0.5rem',
    paddingBottom: '0.25rem',
    paddingRight: '1rem',
  },
})
