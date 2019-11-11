'use strict';

import React from 'react';
import Color from 'color'
//
// can't not use react-css here because we can't export the select, getter and setter methods.
//
const classes=['small','medium','large','block']; // global styles that can be turned on with props


export default class Input extends React.Component {
  constructor(props){
    super(props);
    this.state={value: this.props.defaultValue||''};
    this.onChangeHandler=this.onChangeHandler.bind(this)
    this.getInputRef=this.getInputRef.bind(this)
    if(this.props.value!=='undefined') console.error(this.constructor.name, "should not be passed value, use default value");
  }

  onChangeHandler(e){
    let value=e.target && e.target.value;
    if(value !== this.state.value){
      this.state.value=value;
      this.forceUpdate(); // need to force state change before propagating the info up - because it comes back down to componentWillReceiveProps that won't have the new state
    }
    if(this.props.onChange) this.props.onChange({value})
  }

  select(){
    console.warn(this.constructor.name, "should use .focus()");
    return this.inputRef.focus();
  }

  focus(){
    return this.inputRef.focus();
  }

  componentWillReceiveProps(newProps){
    var defaultValue=newProps.defaultValue||'';
    if((defaultValue !== (this.props.defaultValue||'')) && (defaultValue !== this.state.value)){ // if the defaultValue has changed since the previous one, and if it is different than the current state
      this.setState({value: defaultValue, wink: true})
      setTimeout(()=>this.setState({wink: false}), 1000)
    }
  }

  getInputRef(e){
    if(e){
      this.inputRef=e;
      this.winkColor=Color(window.getComputedStyle(e)['background-color']).darken(0.25);
    }
  }

  winkStyle(){
    return this.state.wink ? Object.assign({}, this.props.style, {transition: 'background-color 0.5s linear', backgroundColor: this.winkColor}) : Object.assign({},this.props.style, {transition: 'background-color 0.5s linear'});
  }

  render () {
    let classNames=this.props.className && this.props.className.split(' ') || []
    const {className, onChange, value, style, defaultValue, ...inputProps}=this.props;

    classes.forEach(key=>{
      if(this.props[key]){
        classNames.push(classes[key]);
        delete inputProps[key];
      }
    })

    return (
      <input type={this.props.type || "text"}  { ...inputProps } className={ classNames.join(' ') } onChange={this.onChangeHandler} value={this.state.value} ref={this.getInputRef} style={this.winkStyle()} />
    );
  }
}

Object.defineProperty(Input.prototype,'value',{
  get: function () {
    return this.state.value;
  },
  set: function (v) {
    if(this.state.value !== v)
      this.setState({value: v})
  }
})
