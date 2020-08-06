/*
 * closing button X that highlights when hovered
 * */

import ReactDOM, { createPortal } from 'react-dom'
import Icon from './lib/icon.jsx'

import React, { useState } from 'react'

export const X = ({ onClick }) => {
  const [color, setColor] = useState('white')
  const [fontColor, setFontColor] = useState('black')

  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: color,
        border: 'none',
      }}
      onMouseEnter={() => {
        setColor('red')
        setFontColor('white')
      }}
      onMouseLeave={() => {
        setColor('white')
        setFontColor('black')
      }}
    >
      <Icon icon={'times'} />
    </button>
  )
}

/*
 *
 *     <FontAwesomeIcon
 *       icon="times"
 *       style={{
 *         fontSize: '2em',
 *         color: fontColor,
 *         background: 'none',
 *       }}
 *     ></FontAwesmeIcon>
 * another modal but more complex
 *
 * requires the X code from above
 * allows you to close the modal by clicking outside of the modal box. Also darkens the screen outside of the modal
 **/
class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: props.open ? props.open : false,
      defaultOpen: props.open ? props.open : false,
    }
  }
  toggleModal = () => {
    this.setState({
      open: !this.state.open,
    })
  }
  render() {
    const { buttonText, modalId } = this.props
    let app_root
    if (typeof document !== 'undefined') {
      app_root = document.getElementById('synapp')
    }
    return (
      <div className="modal" id={'modalWrapper'}>
        {!this.state.open ? (
          <button
            onClick={() => {
              this.toggleModal()
              document.getElementById(modalId).style.height = '80vh'
            }}
          >
            {buttonText}
          </button>
        ) : null}{' '}
        {this.state.open
          ? ReactDOM.createPortal(
              <div
                style={
                  this.state.open
                    ? {
                        height: '100vh',
                        width: '100vw',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        zIndex: 2,
                        position: 'fixed',
                        right: 0,
                        bottom: 0,
                        margin: 0,
                      }
                    : null
                }
                onClick={e => {
                  e.stopPropagation()
                  this.toggleModal()
                  document.getElementById(modalId).style.height = '0'
                }}
              ></div>,
              app_root
            )
          : null}
        {app_root
          ? ReactDOM.createPortal(
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: '8vh',
                    left: 0,
                    justifyContent: 'center',
                    width: '100%',
                    pointerEvents: 'none',
                    zIndex: 3,
                  }}
                >
                  <div
                    id={modalId}
                    style={{
                      zIndex: 3,
                      pointerEvents: 'auto',
                      width: '70vw',
                      minWidth: '280px',
                      margin: '0 auto',
                      background: 'white',
                      boxShadow: '10px 5px 30px rgba(0,0,0,0.5)',
                      maxHeight: '80vh',
                      height: this.state.defaultOpen ? '80vh' : '0',
                      overflow: 'auto',
                      display: 'block',
                      borderRadius: '.2em',
                      fontFamily: `'Montserrat', sans-serif`,
                    }}
                  >
                    {this.state.open ? (
                      <X
                        onClick={() => {
                          this.toggleModal()
                          document.getElementById(modalId).style.height = '0'
                        }}
                      />
                    ) : null}
                    {this.state.open ? this.props.render(this.toggleModal) : null}{' '}
                  </div>
                </div>
              </>,
              app_root
            )
          : null}
      </div>
    )
  }
}

export default Modal
