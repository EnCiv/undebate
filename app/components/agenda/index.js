import cx from 'classnames'
import React from 'react'
import Icon from '../lib/icon'

export const Agenda = ({ styles, agenda, prevSection, nextSection, round }) => {
  const { stylesSet, finishUp, begin, intro, agendaStyle, classes } = styles
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
