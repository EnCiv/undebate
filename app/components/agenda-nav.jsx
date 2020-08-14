'use strict;'

import cx from 'classnames'
import React from 'react'
import Icon from './lib/icon'
import { createUseStyles } from 'react-jss'

export const AgendaNav = ({ className, style, agendaItem, prevSection, nextSection }) => {
  const classes = useStyles()
  return (
    <div style={style} className={cx(className, classes.agenda)}>
      <div className={classes.innerAgenda}>
        {agendaItem && (
          <>
            <div className={classes.agendaItem}>
              <div className={classes.agendaTitle}>
                <button className={classes.agendaIconLeft} onClick={prevSection}>
                  <Icon icon="chevron-left" size="1.5" name="previous-section" />
                </button>
                Agenda
                <button className={classes.agendaIconRight} onClick={nextSection}>
                  <Icon icon="chevron-right" size="1.5" name="previous-section" />
                </button>
              </div>
              <ul className={classes.agendaList}>
                {agendaItem &&
                  agendaItem.map((item, i) => (
                    <li className={classes.item} key={item + i}>
                      {item}
                    </li>
                  ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AgendaNav

const YELLOW = '#E5A650'
const useStyles = createUseStyles({
  agenda: {
    textAlign: 'center',
    backgroundColor: 'white',
    'box-shadow': '0px 4px 4px rgba(0,0,0,0.25)',
    'box-sizing': 'border-box',
    'font-weight': '600',
    display: 'table',
  },
  innerAgenda: {
    display: 'table-cell',
  },
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
  agendaList: {
    textAlign: 'left',
    padding: '0',
    listStyleType: 'none',
    '& li:first-child': {
      fontWeight: 'bold',
    },
  },
  agendaItem: {
    'margin-block-start': '0',
    textAlign: 'left',
    lineHeight: '2rem',
    'font-weight': '200',
    'list-style-type': 'none',
    paddingLeft: '0',
  },
  agendaIconLeft: {
    border: 'none',
    backgroundColor: 'transparent',
    marginLeft: '0.5rem',
    display: 'inline-block',
    float: 'left',
    cursor: 'pointer',
    fontSize: '100%',
  },
  agendaIconRight: {
    border: 'none',
    backgroundColor: 'transparent',
    marginRight: '0.5rem',
    display: 'inline-block',
    float: 'right',
    cursor: 'pointer',
    fontSize: '100%',
  },
  item: {
    fontFamily: 'Roboto',
    fontSize: '2rem',
    fontWeight: 'normal',
    backgroundColor: 'white',
    padding: '1rem',
    'border-bottom': '1px solid lightGray',
    'padding-top': '0.5rem',
    'padding-bottom': '0.25rem',
  },
})
