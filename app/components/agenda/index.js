import cx from 'classnames'
import React from 'react'
import Icon from '../lib/icon'
import { createUseStyles } from 'react-jss'
import TabbedContainer from '../TabbedContainer'
import Transcription from '../transcription'

const AgendaItem = ({ agenda, prevSection, nextSection, round }) => {
  const classes = useStyles()
  return (
    <div className={classes['innerAgenda']}>
      {agenda[round] && (
        <>
          <div className={classes['agendaItem']}>
            {/* <div className={classes['agendaTitle']}>
              <button className={classes['agenda-icon-left']} onClick={prevSection}>
                <Icon icon="chevron-left" size="1.5" name="previous-section" />
              </button>
              Agenda
              <button className={classes['agenda-icon-right']} onClick={nextSection}>
                <Icon icon="chevron-right" size="1.5" name="previous-section" />
              </button>
            </div> */}
            <ul className={classes['agendaList']}>
              {agenda[round] &&
                agenda[round].map((item, i) => (
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

export const Agenda = ({
  className,
  style,
  agenda,
  prevSection,
  nextSection,
  round,
  participants,
  speakingNow,
  thisParticipants,
}) => {
  return (
    <div style={{ ...style, border: '5px solid #1d3491' }} className={className}>
      <TabbedContainer
        tabs={[
          {
            name: 'Agenda',
            contents: <AgendaItem round={round} prevSection={prevSection} nextSection={nextSection} agenda={agenda} />,
          },
          {
            name: 'Transcript',
            contents: <Transcription round={round} transcriptions={participants[speakingNow].transcriptions} />,
          },
        ]}
      />
    </div>
  )
}

export default Agenda

const useStyles = createUseStyles({
  innerAgenda: {
    display: 'table-cell',
    width: '10000px',
  },
  agendaList: {
    textAlign: 'left',
    padding: '0',
    listStyleType: 'none',
    textAlign: 'center',
    '& li:first-child': {
      fontWeight: 'bold',
    },
    '& li': {
      paddingTop: '.5em',
      paddingBottom: '.5em',
    },
  },
  agendaItem: {
    'margin-block-start': '0',
    textAlign: 'left',
    fontSize: '1.5rem',
    lineHeight: '2rem',
    'font-weight': '200',
    'list-style-type': 'none',
    paddingLeft: '0',
  },
  /*
    agendaTitle: {
    fontFamily: 'Libre Franklin',
    textAlign: 'center',
    'font-size': '3rem',
    lineHeight: '3rem',
    backgroundColor: `${YELLOW}`,
    paddingTop: '1rem',
    paddingBottom: '1rem',
    'font-weight': 'bold',
  },
  'agenda-icon-left': {
    border: 'none',
    backgroundColor: 'transparent',
    marginLeft: '0.5rem',
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',
    fontSize: '100%',
  },
  'agenda-icon-right': {
    border: 'none',
    backgroundColor: 'transparent',
    marginRight: '0.5rem',
    display: 'inline-block',
    float: 'right',
    cursor: 'pointer',
    fontSize: '100%',
  },
  */
})
