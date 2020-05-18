import React from 'react'
import ReactDOM, { createPortal } from 'react-dom'
// import React, { useState } from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// const X = ({ onClick }) => {
//   const [color, setColor] = useState('white')
//   const [fontColor, setFontColor] = useState('black')
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         backgroundColor: color,
//         border: 'none',
//       }}
//       onMouseEnter={() => {
//         setColor('red')
//         setFontColor('white')
//       }}
//       onMouseLeave={() => {
//         setColor('white')
//         setFontColor('black')
//       }}
//     >
//       <FontAwesomeIcon
//         icon="times"
//         style={{
//           fontSize: '2em',
//           color: fontColor,
//           background: 'none',
//         }}
//       ></FontAwesomeIcon>
//     </button>
//   )
// }

class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: true,
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
      <div className="modal">
        {/* {!this.state.open ? (
          <button
            onClick={() => {
              this.toggleModal()
              document.getElementById(modalId).style.height = '80vh'
            }}
          >
            {buttonText}
          </button>
        ) : null}{' '} */}
        {/* {this.state.open
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
          : null} */}
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
                    // id={modalId}
                    style={{
                      boxSizing: 'border-box',
                      zIndex: 3,
                      pointerEvents: 'auto',
                      width: '70vw',
                      minWidth: '280px',
                      margin: '0 auto',
                      background: 'white',
                      boxShadow: '10px 5px 30px lightslategray',
                      maxHeight: '80vh',
                      height: '80vh',
                      overflow: 'auto',
                      display: 'block',
                      borderRadius: '.2em',
                      fontSize: '2em',
                      lineHeight: '2em',
                      padding: '2em',
                      fontFamily: `'Montserrat', sans-serif`,
                    }}
                  >
                    {/* {this.state.open ? (
                      <X
                        onClick={() => {
                          this.toggleModal()
                          document.getElementById(modalId).style.height = '0'
                        }}
                      />
                    ) : null} */}
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
