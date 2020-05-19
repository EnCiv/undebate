import React from 'react'
import ReactDOM, { createPortal } from 'react-dom'

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
    let app_root
    if (typeof document !== 'undefined') {
      app_root = document.getElementById('synapp')
    }
    return (
      <div className="modal">
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
