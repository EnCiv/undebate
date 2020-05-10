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
    // lineHeight: '6vh',
    'box-shadow': '0px .1vh .1vh rgba(0, 0, 0, 0.25)',
    fontFamily: 'Libre Franklin',
    '&$portrait': {
      position: 'relative',
    },
  },
  leftBoxContainer: {
    // padding: '1vh 0',
    display: 'inline-block',
  },
  leftBox: {
    backgroundColor: BLUE,
    width: '0.52vw',
    height: '3.24vh',
    // height: 'fit-content',
    display: 'inline-block',
    '&$portrait': {
      textOverflow: 'hidden',
      display: 'block',
      width: '100%',
    },
  },
  conversationTopicContent: {
    fontSize: '2.5em',
    fontWeight: 'bolder',
    paddingLeft: '.2em',
    paddingRight: '.2em',
    display: 'inline-block',
    width: 'max-content',
    height: 'min-content',
    marginTop: '.1em',
    marginBottom: '.2em',
    '&$portrait': {
      fontSize: '2em',
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
    // height: 'fit-content',
    // height: '100%',
    display: 'inline-block',
  },
  conversationElectionDate: {
    paddingLeft: '.2em',
    fontSize: '2rem',
    fontWeight: 'normal',
    height: 'min-content',
    '&$portrait': {
      fontSize: '1.5rem',
      whiteSpace: 'nowrap',
      marginTop: '.2em',
      marginBottom: '.2em',
    },
  },
  'undebate-logo': {
    marginRight: '.25em',
    height: '4vh',
    marginTop: '1vh',
    float: 'right',
    '&$portrait': {
      float: 'left',
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
  boxContainer: {
    width: 'max-content',
    // height: 'max-content',
    margin: '1vh',
  },
  portrait: {},
}

const months = ['zero', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function xxxx_xx_xxTommmdd_yyyy(str) {
  if (!str) return ''
  let parts = str.split('-')
  if (parts.length === 3) {
    let year = parts[0]
    let month = months[parseInt(parts[1])]
    let day = parts[2]
    return `${month} ${day}, ${year}`
  }
  parts = str.split('/')
  if (parts.length === 3) {
    let year = parts[2]
    let month = months[parseInt(parts[1])]
    let day = parts[0]
    return `${month} ${day}, ${year}`
  }
  return ''
}

const LogoLinks = ({ classes, logo }) => {
  const link_image = src => classname => href => (
    <a target="#" href={href}>
      <img className={classes[classname]} src={src} />
    </a>
  )
  const makeLink = link => {
    let link_html = link_image
    for (const attribute in link) {
      link_html = link_html(link[attribute])
    }
    return link_html
  }
  const list_of_links = {
    enciv: {
      src: 'https://enciv.org/wp-content/uploads/2019/01/enciv-logo.png',
      classname: 'enciv-logo',
      href: 'https://www.EnCiv.org',
    },
    undebate: {
      src: 'https://res.cloudinary.com/hf6mryjpf/image/upload/c_scale,h_100/v1585602937/Undebate_Logo.png',
      classname: 'undebate-logo',
      href: 'https://enciv.org/undebate',
    },
    ballotpedia: {
      src:
        'https://res.cloudinary.com/hf6mryjpf/image/upload/v1578591434/assets/Candidate_Conversations_logo-stacked_300_res.png',
      classname: 'logo',
      href: 'https://ballotpedia.org/Candidate_Conversations',
    },
  }
  const { enciv, undebate, ballotpedia } = list_of_links
  return (
    <>
      {' '}
      {makeLink(enciv)}
      {logo && logo === 'undebate' ? makeLink(undebate) : makeLink(ballotpedia)}
    </>
  )
}

class ConversationHeader extends React.Component {
  state = { isClient: false, portraitMode: false }
  static defaultProps = {
    handleOrientationChange: () => null,
  }
  componentDidMount() {
    this.setState({
      isClient: true,
      portraitMode: this.isPortrait(),
    }) // because it will render in landscape more on the server and rehydrate has to find it that way - before you can change it.
  }
  isPortrait = () => typeof window !== 'undefined' && window.innerWidth < window.innerHeight
  fitsWidth = () => document.getElementById('spanID0').offsetWidth > window.innerWidth
  componentDidUpdate(prevProps, prevState) {
    if (this.isPortrait() !== prevState.portraitMode) {
      let choice = this.isPortrait()
      this.setState({ portraitMode: choice })
      this.props.handleOrientationChange(choice)
    }
  }
  resize = () => {
    let topicContent = typeof document === 'object' ? document.getElementById('bcon') : null
    let topicContentTotalHeight = undefined
    let outsideContainer =
      typeof document === 'object'
        ? document.getElementsByClassName(this.props.classes['conversation-header-wrapper'])
        : null

    const splitAtUnits = size => {
      const indexOfUnits = size.indexOf(/\D/g) - 1
      const units = size.slice(indexOfUnits)
      const magnitude = parseFloat(size.slice(0, indexOfUnits))
      return { magnitude, units }
    }

    if (typeof window === 'object') {
      topicContentTotalHeight = window.getComputedStyle(topicContent, null).getPropertyValue('height')
      topicContentTotalHeight = splitAtUnits(topicContentTotalHeight).magnitude
      console.log(topicContentTotalHeight, outsideContainer[0].offsetHeight)
    }
    if (
      (topicContent && topicContent.offsetWidth > window.innerWidth * 0.75) ||
      (outsideContainer && topicContentTotalHeight > outsideContainer[0].offsetHeight * 0.9)
    ) {
      //shrink font
      let font_size = window.getComputedStyle(topicContent, null).getPropertyValue('font-size')
      font_size = splitAtUnits(font_size)
      topicContent.style.fontSize = font_size.magnitude * 0.8 + font_size.units
    }

    if (
      typeof window === 'object' &&
      topicContent &&
      topicContent.offsetWidth < window.innerWidth * 0.7 &&
      !(outsideContainer && topicContentTotalHeight > outsideContainer[0].offsetHeight * 0.8)
    ) {
      //embiggen if you are too narrow or too short
      let font_size = window.getComputedStyle(topicContent, null).getPropertyValue('font-size')
      font_size = splitAtUnits(font_size)
      topicContent.style.fontSize = font_size.magnitude * 1.1 + font_size.units
    }
  }
  render() {
    const { portraitMode } = this.state
    const { classes, style, subject, bp_info, logo } = this.props
    const makeBox = boxType => decoratorClass => spanClass => spanContent => (
      <div className={cx(classes[boxType], portraitMode && classes['portrait'])}>
        <div className={cx(classes[decoratorClass])}></div>
        <span id={makeBox.idTag + makeBox.counter++} className={cx(classes[spanClass])}>
          {spanContent}
        </span>
      </div>
    )
    makeBox.idTag = 'spanID'
    makeBox.counter = 0
    return (
      <div
        className={cx(
          portraitMode && classes['portrait'],
          classes['conversation-header-wrapper'],
          !portraitMode && classes['conversationHeader']
        )}
      >
        <div className={portraitMode && cx(classes['conversationHeader'], classes['portrait'])}>
          <LogoLinks classes={classes} logo={logo}></LogoLinks>
        </div>

        {this.resize()}

        <div id="bcon" className={classes['boxContainer']}>
          {' '}
          {console.log('hello')}
          {makeBox('leftBoxContainer')('leftBox')('conversationTopicContent')(subject)}
          {makeBox('rightBoxContainer')('rightBox')('conversationElectionDate')()
          // xxxx_xx_xxTommmdd_yyyy(bp_info && bp_info.election_date)
          }
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(ConversationHeader)
