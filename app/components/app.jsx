'use strict';

import React from 'react';
import { hot } from 'react-hot-loader'
import AskWebRTC from './ask-webrtc'
import WebComponent from '../components/web-components'
import Footer from './footer'
import SiteFeedback from './site-feedback'

class App extends React.Component {
    render(){
        if(this.props.path==='/')
            return(<AskWebRTC /> );
        else if(this.props.iota) {
            var {iota, ...newProps}=this.props;
            Object.assign(newProps, this.props.iota);
            return(
                <div  style={{position: "relative"}}>
                    <WebComponent webComponent={this.props.iota.webComponent} {...newProps}/>
                    <Footer/>
                    <SiteFeedback />
                </div>);
        } else
            return(
                <div style={{position: "relative"}}>
                    <div>Nothing Here</div>
                    <Footer/>
                    <SiteFeedback />
                </div>)
            ;
    }
}

export default hot(module)(App)
