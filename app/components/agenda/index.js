import cx from 'classnames'
import React from 'react'
import Icon from '../lib/icon'
import { createUseStyles } from 'react-jss'
import TabbedContainer from '../TabbedContainer'
import Transcription from '../transcription'

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

export const Agenda = ({ className, style, agendaItem, transcript, element }) => {
  return (
    <div style={{ ...style, border: '5px solid #1d3491' }} className={className}>
      <TabbedContainer
        tabs={[
          {
            name: 'Agenda',
            contents: <AgendaItem agendaItem={agendaItem} />,
          },
          {
            name: 'Transcript',
            contents: <Transcription transcript={transcript} element={element} />,
          },
        ]}
      />
    </div>
  )
}

export default Agenda

const useStyles = createUseStyles({
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
