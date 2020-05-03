'use strict'
import Join from './join'
import React from 'react'
import ReactDOM from 'react-dom'
import injectSheet from 'react-jss'
import Button from './button'
import cx from 'classnames'
import Icon from './lib/icon'
import ConversationHeader from './conversation-header'

const styles = {
  Preamble: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    paddingTop: '1em',
    paddingLeft: '3em',
    paddingRight: '3em',
    overflow: 'hidden',
    textOverflow: 'clip',
    boxSizing: 'border-box',
    transition: 'all 0.5s linear',
    backgroundColor: 'white', //'#F4F4F4',
    '&$agreed': {
      left: '-100vw',
    },
    '& ul': {
      paddingTop: '0.5em',
      paddingLeft: '2.5em',
    },
    '& li': {
      paddingBottom: '0.75em',
    },
  },
  agreed: {},
  center: {
    textAlign: 'center',
  },
  'Preamble-inner': {
    marginTop: '6vh',
    // need to have someting here for portrait mode - but don't record in portrait mode for now.
  },
}

class CandidateJoin extends Join {
  onChangeActive() {} // don't do anything - there's not need to check email and password comfirmation in this case
  render() {
    const { classes, className, onClick } = this.props
    const { info, successMessage, validationError } = this.state
    return (
      <React.Fragment>
        {!successMessage && (
          <React.Fragment>
            <a className={className} href="#" onClick={this.agree.bind(this)}>
              <Icon className={className} icon="square-o" size="2" ref="agree" name="agree" />
            </a>
            <span className={className}>I agree to the </span>
            <a className={className} href="https://enciv.org/terms/" target="_blank">
              Terms of Service
            </a>
            {info && <span className={className}>{info}</span>}
            {validationError && (
              <span className={className} style={{ color: 'red' }}>
                {validationError}
              </span>
            )}
          </React.Fragment>
        )}
        <div className={classes['center']}>
          <Button onClick={this.skip.bind(this)}>Next</Button>
        </div>
        {successMessage && <span className={className}>{successMessage}</span>}
      </React.Fragment>
    )
  }
}

const QuestionModal = ({ questions, closeModal }) => {
  const makeQuestions = questions => {
    return (
      <ul style={{ listStyleType: 'none', padding: '0' }}>
        {questions.map((question, index) =>
          typeof question === 'string' ? (
            <li key={index}>{question}</li>
          ) : question.length === 1 ? (
            <li key={index}>{question[0]}</li>
          ) : (
            <li>
              {question[0]}
              <ul>{makeQuestions(question.slice(1))}</ul>
            </li>
          )
        )}
      </ul>
    )
  }

  return (
    <div className="QuestionModal" style={{ padding: '2em' }}>
      <button onClick={() => closeModal()}>close</button>

      <h2>Questions for candidate</h2>
      {makeQuestions(questions)}
    </div>
  )
}

class RenderModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
    }
  }
  toggleModal = () => {
    this.setState({ open: !this.state.open })
  }
  render() {
    const { buttonText } = this.props
    let app_root
    if (typeof document !== 'undefined') {
      app_root = document.getElementById('synapp')
    }
    return (
      <div className="modal">
        {!this.state.open ? <button onClick={() => this.toggleModal()}>{buttonText}</button> : null}{' '}
        {app_root
          ? ReactDOM.createPortal(
              <div
                style={{
                  zIndex: 3,
                  width: '40vw',
                  minWidth: '300px',
                  position: 'absolute',
                  left: '23vw',
                  top: '8vh',
                  background: 'white',
                  boxShadow: '10px 5px 30px lightslategray',
                  maxHeight: '80vh',
                  overflow: 'auto',
                  display: 'block',
                  borderRadius: '.2em',
                  fontFamily: `'Montserrat', sans-serif`,
                }}
              >
                {this.state.open ? this.props.render(this.toggleModal) : null}{' '}
              </div>,
              app_root
            )
          : null}
      </div>
    )
  }
}

class CandidatePreamble extends React.Component {
  makeQuestions = questions => {}

  render() {
    const { classes, onClick, agreed, bp_info } = this.props
    return (
      <div className={cx(classes['Preamble'], agreed && classes['agreed'])}>
        <ConversationHeader subject={this.props.subject} bp_info={this.props.bp_info} />
        <div className={classes['Preamble-inner']} style={{ position: 'relative' }}>
          <p>
            Welcome{' '}
            {bp_info && bp_info.candidate_name ? (
              <span style={{ fontSize: '150%', fontWeight: 'bold' }}>{bp_info.candidate_name}</span>
            ) : (
              ''
            )}
          </p>
          <p>
            Ballotpedia and EnCiv are teaming up to create a better way for candidates to be heard, and voters to learn
            about their candidates.
          </p>
          <p>
            You are invited to engage in an application that will include you, as part of a publicly available online
            video conversation.
          </p>
          <ul>
            <li>
              During the conversation, you will be asked questions, and your video will be recorded and stored on your
              computer.
            </li>
            <li>
              At the end of the conversation, you will be asked to review and accept EnCiv's{' '}
              <a href="https://enciv.org/terms" target="_blank">
                terms of service
              </a>{' '}
              and create an account.
            </li>
            <li>
              Then, hitting the <b>Post</b> button will upload the recorded video and make it public.
            </li>
            <li>
              Or, hitting the <b>Hang Up</b> button or closing this window any time before hitting the <b>Post</b>{' '}
              button will cause any recordings to be discarded.
            </li>
          </ul>
          <RenderModal
            buttonText="Preview Questions"
            render={close => (
              <QuestionModal questions={this.props.candidate_questions} closeModal={close}></QuestionModal>
            )}
          ></RenderModal>
          {/*<CandidateJoin classes={classes} userInfo={{email: (bp_info.candidate_email && bp_info.candidate_email[0]) || (bp_info.person_email && bp_info.person_email[0]), name: bp_info.candidate_name}} onChange={onClick}/>*/}
          <div className={classes['center']}>
            <Button onClick={onClick}>Next</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(CandidatePreamble)

/*<p>When you are ready, click <b>Next</b>. After you do, you many need to authorize this app with your browser to use your camera and video.</p>*/
