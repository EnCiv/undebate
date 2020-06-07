import React, { useState, useEffect, useRef } from 'react'
import { createUseStyles } from 'react-jss'
import cx from 'classnames'
const container_width = '100%'

const useStyles = createUseStyles({
  tabbedContainer: {
    width: container_width,
  },
  tabContents: {
    boxSizing: 'border-box',
    width: container_width,
    border: '2px solid grey',
    padding: '1em',
    textAlign: 'center',
    backgroundColor: 'white',
    position: 'relative',
    zIndex: 3,
    height: '500px',
    '& h3': {
      margin: '1em',
      fontSize: '3.5em',
    },
  },
  tab_label: {
    fontSize: '1.2em',
    borderBottom: 0,
    backgroundColor: 'lightgray',
    width: 'calc( 100% / 7 )',
  },
  selectedTab: {
    width: 'calc( 100% / 7 )',
    position: 'relative',
    zIndex: 2,
    boxShadow: '0.4em 0.5em .2em rgba(0,0,0,0.2)',
    fontSize: '1.3em',
    borderBottom: 0,
    backgroundColor: 'white',
  },
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
      width: '100%',
    },
    width: '100%',
  },
  smallscreen: {
    display: 'none',
    //phones
    '@media only screen and (max-device-width:600px)': {
      display: 'block',
    },
  },
  largescreen: {
    display: 'none',
    //phones
    '@media (min-device-width:601px)': {
      display: 'block',
    },
  },
  //TODO define styles that make certain things display none if in mobile and vice versa for tab labels
})

/**
 * tabs and contents is an array of objects
 * each object has properties name and contents
 * action is reserved for a hook or other function
 * that allows the display of the contents
 */
const makeTabs = (tabs_and_contents, action, classes) => {
  //TODO make it so that it returns both this and a version that is a drop down menu
  const drop_down_menu = (
    <form className={cx(classes.drop_down_menu, classes.smallscreen)}>
      <select name="select_tab" onChange={event => action(event.target.value)}>
        {tabs_and_contents.map((tab, index) => {
          return (
            <option value={index} className={classes.tab_label_select_option}>
              {tab.name}
            </option>
          )
        })}
      </select>
    </form>
  )
  const tab_label_buttons = (
    <div className={cx(classes.tab_label_bar, classes.largescreen)}>
      {tabs_and_contents.map((tab, index) => {
        return (
          <button id={`label_for_tab_${index}`} className={classes.tab_label} onClick={() => action(index)}>
            {tab.name}
          </button>
        )
      })}
    </div>
  )
  return { drop_down_menu, tab_label_buttons }
}

const TabbedContainer = ({ tabs }) => {
  const classes = useStyles()
  let [selectedTab, changeTab] = useState(0)
  let tabRow = makeTabs(tabs, changeTab, classes)
  //TODO make it so that both options are returned for tabRow
  const renderedTab = tabs[selectedTab].contents
  const prevSelectedTabRef = useRef(selectedTab + 1)

  useEffect(() => {
    console.log(document.getElementById(`label_for_tab_${selectedTab}`))
    console.log(document.getElementById(`label_for_tab_${prevSelectedTab}`))
    document.getElementById(`label_for_tab_${selectedTab}`).className = classes.selectedTab
    document.getElementById(`label_for_tab_${prevSelectedTab}`).className = classes.tab_label
    prevSelectedTabRef.current = selectedTab
  }, [selectedTab])
  const prevSelectedTab = prevSelectedTabRef.current
  console.info('render')
  return (
    <div>
      {tabRow.tab_label_buttons}
      {tabRow.drop_down_menu}
      {document.getElementsByClassName(classes.tab_label).forEach(element => {
        element.style.width = `calc(100% / ${tabs.length})`
      })}
      {document.getElementsByClassName(classes.selectedTab).forEach(element => {
        element.style.width = `calc(100% / ${tabs.length})`
      })}
      <div className={classes.tabContents}>{renderedTab}</div>
    </div>
  )
}

export default TabbedContainer
