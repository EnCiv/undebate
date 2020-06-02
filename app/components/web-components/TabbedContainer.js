import React, { useState, useEffect, useRef } from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'
const container_width = '90vw'

const styles = {
  tabbedContainer: {
    width: container_width,
  },
  tabContents: {
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
  },
  selectedTab: {
    position: 'relative',
    zIndex: 2,
    boxShadow: '0.4em 0.5em .2em rgba(0,0,0,0.2)',
    fontSize: '1.3em',
    borderBottom: 0,
    backgroundColor: 'white',
  },
  tab_label_bar: {
    display: 'flex',
    flexDirection: 'row',
    //use some flexbox to make some labels display evenly accross
  },
  //TODO define styles that make certain things display none if in mobile and vice versa for tab labels
}

/**
 * tabs and contents is an array of objects
 * each object has properties name and contents
 * action is reserved for a hook or other function
 * that allows the display of the contents
 */
const makeTabs = (tabs_and_contents, action, classes) => {
  //TODO make it so that it returns both this and a version that is a drop down menu
  const drop_down_menu = (
    <form className={classes.drop_down_menu}>
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
  return (
    <div className={classes.tab_label_bar}>
      {tabs_and_contents.map((tab, index) => {
        return (
          <button id={`label_for_tab_${index}`} className={classes.tab_label} onClick={() => action(index)}>
            {tab.name}
          </button>
        )
      })}
    </div>
  )
}

let TabbedContainer = ({ classes, tabs }) => {
  let [selectedTab, changeTab] = useState(0)
  const tabRow = makeTabs(tabs, changeTab, classes)
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
  return (
    <div>
      {tabRow}
      <div className={classes.tabContents}>{renderedTab}</div>
    </div>
  )
}
TabbedContainer = injectSheet(styles)(TabbedContainer)
export default TabbedContainer
