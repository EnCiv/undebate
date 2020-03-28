'use strict;'
import React from 'react'
import injectSheet from 'react-jss'
import cx from 'classnames'

const BLUE = '#1B47A7'
const YELLOW = '#E5A650'

const styles = {
  'conversation-header-wrapper': {
    'font-family': 'Libre Franklin',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  conversationHeader: {
    'z-index': '10',
    position: 'absolute',
    margin: 0,
    padding: 0,
    left: 0,
    width: '100vw',
    height: '6vh',
    lineHeight: '6vh',
    'box-shadow': '0px .1vh .1vh rgba(0, 0, 0, 0.25)',
    fontFamily: 'Libre Franklin',
    '&$portrait': {
      position: 'relative',
    },
  },
  leftBoxContainer: {
    display: 'inline-block',
  },
  leftBox: {
    backgroundColor: BLUE,
    width: '0.52vw',
    height: '3.24vh',
    display: 'inline-block',
    '&$portrait': {
      textOverflow: 'hidden',
      display: 'block',
      width: '100%',
    },
  },
  conversationTopicContent: {
    fontSize: '2.5rem',
    fontWeight: 'bolder',
    paddingLeft: '.2em',
    paddingRight: '.2em',
    '&$portrait': {
      fontSize: '2rem',
      whiteSpace: 'nowrap',
      marginTop: '.2em',
      marginBottom: '.2em',
    },
  },
  rightBoxContainer: {
    display: 'inline-block',
    '&$portrait': {
      textOverflow: 'hidden',
      display: 'block',
      width: '100%',
    },
  },
  rightBox: {
    backgroundColor: YELLOW,
    width: '0.52vw',
    height: '3.24vh',
    display: 'inline-block',
  },
  conversationElectionDate: {
    paddingLeft: '.2em',
    fontSize: '2rem',
    fontWeight: 'normal',
    paddingLeft: '.2em',
    '&$portrait': {
      fontSize: '1.5rem',
      whiteSpace: 'nowrap',
      marginTop: '.2em',
      marginBottom: '.2em',
    },
  },
  logo: {
    marginRight: '.25em',
    height: '6vh',
    float: 'right',
    '&$portrait': {
      float: 'left',
    },
  },
  'enciv-logo': {
    padding: '.25em',
    marginRight: '.25em',
    height: '3.5vh',
    float: 'right',
    paddingTop: '.3em',
  },
  portrait: {},
}

const months = ['zero', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function xxxx_xx_xxTommmdd_yyyy(str) {
  if (!str) return ''
  let parts = str.split('-')
  let year = parts[0]
  let month = months[parseInt(parts[1])]
  let day = parts[2]
  return `${month} ${day}, ${year}`
}

class ConversationHeader extends React.Component {
  state = { isClient: false }
  componentDidMount() {
    this.setState({ isClient: true }) // because it will render in landscape more on the server and rehydrate has to find it that way - before you can change it.
  }
  render() {
    const portraitMode = typeof window !== 'undefined' && window.innerWidth < window.innerHeight
    const { classes, style, subject, bp_info } = this.props
    if (portraitMode && this.state.isClient)
      return (
        <div className={cx(classes['portrait'], classes['conversation-header-wrapper'])} key="portrait">
          <div className={cx(classes['portrait'], classes['conversationHeader'])} key="portrait-1">
            <a target="#" href="https://www.EnCiv.org">
              <img
                className={cx(classes['portrait'], classes['enciv-logo'])}
                src="https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png"
              />
            </a>
            <a target="#" href="https://ballotpedia.org/Candidate_Conversations">
              <img
                className={cx(classes['portrait'], classes['logo'])}
                src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png"
              />
            </a>
          </div>
          <div className={cx(classes['leftBoxContainer'], portraitMode && classes['portrait'])}>
            <div className={classes['leftBox']}></div>
            <span className={classes['conversationTopicContent']}>{subject}</span>
          </div>
          <div className={cx(classes['rightBoxContainer'], portraitMode && classes['portrait'])}>
            <div className={classes['rightBox']}></div>
            <span className={classes['conversationElectionDate']}>
              {xxxx_xx_xxTommmdd_yyyy(bp_info && bp_info.election_date)}
            </span>
          </div>
        </div>
      )
    else
      return (
        <div className={classes['conversation-header-wrapper']} key="landscape">
          <div className={classes['conversationHeader']} key="landscape-1">
            <div style={{ position: 'absolute', left: '1rem' }} key="landscape-2">
              <div className={cx(classes['leftBoxContainer'], portraitMode && classes['portrait'])}>
                <div className={classes['leftBox']}></div>
                <span className={classes['conversationTopicContent']}>{subject}</span>
              </div>
              <div className={cx(classes['rightBoxContainer'], portraitMode && classes['portrait'])}>
                <div className={classes['rightBox']}></div>
                <span className={classes['conversationElectionDate']}>
                  {xxxx_xx_xxTommmdd_yyyy(bp_info && bp_info.election_date)}
                </span>
              </div>
            </div>
            <a target="#" href="https://www.EnCiv.org">
              <img
                className={classes['enciv-logo']}
                src="https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png"
              />
            </a>
            <a target="#" href="https://ballotpedia.org/Candidate_Conversations">
              <img
                className={classes['logo']}
                src="https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png"
              />
            </a>
          </div>
        </div>
      )
  }
}

export default injectSheet(styles)(ConversationHeader)
