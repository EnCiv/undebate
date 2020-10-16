import React, { useState, useEffect } from 'react'
import injectSheet from 'react-jss'
import superagent from 'superagent'
import { LookupForm } from './lookupForm'

const Preinject = props => {
  const [isDiabled, setIsDisabled] = useState(true)
  const [formValues, setFormValues] = useState({
    email: '',
    name: '',
    message: '',
  })
  const [infoMessage, setInfoMessage] = useState(null)
  const { classes } = props
  //useEffect([formValues])
  const handleChange = e => setFormValues({ ...formValues, [e.target.name]: e.target.value })
  const handleLogin = e => {
    e.preventDefault()
    setInfoMessage('Sending you your recording url')
    const { email, name } = formValues
    const userInfo = Object.assign({}, props.userInfo, { email, name })
    superagent
      .post('/send/recorder-link')
      .send(userInfo)
      .end((err, res) => {
        if (err) {
          logger.error('Send recorder link error', err)
        }
        setInfoMessage(null)
        if (res.statusCode === 200) {
          logger.info('successfully posted')
          setFormValues({ message: res.body.message })
        }
      })
  }

  return (
    <div className={props.classes.Container}>
      <form onSubmit={handleLogin} className={props.classes.LookupForm}>
        <LookupForm classes={classes} formValues={formValues} handleChange={handleChange} handleLogin={handleLogin} />
      </form>
    </div>
  )
}
const styles = {
  Container: {
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Montserrat , sans-serif',
    fontSize: '13px',
    marginTop: '3rem',
  },
  LookupForm: {
    border: '0.5px solid black',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    width: '30rem',
    maxWidth: '30rem',
    minHeight: '42rem',
    fontSize: 'inherit',
    '& form': {},
    '& label': {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '3rem',
      fontSize: 'inherit',
    },
  },
  disable: {
    backgroundColor: '#D3D3D3',
    float: 'right',
    width: '9rem',
    height: '3rem',
    fontSize: '1rem',
    fontWeight: '600',
    fontSize: 'inherit',
  },
  activeBtn: {
    backgroundColor: '#E5A650',
    cursor: 'pointer',
    float: 'right',
    width: '9rem',
    height: '3rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: '600',
  },
}

export default injectSheet(styles)(Preinject)
