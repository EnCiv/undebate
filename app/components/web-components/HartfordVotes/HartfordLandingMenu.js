import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const styles = {
  menu: {
    width: '100vw',
    textAlign: 'center',
    backgroundColor: 'blue',
    height: '12vh',
    '@media only screen and (max-width:600px)': {
      width: '12vh',
    },
  },
}
//include logos in here for portrait mode rendering as well
let HartfordLandingMenu = ({ classes }) => {
  return (
    <>
      <nav className={classes.menu}></nav>
    </>
  )
}
HartfordLandingMenu = injectSheet(styles)(HartfordLandingMenu)
export default HartfordLandingMenu
