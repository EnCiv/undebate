'use strict';

import React from 'react';
import cx from 'classnames';
import injectSheet from 'react-jss'

const IconWidth=2;
const IconHeight=2;
const FeedbackWidth=29;

const styles = {
    defaultLandscape: {
        position: 'fixed',
        zIndex: 10,
        color: 'black',
        background: 'transparent',
        transition: 'all 0.5s linear',
        width: IconWidth+IconHeight*.2+'em',
        height: IconHeight+'em',
        bottom: 0,
        right: 0
    },
    defaultPortrait: {
        position: 'fixed',
        zIndex: 10,
        color: 'black',
        background: 'transparent',
        transition: 'all 0.5s linear',
        width: IconWidth+IconHeight*.2+'em',
        height: IconHeight+'em',
        bottom: 0,
        right: 0
    },
    openLandscape: {
        //width: '50vw',
        //height: '50vh'
        right: FeedbackWidth-IconWidth/2+'em',
        //bottom: '20em'
    },
    openPortrait: {
        //width: '97vw',
        //height: '75vh'
        right: FeedbackWidth-IconWidth/2+'em',
        //bottom: '20em'
    },
    wrapper: {
        margin: '1em',
        border: 'none',
        marginTop: IconHeight+"em",
        width: '29em',
        //height: '20em'
    },
    form:{
        padding: '0.5em',
        border: 'solid darkslategray 1px',
        borderRadius: '0.25em',
        boxShadow: '0 0 0.5em 0.25em rgba(0, 0, 0, 0.3)',
        background: 'white',
        "& p":{
            margin: 0,
            fontSize: '1rem'
        }
    },
    subject:{
        width: '100%',
        marginBottom: '0.5em',
        borderRadius: 0,
        boxSizing: 'border-box'
    },
    message:{
        display: 'table-cell',
        width: '100%',
        marginBottom: '0.5em',
        borderRadius: 0,
        height: '8em',
        verticalAlign: 'top',
        marginBottom: '.5em',
        boxSizing: 'border-box'
    },
    buttonRow:{
        width: "100%",
        textAlign: "right",
    },
    button:{
        display: 'inline-block',
        //marginRight: '1em',
        cursor: 'pointer',
        outline: 'medium none',
        border: 'medium none',
        borderRadius: '0px',
        textDecoration: 'none',
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
        paddingTop: '0.1em',
        paddingBottom: '0.1em',
        fontSize: '1rem',
        height: '2em',
        color: 'white',
        background: 'linear-gradient(to bottom, #FF8F00 0%, #FF7002 51%, #FF7002 100%) repeat scroll 0% 0% transparent'
    },
    cancelButton:{
        display: 'inline-block',
        marginRight: '1em',
        cursor: 'pointer',
        outline: 'medium none',
        border: 'medium none',
        borderRadius: '0px',
        textDecoration: 'none',
        paddingLeft: '0.5em',
        paddingRight: '0.5em',
        paddingTop: '0.1em',
        paddingBottom: '0.1em',
        fontSize: '1rem',
        height: '2em',
        color: 'gray',
        background: 'white',
        border: '1px gray solid'
    },
    icon: {
        display: 'block',
        textAlign: 'center',
        marginRight: '0.5em',
        cursor: 'pointer',
        position: 'absolute',
        fontSize: IconWidth/2+'em' // width of the center
    },
    base: {
        color: "#e3e7eab0", // derived from the background image, made transparend so you can see video behind
        fontSize: IconWidth+"em"
    },
    border: {
        color: "#606060", // mild contrast with background
        fontSize: IconWidth+"em"
    },
    center: { // manually determined to place the thumbs up in the center of the comment-alt
        color: "#606060", // mild contrast with background
        left: ".55em",
        top: ".3em",
    }
}

 class SiteFeedback extends React.Component {
  elms={};
  state={   response: null,
            open: false,
            width: 0,
            height: 0
        }

    constructor(props){
        super(props);
        this.openClose=this.openClose.bind(this);
        this.openForm=this.openForm.bind(this);
    }

  contactUs(e)
  {
    if ( e ) {
      e.preventDefault();
    }
    let results;
    let email = '';
    let fname = '';
    let lname = '';
    let subject = this.elms.subject.value;
    let message = this.elms.message.value;

    if(!subject){
      this.setState({response: "What subject would you like to send feedback about?"} );
      return;
    }
    if(!message){
      this.setState({response: "What's the message?"} );
      return;
    }

    this.setState({response: "Sending ...."});

    window.socket.emit('send contact us', email, fname,  lname, subject, message, response => {
      //onsole.info("contactUs response:", response);
      if ( response && response.error ) {
        let { error } = response;

        this.setState({ response : error });
      }
      else {
        this.setState({ response : 'Message sent! Looking forward to reading it' });
        setTimeout(()=>this.setState({open: false, width: 0, height: 0, response: null}),1000);  // affer a second close the comment window
      }
    });
  }

  openClose(e){
        var willOpen=!this.state.open;
        var newState={open: willOpen};
        if(!willOpen){
            newState.width=0;
            newState.height=0;
        }
        this.setState(newState,()=>{
            if(willOpen) 
                this.elms.message.value='url: '+window.location.href+'\n\n';
            else
                this.state.response=''; // clear the response;
        });
  }

  openForm(e){
      if(e){
          let rect=e.getBoundingClientRect();
          this.setState({width: rect.width, height: rect.height})
      }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render() {
    const {className, classes}=this.props;
    let w,h,panelClass='Landscape';
    if(typeof document !== 'undefined'){
        w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        if(h>w) panelClass = 'Portrait';
    }

    var feedbackForm=()=>{ // not a function so 'this' is inherited from caller
        return(
            <div className={classes.wrapper} ref={this.openForm}>
                <div className={classes.form}>
                    <p>Tell us what you like, tell us what you don't like, that's what helps us make this even better. Your feedback is appreciated.</p>
                    <input ref={(e)=>{e ? this.elms.subject=e : null}} className={classes.subject} type="text" placeholder="Subject" />
                    <textarea ref={(e)=>{e ? this.elms.message=e : null}} className={classes.message} type="text" placeholder="Message" />
                    <div style={this.state.response ? {display: "block"} : {display: "none"} }>{this.state.response}</div>
                    <div className={classes.buttonRow}>
                        <button className={classes.cancelButton} onClick={()=>{this.setState({open: false, width: 0, height: 0})}} name="Cancel">Cancel</button>
                        <button className={classes.button} onClick={this.contactUs.bind(this)} name="Send Feedback">Send Feedback</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{bottom: this.state.height * 1.05}} className={cx(classes['default'+panelClass], this.state.open ? classes['open'+panelClass] : null, className)} title="Comments? Critical Feedback? Complaints? Great! I can't wait to see them.">
            <i className={cx('fas', 'fa-comment-alt', classes.icon, classes.base)} onClick={this.openClose} />
            <i className={cx('far', 'fa-comment-alt', classes.icon, classes.border)} onClick={this.openClose} />
            <i className={cx("far", "fa-thumbs-up", classes.icon, classes.center)} onClick={this.openClose} />
            {this.state.open ? feedbackForm() : null}
        </div>
    );
  }
}

export default injectSheet(styles)(SiteFeedback);

