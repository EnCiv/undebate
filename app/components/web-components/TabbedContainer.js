import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
import { useMode } from './HartfordVotes/phone-portrait-context'
const container_width = '100%'

const useStyles = createUseStyles({
  tabbedContainer: {
    width: container_width,
  },
  tabContents: {
    '@media only screen and (max-device-width: 600px)': {
      border: 'none',
    },
    boxSizing: 'border-box',
    width: container_width,
    border: '2px solid #D5D3D3B7',
    borderTop: 0,
    padding: '1em',
    textAlign: 'center',
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 2,
    height: '100%',
    '&>div': {
      width: 'calc(100% - 2em)',
      minHeight: '500px',
      height: '90vh',
      marginLeft: '1em',
      marginRight: '1em',
      marginBottom: '1em',
      padding: '1em',
      backgroundColor: '#29316E',

      '& h3': {
        color: 'white',
        fontSize: '1.5em',
        textAlign: 'left',
        margin: 0,
        marginBottom: '.75em',
        fontWeight: 100,
      },
      '& iframe': {
        border: 'none',
        height: 'calc(100% - 3em)',
      },
    },
    '& h3': {
      margin: '1em',
      fontSize: '3.5em',
    },
  },
  tab_label: {
    fontSize: '1.7em',
    border: '2px solid #D5D3D3B7',
    backgroundColor: '#EBEAEA',
    color: '#4C6286',
    '& + &': {
      borderLeft: 0,
    },
    padding: '.5em',
    width: 'calc( 100% / 7 )',
  },
  selectedTab: {
    width: 'calc( 100% / 7 )',
    border: '2px solid #D5D3D3B7',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0.4em 0.5em .2em rgba(0,0,0,0.2)',
    fontSize: '1.7em',
    borderBottom: 0,
    backgroundColor: '#29316E',
    color: 'white',
  },
  tab_label_select_option: {},
  tab_label_bar: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    //use some flexbox to make some labels display evenly accross
  },
  drop_down_menu: {
    '& select': {
      backgroundColor: 'white',
      color: '#333333',
      textIndent: '47%',
      width: 'calc( 100% - 3em )',
      border: '6px solid #29316E',
      height: '3em',
      marginLeft: '1.5em',
      marginRight: '1.5em',
    },
    width: '100%',
  },
  '@keyframes colorFlash': {
    from: { backgroundColor: 'white' },
    to: { backgroundColor: '#29316E' },
  },
  '@keyframes colorFlash2': {
    to: { backgroundColor: 'white' },
    from: { backgroundColor: '#29316E' },
  },
  transitionedSelect: {
    '& select': {
      backgroundColor: 'white',
      animationName: '$colorFlash2',
      animationDuration: '0.8s',
      animationDelay: '0s',
      animationTimingFunction: 'cubicBezier(0.25,0.1, 0.23, 1)',
    },
  },
  transitionedTab: {
    animationName: '$colorFlash',
    animationDuration: '0.8s',
    animationDelay: '0s',
    animationTimingFunction: 'cubicBezier(0.25,0.1, 0.23, 1)',
  },
  smallscreen: {},
  largescreen: {},
  //TODO define styles that make certain things display none if in mobile and vice versa for tab labels
})

/**
 * tabs and contents is an array of objects
 * each object has properties name and contents
 * action is reserved for a hook or other function
 * that allows the display of the contents
 */
const TabButtons = ({ prev_selected_tab, selected_tab, tabs, action, transition }) => {
  const classes = useStyles()
  const isPortrait = useMode()

  const highlightTab = () => {
    if (document) {
      document.getElementById(`label_for_tab_${selected_tab}`).className = classes.selectedTab
      document.getElementById(`label_for_tab_${prev_selected_tab}`).className = classes.tab_label
      if (transition) {
        document.getElementById(
          `label_for_tab_${selected_tab}`
        ).className = `${classes.transitionedTab} ${classes.selectedTab}`
      }
    }
  }

  useEffect(() => {
    highlightTab()
  }, [selected_tab])

  useEffect(() => {
    document.getElementById(`label_for_tab_${selected_tab}`).className = classes.selectedTab
  }, [isPortrait])

  return (
    <div className={cx(classes.tab_label_bar, classes.largescreen)}>
      {tabs.map((tab, index) => {
        return (
          <button
            id={`label_for_tab_${index}`}
            className={classes.tab_label}
            onClick={() => action(index)}
            style={{ width: `calc(100%/${tabs.length})` }}
          >
            {tab.name}
          </button>
        )
      })}
    </div>
  )
}

const TabSelect = ({ selected_tab = 0, tabs, action, transition }) => {
  const classes = useStyles()

  const drop_down_menu = (
    <form className={cx(classes.drop_down_menu, transition ? classes.transitionedSelect : '')}>
      <select name="select_tab" onChange={event => action(event.target.value)}>
        {tabs.map((tab, index) => {
          return (
            <option
              id={`label_for_tab_${index}`}
              selected={selected_tab === index}
              value={index}
              className={classes.tab_label_select_option}
            >
              {tab.name}
            </option>
          )
        })}
      </select>
    </form>
  )
  return drop_down_menu
}

const TabbedContainer = ({ tabs, selected_tab = 0, transition = false }) => {
  const isPortrait = useMode()
  const classes = useStyles()
  let [selectedTab, changeTab] = useState(selected_tab)
  //make sure that the previously selected tab isn't undefined. prevSelectedTab is used to ensure that there is always a highlightTab in the UI
  const prevSelectedTabRef = useRef(selected_tab === tabs.length - 1 ? selectedTab - 1 : selectedTab + 1)

  useEffect(() => {
    changeTab(selected_tab)
  }, [selected_tab])

  useEffect(() => {
    prevSelectedTabRef.current = selectedTab
  }, [selectedTab])

  useEffect(() => {
    document.getElementById(`label_for_tab_${selectedTab}`).selected = true
  }, [isPortrait])

  const prevSelectedTab = prevSelectedTabRef.current
  const renderedTab = tabs[selectedTab].contents

  return (
    <div>
      {isPortrait ? (
        <TabSelect selected_tab={selectedTab} tabs={tabs} action={changeTab} transition={transition} />
      ) : (
        <TabButtons
          selected_tab={selectedTab}
          prev_selected_tab={prevSelectedTab}
          tabs={tabs}
          action={changeTab}
          transition={transition}
        />
      )}
      <div className={classes.tabContents}>{renderedTab}</div>
    </div>
  )
}

export default TabbedContainer
