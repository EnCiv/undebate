'use strict';

import React from 'react';

export default class DebugOverlay extends React.Component {
    constructor(props){
        super(props);
        this.debug=React.createRef();
        this.state={enable: !!this.props.enable}
    }
    enable(enable){
        this.setState({enable})
    }
    info(str){
        if(this.debug.current) this.debug.current.innerText=str+'\n'+this.debug.current.innerText;
    }
    render(){
        const {enable}=this.state;
        return(<div className='debug-overlay' style={{display: enable ? 'block' : 'none', position: 'fixed', top: 0, left: 0, whiteSpace: 'pre-wrap', width: '100vw', height: '100vh', padding: '2em', background: '#ffffff00', pointerEvents: 'none', zIndex: 100}} ref={this.debug}></div>)
    }
}