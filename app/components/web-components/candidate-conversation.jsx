'use strict';

import React from 'react';
import injectSheet from 'react-jss'
import cx from 'classnames'
import Join from '../join'
import through2 from 'through2'
import Input from '../lib/input'
import Icon from '../lib/icon';

import ErrorBoundary from '../error-boundary';

import TimeFormat from 'hh-mm-ss'
import cloneDeep from 'lodash/cloneDeep';
import getYouTubeID from 'get-youtube-id';
import Preamble from '../preamble';
import Config from '../../../public.json'

const ResolutionToFontSizeTable=require('../../../resolution-to-font-size-table').default;

const TransitionTime=500;
const TopMargin=0
const IntroTransition= "all 5s ease"
const HDRatio=1080/1920; //0.5625
const ShadowBox=10;

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import IconPrevSpeaker from '../../svgr/icon-prev-speaker'
import IconPrevSection from '../../svgr/icon-prev-session'
import IconPlay from '../../svgr/icon-play'
import IconPause from '../../svgr/icon-pause'
import IconSkipSpeaker from '../../svgr/icon-skip-speaker'
import IconNextSection from '../../svgr/icon-skip-session'
import IconRedo from '../../svgr/icon-redo'
import IconFinishRecording from '../../svgr/icon-finish-recording'
import IconRecording from '../../svgr/icon-recording'

import ConversationHeader from '../conversation-header'

function promiseSleep(time){
    return new Promise((ok,ko)=>setTimeout(ok,time))
}

// this is where we should use a theme but for now
const BLUE='#1B47A7'
const YELLOW='#E5A650'
const styles = {
    'scrollableIframe': {},
    'wrapper': {
        width: "100vw",
        height: "100vh",
        "&$scrollableIframe": {
            height: "auto"
        }
    },
    innerWrapper: {
        position: 'relative', 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: 'white',//"#F2F2F1", 
        backgroundSize: "cover", 
        overflow: 'hidden', 
        fontFamily: "'Libre Franklin','Montserrat', sans-serif",
        "&$scrollableIframe": {
            height: "auto"
        }
    },
    innerImageOverlay: {
        pointerEvents: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh', 
        backgroundImage: "url(https://res.cloudinary.com/hf6mryjpf/image/upload/v1572029099/experienced-candidate-conversations-960x492_mworw9.png)", 
        opacity: 0.1,
        backgroundSize: "cover", 
        overflow: 'hidden', 
        fontFamily: "`Libre Franklin`, 'Montserrat', sans-serif",
        'transition': `all ${TransitionTime}ms linear`,
        "&$scrollableIframe": {
            height: "auto"
        },
        "&$intro": {
            opacity: 0
        }
    },
    'participant': {
        'display': 'block',
        position: 'absolute',
        top: 0,
        left: 0,
        '&$stylesSet': {
            'transition': `all ${TransitionTime}ms linear`,
        },
        '&$begin': {
            transition: `${IntroTransition}`
        }
    },
    'participantBackground': {
        'display': 'block',
        position: 'relative',
        textAlign: 'center',
        backgroundColor: 'white',//'#dbdfe0',  // this color is taken to match the the background image if you change the image, you should re-evaluate this color
        '&$stylesSet': {
            'transition': `all ${TransitionTime}ms linear`,
        },
        '&$begin': {
            transition: `${IntroTransition}`
        }
    },
    'box': {
        'display': 'inline',
        'vertical-align': 'top',
        'position': 'absolute',
        // 'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px gray`,
        '&$stylesSet': {
            'transition': `all ${TransitionTime}ms linear`,
        },
        '&$begin': {
            transition: `${IntroTransition}`
        }
    },
    introTitle: {
        'display': 'table-row',
        'verticalAlign': 'top',
        'fontSize': '133%',
        'height': 'fit-content',
        'width': '100%',
        '&$intro': {
            top: '-100vh'
        },
        '& h1': {
            paddingTop: '0.5em',
            margin: 0,
            textAlign: 'center'
        }
    },
    introBox: {
        'display': 'table-row',
        'verticalAlign': 'middle',
        '&$intro': {
            top: '-100vh'
        }
    },
    introInner: {
        'display': 'table-cell',
        'verticalAlign': 'middle'
    },
    outerBox: {
        'display': 'block',
        width: '100vw',
        height: '100vh',
        boxSizing: 'border-box',
        "&$scrollableIframe": {
            height: "auto",
            minHeight: "100vh"
        }
    },
    beginBox: {
        position: 'absolute',
        top: 0
    },
    introPane: {
        position: 'absolute',
        left: '25vw',
        top: 0,
        width: "50%",
        height: "100%",
        display: "table",
        '&$begin': {
            transition: `${IntroTransition}`
        },
        '&$intro': {
            top: '100vh'
        }
    },
    beginButton: {
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.25em',
        'padding': '1em',
        'margin-top': '1em'
    },
    hangUpButton: {
        width: '12vw',
        position: 'absolute',
        left: '85vw',
        bottom: '5vh',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff6745 0%,#ff5745 51%,#ff4745 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.25em',
        'padding': '1em'
    },
    'finishButton': {
        width: '12vw',
        position: 'absolute',
        right: '25vw',
        top: '68vh',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.25em',
        'padding': '1em',
        '&:disabled': {
            'text-decoration': 'none',
            'background': 'lightgray'
        }
    },
    'rerecordButton': {
        width: '12vw',
        position: 'absolute',
        left: '25vw',
        top: '68vh',
        color: 'white',
        background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
        'border-radius': '7px',
        'border-width': '2px',
        'border-color': 'white',
        'font-size': '1.25em',
        'padding': '1em',
        '&:disabled': {
            'text-decoration': 'none',
            'background': 'lightgray'
        }
    },
    'talkative': {
        background: 'yellow'
    },
    'title': {
        'text-align': 'center',
        'color': 'white',
        'font-weight': '600',
        'font-size': '2rem',
        'padding-top': '0.25rem',
        'padding-bottom': '0.25rem',
        'background-color': 'black',
        'overflow': 'hidden',
        'text-overflow': 'ellipsis',
        'white-space': 'nowrap',
        'lineHeight': '3rem',
        '&span': {
            verticalAlign: "middle"

        },
        '&$finishUp': {
            'font-size': '1%'
        },
        '&$stylesSet': {
            'transition': `all ${TransitionTime}ms linear`,
        }
    },
    'agenda': { 
        'textAlign': 'center',
        'backgroundColor': 'white',
        position: 'absolute',
        'box-shadow': '0px 4px 4px rgba(0,0,0,0.25)',
        'box-sizing': 'border-box',
        'font-weight': '600',
        display: 'table',
        '&$finishUp': {
            left: "50vw",
            top: "50vh",
            height: '1vh',
            width: '1vw',
            'font-size': '1%'
        },
        '&$stylesSet': {
            'transition': `all ${TransitionTime}ms linear`,
        },
        '&$begin': {
            transition: `${IntroTransition}`
        },
        '&$intro': {
            top: `calc( -1 * 25vw *  ${HDRatio} -${TopMargin})`,
            left: '100vw'
        }
    },
    'innerAgenda': {
        'display': 'table-cell'
    },
    'agendaTitle': {
        fontFamily: 'Libre Franklin',
        'textAlign': 'center',
        'font-size': "2rem",
        'backgroundColor': `${YELLOW}`,
        'paddingTop': '1rem',
        'paddingBottom': '1rem',
        'font-weight': 'bold'
    },
    'agendaList': {
        textAlign: 'left',
        'padding': '0',
        listStyleType: 'none',
        '& li:first-child': {
            fontWeight: 'bold'
        }
    },
    'agendaItem': {
        'margin-block-start': '0',
        'textAlign': 'left',
        'lineHeight': '2rem',
        'font-weight': '200',
        'list-style-type': "none",
        'paddingLeft': '0',
    },
    'agenda-icon-left':{
        border: 'none',
        backgroundColor: 'transparent',
        marginLeft: "0.5rem",
        display: "inline-block",
        float: "left",
        cursor: "pointer",
        fontSize: "100%"
    },
    'agenda-icon-right': {
        border: 'none',
        backgroundColor: 'transparent',
        marginRight: "0.5rem",
        display: "inline-block",
        float: "right",
        cursor: "pointer",
        fontSize:"100%"
    },
    'item': {
        fontFamily: 'Roboto',
        fontSize: '2rem',
        fontWeight: 'normal',
        'backgroundColor': 'white',
        'padding': '1rem',
        'border-bottom': '1px solid lightGray',
        'padding-top': '0.5rem',
        'padding-bottom': '0.25rem'
    },
    'thanks': {
        'font-size': "200%",
        'font-weight': '600',
        "&$scrollableIframe": {
            display: 'block',
            paddingTop: "0.5em",
            paddingBottom: "0.5em"
        }
    },
    'thanks-link': {
        'font-size': "150%",
    },
    'begin': {
        transition: `${IntroTransition}`
    },

    'join': {
        'margin-right': '1em',
        'button&': {
            'margin-left': '1em',
            'padding-top': '0.5em',
            'padding-bottom': '0.5em',
            '&:disabled': {
                'text-decoration': 'none',
                'background': 'lightgray'
            }
        },
        'a&': {
            'margin-right': '0.25em'
        },
        'i&': {
            'margin-right': 0
        }
    },
    'name': {
        'fontSize': '1.25em'
    },
    'counting': {},
    'countdown': {
        display: 'none',
        position: 'absolute',
        color: 'yellow',
        'fontSize': '2em',
        left: 'calc( 50vw - 1em)',
        top:  '10vh',
        transition: '0.5s all linear',
        background: 'rgba(0,0,0,0)',
        '&$counting': {
            display: 'block',
        },
        '&$talkative': {
            left: 'calc( 50vw - 1em)',
            'fontSize': '4em',
            background: 'rgba(128,128,128,0.7)'
        }
    },
    "buttonBar": {
        //display: "table",
        'textAlign': "center",
        position: "absolute",
        width: "50vw",
        left: "25vw",
        top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
        height: "3.5vh",
        overflow: "hidden",
        "text-overflow": "clip",
        '& button': {
            "display": "inline-block",
            "verticalAlign": "top",
            'height': "100%",
            'width': "100%",
            'fontSize': 'inherit',
            'textAlign': "center",
            '-webkit-appearance': 'none',
            // 'border-radius': "1px",
            'backgroundColor': 'rgba(0, 0, 0, 0)',
            'overflow': 'hidden',
            'textOverflow': 'clip',
        }
    },    
    "recorderButtonBar": {
        //display: "table",
        position: "absolute",
        width: "50vw",
        left: "25vw",
        top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
        height: "3.5vh",
        overflow: "hidden",
        "text-overflow": "clip",
        '& button': {
            "display": "inline-block",
            "verticalAlign": "middle",
            'height': "100%",
            'width': "100%",
            'fontSize': 'inherit',
            'textAlign': "center",
            '-webkit-appearance': 'none',
            'border-radius': "1px",
            //'backgroundColor': 'lightgray',
            'overflow': 'hidden',
            'textOverflow': 'clip',
            color: 'white',
            background: 'linear-gradient(to bottom, #ff8f00 0%,#ff7002 51%,#ff7002 100%)',
            'border-radius': '7px',
            'border-width': '2px',
            'border-color': 'white',
            'font-size': '1.25em',
            //'padding': '1em',
            '&:disabled': {
                'text-decoration': 'none',
                'background': 'lightgray'
            }
        },
        '& div':{
            "display": "inline-block",
            "verticalAlign": "top",
            'height': "100%",
            'width': "100%",
            '-webkit-appearance': 'none',
            background: 'transparent',
        }
        
    },
    "intro": {},
    'note': {
        position: 'absolute',
        'background-color': 'lightyellow',
        top: 'calc( 50vh - (25vw / 2) )', // yes vh - vw because the box is square
        padding: '1em',
        width: '25vw',
        height: '25vw', // yes vw because it's supose to be square
        'box-shadow': `${ShadowBox}px ${ShadowBox}px ${ShadowBox}px grey`,
        //transform: 'rotate(-2deg)',
        //'font-family': 'Comic Sans MS',
        left: 'calc( 50vw - (25vw / 2))',
        'font-weight': '600',
        'font-size': '125%',
        display: 'table',
        'transition': 'all .5s linear',
        '&$finishUp': {
            left: 'calc(100vw / 2)',
            top: `calc(((50vw + 15vw) *  ${HDRatio} + 5vh + 1.5vw + ${TopMargin}) / 2)`,
            height: '1vh',
            width: '1vw',
            'font-size': '1%'
        },
        '&$begin': {
            transition: `${IntroTransition}`
        },
        '&$intro': {
            top: `calc( -100vh)`,
            left: '100vw'
        }
    },
    finishUp: {},
    stylesSet: {},
    stalledOverlay: {
        position: 'absolute',
        top: 0,
        display: 'none',
        backgroundColor: 'rgba(255,255,255,0.8)',
        '&$stalledNow': {
            display: 'table'
        },
        '& $stalledBox': {
            display: 'table-cell',
            verticalAlign: 'middle',
            textAlign: 'center'
        }
    },
    stalledNow: {},
    stalledBox: {}
}

const seating = ['speaking', 'nextUp', 'seat2','seat3','seat4', 'seat5', 'seat6', 'seat7']
const seatToName={
    speaking: "Speaking",
    nextUp: "Next Up",
    seat2: "Seat #2",
    seat3: "Seat #3",
    seat4: "Seat #4",
    seat5: "Seat #5",
    seat6: "Seat #6",
    seat7: "Seat #7"
}



class CandidateConversation extends React.Component {
    render() {
        return (
            <ErrorBoundary>
                <RASPUndebate {...this.props} />
            </ErrorBoundary>
        )
    }
}

function supportsVideoType(type) {
    let video;
  
    // Allow user to create shortcuts, i.e. just "webm"
    let formats = {
      ogg: 'video/ogg; codecs="theora"',
      mp4: 'video/mp4; codecs="avc1.42E01E"',
      webm: 'video/webm; codecs="vp8, vorbis"',
      vp9: 'video/webm; codecs="vp9"',
      hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
    };
  
    if(!video) {
      video = document.createElement('video')
    }
  
    return video.canPlayType(formats[type] || type);
  }

  function onYouTubeIframeAPIReady() {  // this is called by the https://www.youtube.com/iframe_api script, if and after it is loaded
      logger.trace("onYouTubeIframeAPIReady", RASPUndebate.youTubeIFameAPIReady, RASPUndebate.onYouTubeIframeAPIReadyList.length);
      RASPUndebate.youTubeIFameAPIReady;
      while(RASPUndebate.onYouTubeIframeAPIReadyList.length){
          RASPUndebate.onYouTubeIframeAPIReadyList.shift()();
      }
  }

  if(typeof window !== "undefined") window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

class RASPUndebate extends React.Component {
    static onYouTubeIframeAPIReadyList=[];
    retries={};
    requestPermissionElements = [];
    uploadQueue=[];
    preFetchList=[];
    youtubePlayers=[];
    rerecord=false;
    constructor(props) {
        super(props);
        if(typeof window !== 'undefined'){
            this.startTime=Date.now();
            if(window.env==='development')
                this.rotateButton=true;
        } else {
            if(process.env.NODE_ENV==='development')
                this.rotateButton=true;
        }
        //this.createDefaults();
        this.human = React.createRef();
        this.moderator = React.createRef();
        this.audience1 = React.createRef();
        this.audience2 = React.createRef();
        this.audience3 = React.createRef();
        this.audience4 = React.createRef();
        this.audience5 = React.createRef();
        this.audience6 = React.createRef();
        this.audience7 = React.createRef();
        this.audio=React.createRef();
        this.audioEnd=this.audioEnd.bind(this);
        this.calculatePositionAndStyle=this.calculatePositionAndStyle.bind(this);
        this.requestPermission=this.requestPermission.bind(this);
        this.beginButton=this.beginButton.bind(this);
        this.keyHandler=this.keyHandler.bind(this);
        this.hangup=this.hangup.bind(this);
        if(typeof window !== 'undefined')
            window.onresize=this.onResize.bind(this);
        this.participants={};
        /*
        if(props.browserConfig && props.browserConfig.browser.name==='safari'){
            if(props.participants.human && typeof MediaRecorder === 'undefined'){
                this.canNotRecordOnSafari=true; // Safari does not support the recorder
            } else 
                this.forceMP4=true;  // safari says it supportsVideoType webm but it DOES NOT for video playback - it says it does for WebRTC
        }*/
        if(typeof window !== 'undefined'){
            if(!supportsVideoType('webm')){
                if(supportsVideoType('mp4'))
                    this.forceMP4=true;
                else
                    this.canNotRecordOnSafari=true;
            }
            if(props.participants.human){
                if(typeof MediaRecorder === 'undefined')
                    this.canNotRecordOnSafari=true;
            }
        }
        var loadYoutube=false;
        if(!this.canNotRecordOnSafari){
            Object.keys(this.props.participants).forEach(participant=>{
                let youtube=false;
                if(participant !== 'human' && this.props.participants[participant].listening.match(/youtu\.be|youtube\.com/)){  // the whole participant is marked youtube if listening is youtube
                    youtube=true;
                    loadYoutube=true;
                } else if(this.forceMP4 && participant!=='human') {
                    this.props.participants[participant].listening=this.props.participants[participant].listening.replace(/\.webm$/gi,'.mp4');
                    this.props.participants[participant].speaking=this.props.participants[participant].speaking.map(url=>url.replace(/\.webm$/gi,'.mp4'));
                }
                this.participants[participant]={        
                    speakingObjectURLs: [],
                    speakingImmediate: [],
                    listeningObjectURL: null,
                    listeningImmediate: false,
                    placeholderUrl: participant!=='human' && this.props.participants[participant].listening.split('/').reduce((acc,part)=>acc + (acc ? '/' : '') + part + (part==='upload' ? '/so_0' : ''),'').split('.').reduce((acc,part)=>part==='webm'||part==='mp4'?acc+'.png':acc+(acc?'.':'')+part,''),
                    youtube
                }
                if(participant==='human') {
                    this.participants.human.speakingBlobs=[];
                }
            })
        }else{
            this.participants={};
        }
        this.numParticipants=Object.keys(this.props.participants).length;
        this.startRecorderState={state: "READY"}; //"BLOCK", "QUEUED"
        this.audioSets={}
        this.newUser= !this.props.user;  // if there is no user at the beginning, then this is a new user - which should be precistant throughout the existence of this component
        if(typeof window !== 'undefined' && window.screen && window.screen.lockOrientation ) window.screen.lockOrientation('landscape');
        if(typeof window !== 'undefined' && loadYoutube){
            if(!RASPUndebate.youTubeIFameAPIReady){
                if(RASPUndebate.onYouTubeIframeAPIReadyList.length==0){
                    var tag = document.createElement('script');
                    tag.src = "https://www.youtube.com/iframe_api";
                    var firstScriptTag = document.getElementsByTagName('script')[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                }
                RASPUndebate.onYouTubeIframeAPIReadyList.push(this.onYouTubeIframeAPIReady.bind(this));
            }
        }
        let fontSize,width,height;

        if(this.props.browserConfig.type==='bot') {// running on a bot
            width=1200; //Facebook image post size: 1200 x 900
            height=900;
        } else {
            width=1920;
            height=1080;
        }
        if(typeof window!== 'undefined')
            fontSize=this.calcFontSize();
        else 
            fontSize=this.estimateFontSize(width,height)
        
        // we need to calculate the position of everything if/or as if rendered on the server. Then in componentDidMount we can calculate based on the real size.  This is because react.hydrate needs to be able to match the serverside and the browser side
        let calculatedStyles=this.calculateStyles(width,height,height,fontSize);
        Object.assign(this.state,calculatedStyles,{fontSize});
    }

    state = {
        errorMsg: '',
        seatOffset: 0,
        round: 0,
        countDown: 0,
        moderatorReadyToStart: false,
        stylesSet: false,
        intro: false,
        begin: false,

        seatStyle: {
            'speaking': {
                left: 'calc(2.5vw + 20vw + 2.5vw)',
                top: `${TopMargin}`,
                width: '50vw'
            },
            'nextUp': {
                left: '2.5vw',
                top: `calc( (50vw - 20vw) *  ${HDRatio} + ${TopMargin})`,
                width: '20vw',
            },
            'seat2': {
                left: 'calc(1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + ${TopMargin})`,
                width: '15vw',
            },
            'seat3': {
                left: 'calc(1.25vw + 15vw + 1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
                width: '15vw',
            },
            'seat4': {
                left: 'calc(1.25vw + 15vw + 1.25vw + 15vw + 1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
                width: '15vw',
            },
            'seat5': {
                left: 'calc(3 * (1.25vw + 15vw) + 1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
                width: '15vw',
            },
            'seat6': {
                left: 'calc(4 * (1.25vw + 15vw) + 1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
                width: '15vw',
            },
            'seat7': {
                left: 'calc(5 * (1.25vw + 15vw) + 1.25vw)',
                top: `calc(50vw *  ${HDRatio} + 5vh + 5.5vh + ${TopMargin})`,
                width: '15vw',
            },
            'finishUp': {
                left: 'calc(100vw / 2)',
                top: `calc(((50vw + 15vw) *  ${HDRatio} + 5vh + 1.5vw + ${TopMargin}) / 2)`,
                width: '1vw'
            },
        },

        agendaStyle: {
            top: '8vh',
            width: '17.5vw',
            height: '17.5vw',
            left: 'calc(2.5vw + 20vw + 2.5vw + 50vw + 2.5vw)',
        },

        buttonBarStyle: {
            width: "50vw",
            left: "25vw",
            top: `calc(50vw *  ${HDRatio} + 3.5vh)`,
            height: "auto",
            position: "absolute",
            overflow: "hidden",
            "textOverflow": "clip",
            'cursor': 'pointer'
        },

        recorderButtonBarStyle: {
            width: "50vw",
            left: "25vw",
            top: `calc(50vw *  ${HDRatio} + 3.5vh + 3.5vh + 1.75vh)`,
            height: "3.5vh",
            position: "absolute",
            overflow: "hidden",
            "textOverflow": "clip",
        },

        introSeatStyle: {
            'speaking': {
                top: `-30vw`
            },
            'nextUp': {
                left: '-20vw'
            },
            'seat2': {
                left: '-20vw'
            },
            'seat3': {
                top: '100vw'
            },
            'seat4': {
                top: '130vw'
            },
            'seat5': {
                top: '150vw'
            },
            'seat6': {
                top: '170vw'
            },
            'seat7': {
                top: '190vw'
            },
            'finishUp': {},
    
            agenda: {
                top: `calc( -1 * 25vw *  ${HDRatio} -${TopMargin})`,
                left: '100vw'
            },
            introLeft:{
                left: "-50vw"

            },
            introRight: {
                right: "-50vw"

            },
            introTopLeft: {
                top: "-50vh"

            },
            introTopRight: {
                top: "-50vh"

            }
        },

        introStyle: {
            introLeft: {
                //transition: `${IntroTransition}`,
                position: 'absolute', 
                left: '0vw', 
                top: '25vh',
                width: "auto", 
                height: "50vh"
            },
            introRight: {
                //transition: `${IntroTransition}`,
                position: 'absolute', 
                right: '0vw', 
                top: '25vh',
                width: "auto", 
                height: "50vh"
            },
            introTopLeft: {
                //transition: `${IntroTransition}`,
                position: 'absolute', 
                left: '5vw', 
                top: '0vh',
                width: "20vw",
                height: "auto"
            },
            introTopRight: {
                //transition: `${IntroTransition}`,
                position: 'absolute', 
                left: '70vw', 
                top: '0vh',
                width: "20vw",
                height: "auto"
            },
        }
    }

    componentDidMount() {
        if(this.startTime) {
            this.loadTime=Date.now() -this.startTime;
            logger.trace("loadTime",this.loadTime);
            if(this.loadTime>1000)
                this.setState({slowInternet: true})
        } 

        if(!this.canNotRecordOnSafari){
            if(window.MediaSource && this.props.participants.human){
                this.mediaSource = new MediaSource();
                this.mediaSource.addEventListener('sourceopen', this.getCamera.bind(this), false);
            }

            // first load the moderator's speaking part and the listening part for all the participants;
            Object.keys(this.props.participants).forEach(participant=>{
                if(participant==='human') return; 
                this.preFetchObjectURL(participant,participant==='moderator',0); 
            })
            this.preFetchObjectURL('moderator',false,0); // then load the moderator's listening parts 
            if(this.props.audio) this.preFetchAudio(this.props.audio);
            let i;
            for(i=0;i<this.props.participants.moderator.speaking.length;i++){ // then load the rest of the speaking parts
                Object.keys(this.props.participants).forEach(participant=>{
                    if(participant==='moderator'&&i===0) return; // moderator's first speaking part was loaded first
                    if(participant==='human') return; 
                    if(this.props.participants[participant].speaking[i])
                    this.preFetchObjectURL(participant,true,i);
                })
            }
        }
    }

    onYouTubeIframeAPIReady(){
        const seatStyle=this.state.seatStyle;
        const innerWidth=typeof window!== 'undefined' ? window.innerWidth : 1920;
        Object.keys(this.participants).forEach((participant,i)=>{
            if(this.participants[participant].youtube){
                const videoId=getYouTubeID(this.props.participants[participant].listening);
                logger.trace("Undebate.onYouTubeIframeAPIReady new player for:", participant, videoId)
                try {
                    this.youtubePlayers[participant] = new YT.Player('youtube-'+participant, {
                        width: pxSeatStyleWidth(this.seat(i)),
                        height: pxSeatStyleWidth(this.seat(i)) * HDRatio,
                        style: {fontSize: '8px'},
                        videoId,
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            disablekb: 1,
                            enablejsapi: 1,
                            fs: 0,
                            loop: 1,
                            playlist: videoId, // needed so loop will work
                            modestbranding: 1,
                            branding: 0,
                            playsinline: 1,
                            rel: 0,
                            origin: window.location.host,
                            showinfo: 0
                        },
                        events: {
                            'onReady': this.onYouTubePlayerReady.bind(this, participant),
                            'onStateChange': this.onYouTubePlayerStateChange.bind(this, participant),
                            'onError': (e)=>{
                                logger.error("Undebate.onYouTubeIframeAPIReady onError",participant, e.data)    
                            }
                        }
                    });
                    logger.trace("Undebate.onYouTubeIframeAPIReady new Player completed")
                }
                catch (error) {
                    logger.error("Undebate.onYouTubeIframeAPIReady caught error on new YT.Player", error.name, error.message);
                }
            }
        })
    }

    onYouTubePlayerReady(participant,event){
        let iframe=document.getElementById("youtube-"+participant);
        iframe.style.width="inherit" // after youtube has loaded, go and find the iframe and set these so that it will grow and shrink like we want
        iframe.style.height="inherit"

        event.target.mute();
        let playerState=event.target.getPlayerState();
        logger.trace("onYouTubePlayerReady",participant, event.data, playerState);
        if(playerState===YT.PlayerState.CUED)
            event.target.playVideo();
    }

    onYouTubePlayerStateChange(participant,event){
        logger.trace("onYouTubePlayerStateChange", participant,event.data);
        let chair=this.seat(Object.keys(this.props.participants).indexOf(participant));
        if(event.data===YT.PlayerState.ENDED) {
            if(chair==='speaking')
                this.autoNextSpeaker();
            else
                this.youtubePlayers[participant].seekTo(0,false);
        }
    }

    componentWillUnmount() {
        if(this.keyEventListener) window.removeEventListener('keydown',this.keyHandler)
        this.stopRecording();
        this.releaseCamera();
    }

    onResize(){
        setTimeout(this.calculatePositionAndStyle, TransitionTime); // have to wait out the transitions
    }

    // take control of the damn font size - set it in the body
    calcFontSize(){
        /*
        let body=document.getElementsByTagName("body")[0];
        let key=Math.max(window.screen.width,window.screen.height)+'x'+Math.min(window.screen.width,window.screen.height)+'x'+window.devicePixelRatio;
        let newFontSize=0;
        if(typeof ResolutionToFontSizeTable[key] === 'number'){
            newFontSize=ResolutionToFontSizeTable[key];
        } else {
            logger.error("Undebate.calcFontSize not found",this.props.browserConfig.type,key, navigator.userAgent)
        }

        if(!newFontSize){
            const fontSize=parseFloat(getComputedStyle(body).fontSize);
            let width=window.innerWidth;
            let height=window.innerHeight;
            newFontSize=this.estimateFontSize(width,height)
        }
        //body.style.fontSize=newFontSize+'px';*/
        //return newFontSize
        return Math.max(window.innerHeight,window.innerWidth)*0.01;
    }

    estimateFontSize(width,height){
        /*
        let newFontSize;
        if(width/height>1){
            newFontSize=height/42; //lines vertically - determined experimentally
            logger.trace("Undebate FontSize:", width, height, newFontSize);
            
        }else{
            newFontSize=height/64; // lines vertically - determined experimentally
            logger.trace("Undebate FontSize:", width, height, newFontSize);
        }
        return newFontSize;
        */
       return Math.max(width,height)*0.1;
    }

    // unlike traditional HTML, we calculate based on screen/viewport size so that everything fits on screen - like on a TV screen
    calculatePositionAndStyle(e){
        if(e) this.topRef=e;
        if(this.topRef){
            if(!this.keyEventListener){
                window.addEventListener('keydown',this.keyHandler);
                this.keyEventListener=true;
            }

            let {x}=this.topRef.getBoundingClientRect();
            let height=window.innerHeight; // on iOS the height of bounding Rect is larger than what's shown because of the address bar
            let width=window.innerWidth;
            let maxerHeight=Math.max(height,window.screen.height); // this looks at the screen heigh which is different than the window/viewport - especially on desktop, and sometimes on smartphone
            const fontSize=this.calcFontSize();
            let calculatedStyles=this.calculateStyles(width,height,maxerHeight,fontSize);
            this.setState({left: -x + 'px',fontSize, ...calculatedStyles});
        }
    }

    calculateStyles(width,height,maxerHeight,fontSizeIn){
        const fontSize=Math.max(width,height)*0.01;//typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.getElementsByTagName("body")[0]).fontSize) : fontSizeIn; // this fontSize is getting rounded or trimmed so don't use the calculated one.
        var seatStyle=cloneDeep(this.state.seatStyle);
        var agendaStyle=cloneDeep(this.state.agendaStyle);
        var buttonBarStyle=cloneDeep(this.state.buttonBarStyle);
        var recorderButtonBarStyle=cloneDeep(this.state.recorderButtonBarStyle);
        var introSeatStyle=cloneDeep(this.state.introSeatStyle);
        var introStyle=cloneDeep(this.state.introStyle);
        const titleHeight=parseFloat(styles.title.lineHeight)*fontSize; // this is define in the title class;
        if(width / height > 1 ){ 
                let speakingWidthRatio=0.65;
                let seatWidthRatio= 0.20;
                const navBarHeight=.06*height;
                const agendaMaxWidth=32*fontSize;
                const vGap=0.5*fontSize; 
                const hGap=0.5*fontSize;

                let calcHeight=navBarHeight+vGap+width*seatWidthRatio*HDRatio+titleHeight+vGap+width*speakingWidthRatio*HDRatio+titleHeight+vGap;
                if(calcHeight>height){ // if the window is really wide - squish the video height so it still fits
                    let heightForVideo=height-navBarHeight-vGap-titleHeight-vGap-titleHeight-vGap;
                    let calcHeightForVideo=width*seatWidthRatio*HDRatio+width*speakingWidthRatio*HDRatio;
                    seatWidthRatio=seatWidthRatio*heightForVideo/calcHeightForVideo;
                    speakingWidthRatio=speakingWidthRatio*heightForVideo/calcHeightForVideo;
                }

                seatStyle.speaking.left= hGap;
                seatStyle.speaking.width= speakingWidthRatio*width;
                seatStyle.speaking.top= navBarHeight+vGap+width*seatWidthRatio*HDRatio+vGap+titleHeight; 
                introSeatStyle.speaking={top: -(speakingWidthRatio * HDRatio * width + vGap + ShadowBox)}

                seatStyle.nextUp.left=hGap;
                seatStyle.nextUp.top= navBarHeight+vGap; 
                seatStyle.nextUp.width= seatWidthRatio * width;
                introSeatStyle.nextUp={left: -(seatStyle.nextUp.left + seatWidthRatio * width + ShadowBox)}

                let seat=2;
                let seatTop=seatStyle.nextUp.top;
                let seatLeft=hGap;
                let seatHorizontalPitch=seatWidthRatio * width + hGap;

                seatLeft+= seatHorizontalPitch; // skip over the nextUp
    
                // across the bottom
                let i=0;  // for calculating the intro
                while(seat<=7){ // some will go off the screen
                    seatStyle['seat'+seat].top=seatTop;
                    seatStyle['seat'+seat].left=seatLeft;
                    seatStyle['seat'+seat].width= seatWidthRatio*width;
                    introSeatStyle['seat'+seat]={top: maxerHeight + i * (seatWidthRatio * HDRatio * width + vGap)} // along the bottom, each seat is further away as you move to the right
                    seatLeft+=seatHorizontalPitch;
                    seat++;
                    i++;
                }
                
                seatStyle.finishUp.left= 0.5*width;
                seatStyle.finishUp.top=  ((0.5 + 0.15)*width * HDRatio + (0.05 + 0.015)*height + TopMargin)/2;
                seatStyle.finishUp.width=0.1*width;

                agendaStyle.top= seatStyle.speaking.top;
                agendaStyle.left= seatStyle.speaking.left + seatStyle.speaking.width + hGap;
                agendaStyle.width=  Math.min(width - agendaStyle.left - hGap, agendaMaxWidth);
                agendaStyle.height=seatStyle.speaking.width*HDRatio+titleHeight;
        
                buttonBarStyle.width= seatStyle.speaking.width*0.6;
                buttonBarStyle.left= seatStyle.speaking.left + seatStyle.speaking.width*0.2;// center it
                buttonBarStyle.top=seatStyle.speaking.top+seatStyle.speaking.width*HDRatio-(buttonBarStyle.width/this.buttons.length*0.75)-vGap; // there are 5 buttons and they are essentially square
                
                recorderButtonBarStyle.left=seatStyle.speaking.left;
                recorderButtonBarStyle.top= seatStyle.speaking.top+seatStyle.speaking.width*HDRatio+vGap;
                recorderButtonBarStyle.width=seatStyle.speaking.width;
                recorderButtonBarStyle.height= buttonBarStyle.height;

                introStyle.introLeft.width="auto";
                introStyle.introLeft.height="50vh";
                introSeatStyle.introLeft.left="-50vw";

                introStyle.introRight.width="auto";
                introStyle.introRight.height="50vh";
                introSeatStyle.introRight.right="-50vw";
        } else { // portrait mode
            let speakingWidthRatio=0.65;
            let seatWidthRatio= 0.4;
            const navBarHeight=.06*height+3*fontSize;
            const agendaMaxWidth=32*fontSize;
            const vGap=0.5*fontSize; 
            const hGap=0.5*fontSize;
            const maxAgendaHeight=fontSize*20;

            seatStyle.nextUp.left=hGap;
            seatStyle.nextUp.top= navBarHeight+vGap; 
            seatStyle.nextUp.width= seatWidthRatio * width;
            introSeatStyle.nextUp={left: -(seatStyle.nextUp.left + seatWidthRatio * width + ShadowBox)}

            let seat=2;
            let seatTop=seatStyle.nextUp.top;
            let seatLeft=hGap;
            let seatHorizontalPitch=seatWidthRatio * width + hGap;

            seatLeft+= seatHorizontalPitch; // skip over the nextUp

            // across the bottom
            let i=0;  // for calculating the intro
            while(seat<=7){ // some will go off the screen
                seatStyle['seat'+seat].top=seatTop;
                seatStyle['seat'+seat].left=seatLeft;
                seatStyle['seat'+seat].width= seatWidthRatio*width;
                introSeatStyle['seat'+seat]={top: maxerHeight + i * (seatWidthRatio * HDRatio * width + vGap)} // along the bottom, each seat is further away as you move to the right
                seatLeft+=seatHorizontalPitch;
                seat++;
                i++;
            }

            seatStyle.speaking.left= hGap;
            seatStyle.speaking.top= navBarHeight+vGap+ seatWidthRatio*width*HDRatio +titleHeight + vGap;
            seatStyle.speaking.width= width - 2*hGap;
            introSeatStyle.speaking={top: -(speakingWidthRatio * HDRatio * width + vGap + ShadowBox)}

            seatStyle.finishUp.left= 0.5*width;
            seatStyle.finishUp.top=  0.5*height;
            seatStyle.finishUp.width=0.01*width;

            agendaStyle.top=seatStyle.speaking.top+seatStyle.speaking.width*HDRatio+titleHeight+vGap;
            agendaStyle.left=seatStyle.speaking.left;
            agendaStyle.width=seatStyle.speaking.width;
            agendaStyle.height= Math.min(maxAgendaHeight,height-agendaStyle.top-vGap);
            introSeatStyle['agenda']={top: -(agendaStyle.top + agendaStyle.height + ShadowBox), left: width}

            buttonBarStyle.width= seatStyle.speaking.width*0.6;
            buttonBarStyle.left= seatStyle.speaking.left + seatStyle.speaking.width*0.2;// center it
            buttonBarStyle.top=seatStyle.speaking.top+seatStyle.speaking.width*HDRatio-(buttonBarStyle.width/this.buttons.length*0.75)-vGap; // there are 5 buttons and they are essentially square
            
            recorderButtonBarStyle.left=seatStyle.speaking.left;
            recorderButtonBarStyle.top= seatStyle.speaking.top+seatStyle.speaking.width*HDRatio+vGap;
            recorderButtonBarStyle.width=seatStyle.speaking.width;
            recorderButtonBarStyle.height= buttonBarStyle.height;

            introStyle.introLeft.width="25vw";
            introStyle.introLeft.height="auto";
            introSeatStyle.introLeft.left="-50vw";

            introStyle.introRight.width="25vw";
            introStyle.introRight.height="auto";
            introSeatStyle.introRight.right="-50vw";

        }
        return({seatStyle, agendaStyle, buttonBarStyle, recorderButtonBarStyle, introSeatStyle, introStyle, titleHeight})
    }
    

    releaseCamera() {
        if (this.cameraStream && this.cameraStream.getTracks) {
            var tracks = this.cameraStream.getTracks();
            tracks.forEach(track => track.stop())
        }
    }

    getCamera(event) {
        logger.trace('MediaSource opened');
        this.sourceBuffer = this.mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        logger.trace('Source buffer: ', sourceBuffer);
    }

    async getCameraMedia() {
        if(this.props.participants.human) // if we have a human in this debate
        {
            const constraints = {
                audio: {
                    echoCancellation: { exact: true }
                },
                video: {
                    //width: 1280, height: 720
                    width: 640, height: 360
                }
            };
            logger.trace('Using media constraints:', constraints);
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                const listeningRound=this.props.participants.human.listening && this.props.participants.human.listening.round || Infinity;
                const listeningSeat=this.props.participants.human.listening && this.props.participants.human.listening.seat || 'seat2';
                logger.trace('getUserMedia() got stream:', stream);
                this.cameraStream = stream;
                //it will be set by nextMediaState this.human.current.src = stream; 
                Object.keys(this.props.participants).forEach(part => this.nextMediaState(part));
                // special case where human is in seat2 initially - because seat2 is where we record their silence
                if(listeningRound===0 && this.seat(Object.keys(this.props.participants).indexOf('human')) === listeningSeat)
                    this.startRecording(false,0); // listening is not speaking
            } catch (e) {
                logger.error('navigator.getUserMedia error:', e.name, e.message);
            }
        } else { // if we don't have a human - kick off the players
            Object.keys(this.props.participants).forEach(part => this.nextMediaState(part));
        }
    }

    startRecording(speaking,round) {
        logger.trace(`startRecording`, speaking, round);
        if(this.startRecorderState.state!=="READY") {
            if(this.startRecorderState.state==="QUEUED") logger.error("Undebate.startRecording queueing", {speaking, round}, "but", this.startRecorderState, "already queued");
            this.startRecorderState={state: "QUEUED", speaking, round};
            logger.trace("startRecording BLOCKED. Waiting for stop"); 
            return
        }
        this.recordedBlobs = [];
        // It's necessary to create a new mediaRecorder every time for Safari - safari won't stop and start again.  Chrome stops and starts just fine.
        if(typeof MediaRecorder === 'undefined'){
            logger.error(`MediaRecorder not supported`);
            this.setState({noMediaRecorder: true})
            return;
        }
        let options = { mimeType: 'video/webm;codecs=vp9' };
        try{
            if(!MediaRecorder.isTypeSupported){ // Safari doesn't have this yet
                options = { mimeType: 'video/mp4' }; //safari only supports mp4
                logger.warn("Undebate.startRecording MediaRecorder.isTypeSupported not suppored (by safari), using:", options);
            } else {
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    logger.trace("startRecording", options.mimeType, "is not Supported, trying vp8");
                    options = { mimeType: 'video/webm;codecs=vp8' };
                    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                        logger.trace("startRecording", options.mimeType, "is not Supported, trying webm");
                        options = { mimeType: 'video/webm' };
                        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                            logger.error("startRecording", options.mimeType, "is not Supported, no video supported");
                            options = { mimeType: '' };
                        }
                    }
                }
            }
        }
        catch(err){
            logger.error(`MediaRecorder.isTypeSupported`, options.mimeType, `caught error`)
        }
        try {
            this.mediaRecorder = new MediaRecorder(this.cameraStream, options);
            logger.trace("Undebate.startRecording succeeded MediaRecorder.mimeType", this.mediaRecorder.mimeType)
        } catch (e) {
            logger.error('Exception while creating MediaRecorder:', e.name, e.message);
            return;
        }
        logger.trace('Created MediaRecorder', this.mediaRecorder, 'with options', options);
        if(this.mediaRecorder.state!=='inactive'){
            logger.error("mediaRecorder.state not inactive before start", this.mediaRecorder.state);
        }
        this.mediaRecorder.onstop = (event) => {  // replace the onstop handler each time, because the saveRecording parameters change
            logger.trace('Recorder stopped: ', event, this.mediaRecorder.state);
            this.saveRecordingToParticipants(speaking,round);
            if(this.startRecorderState.state==="QUEUED"){
                const {speaking, round}=this.startRecorderState;
                this.startRecorderState={state: "READY"};
                this.startRecording(speaking, round);  
            }else if(this.startRecorderState.state==="BLOCK")
                this.startRecorderState={state: "READY"}
        };
        this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
        this.mediaRecorder.start(Config.webRTCMediaRecorderPeriod); // collect 10ms of data
        logger.trace('MediaRecorder started', this.mediaRecorder);
    }

    handleDataAvailable(event) {
        if (event.data && event.data.size > 0) {
            this.recordedBlobs.push(event.data);
        }
    }

    stopRecording() {
        logger.trace("Undebate.stopRecording", this.mediaRecorder && this.mediaRecorder.state)
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.startRecorderState={state: "BLOCK"};  // need to block startRecording calls until the onStop even is received.
            this.mediaRecorder.stop()
            if(this.recordedBlobs.length)
                logger.trace('Recorded Blobs: ', this.recordedBlobs.length && this.recordedBlobs[0].type, this.recordedBlobs.length, this.recordedBlobs.reduce((acc,blob)=>acc+blob.size||0,0));
            else
                logger.trace('no recorded blobs yet'); // apple safari will not have anything at this point
        }
    }

    saveRecordingToParticipants(speaking,round) {
        logger.trace("saveRecordingToParticipants (locally)", speaking, round, this.mediaRecorder.state)
        if(!this.recordedBlobs.length) return logger.error("saveRecordingToParticipants found no blobs", this.mediaRecorder.state);
        logger.trace('save Recorded Blobs: ', this.recordedBlobs.length, this.recordedBlobs.length && this.recordedBlobs[0].type, this.recordedBlobs.reduce((acc,blob)=>acc+blob.size||0,0));
        const  blob = new Blob(this.recordedBlobs, { type: this.recordedBlobs[0].type }); // use the type from the blob because it might be different than the type we asked for - eg safari gives your video/mp4 no matter what
        if(!speaking){
            this.participants.human.listeningBlob=blob;
            this.participants.human.listeningObjectURL=URL.createObjectURL(blob);
        } else {
            this.participants.human.speakingBlobs[round]=blob;
            this.participants.human.speakingObjectURLs[round]=URL.createObjectURL(blob);
        }
    }

    // for the given seatOffset and round, fetch the object, or start the media
    nextMediaState(part) {
        logger.trace(`nextMediaState part:${part}`);
        //if (part === 'human') return;
        // humans won't get here
        var { round } = this.state;

        let speaking = (this.seat(Object.keys(this.props.participants).indexOf(part)) === 'speaking')

        var objectURL;
        if (speaking) {
            if(part==='human'){
                if(this.participants.human && this.participants.human.speakingObjectURLs[round] && !this.rerecord){
                    objectURL=this.participants.human.speakingObjectURLs[round];
                }else {
                    objectURL="cameraStream"; // set it to something - but this.cameraStream should really be used
                }
            } else if (!(objectURL = this.participants[part].speakingObjectURLs[round])){
                this.participants[part].speakingImmediate[round]=true;
                this.stallWatch(part)
                logger.error("Undebate.nextMediaState need to do something about stallWatch with preFetch")
            }
        } else {
            if(part==='human') objectURL="cameraStream"; //set it to something - but this.cameraStream should really be used
            else if (!(objectURL = this.participants[part].listeningObjectURL))
                this.participants[part].listeningImmediate=true;
        }
        if (objectURL)
            this.playObjectURL(part, objectURL, speaking);
    }

    preFetchAudio(sets){
        Object.keys(sets).forEach(set=>{
            
            sets[set].url && fetch(sets[set].url)
                .then(res => res.blob())
                .then( blob =>{
                    var objectURL=URL.createObjectURL(blob);
                    this.audioSets[set]=Object.assign({},sets[set],{objectURL})
                })           
                .catch(err => {
                    logger.error("preFetchAudio", sets[set].url, err.name, e.message)
                })

        })
    }

    audioEnd(e){
        return;
    }

    preFetchQueue=0;

    setExternalObjectURL(part,speaking,round){
        if(speaking)
            this.participants[part].speakingObjectURLs[round]=this.props.participants[part].speaking[round];
        else {
            this.participants[part].listeningObjectURL=this.props.participants[part].listening;
        }
        if(round==0 && part==='moderator'){
            this.setState({moderatorReadyToStart: true})
        }
    }

    preFetchObjectURL(part,speaking,round){
        if(!this.props.participants[part]) 
            return; // part may not exist in this debate
        
        if( true /*window.env!=='production' || this.participants[part].youtube */ ){  // in development, don'e prefetch the videos because they won't be cached by the browser and you'll end up consuming a lot of extra cloudinary bandwith, on youtube we can't prefetch
            logger.trace("undebate.preFetchObjectURl - in development we don't prefetch", part, speaking, round);
            this.setExternalObjectURL(part,speaking,round);
            return;
        } else {
            let queued=this.preFetchQueue || 0;
            if(queued > 1){
                return this.preFetchList.push([part,speaking,round]);
            } else {
                this.preFetchQueue=queued+1;
                this.preFetchHandler(part,speaking,round)
            }
            this.setState({preFetchQueue: this.preFetchQueue + this.preFetchList.length})
        }
    }

    preFetchHandler(part,speaking,round){
        const shiftPreFetchList=()=>{
            if(this.preFetchList.length){
                setTimeout(()=>this.preFetchList.length && this.preFetchHandler(...this.preFetchList.shift()))
            }
        }
        const url=speaking ? (this.props.participants[part].speaking[round] || this.props.participants[part].listening) : this.props.participants[part].listening;
        logger.trace("preFetchObjectURL","part:", part, "url:", url, "speaking:", speaking, "round:", round);
        fetch(url)
            .then(res => res.blob()) // Gets the response and returns it as a blob
            .then(async blob => {
                logger.trace("Undebate.preFetchObjectURL fetch completed:", "part:", part, "url:", url, "speaking:", speaking, "round:", round, "size:",blob.size, "type:", blob.type);
                this.preFetchQueue= Math.max(this.preFetchQueue-1,0);
                this.setState({preFetchQueue: this.preFetchQueue+this.preFetchQueue + this.preFetchList.length});
                var objectURL = URL.createObjectURL(blob);
                //await promiseSleep(part==='moderator' && 2000 || 0);
                if (speaking) {
                    this.participants[part].speakingObjectURLs[round] = objectURL;
                    if(this.participants[part].speakingImmediate[round]){
                        this.playObjectURL(part, objectURL, speaking);
                        this.participants[part].speakingImmediate[round]=false;
                    }
                } else {
                    this.participants[part].listeningObjectURL = objectURL;
                    if(this.participants[part].listeningImmediate){ 
                        this.playObjectURL(part, objectURL, speaking);
                        this.participants[part].listeningImmediate=false;
                    }
                }
                shiftPreFetchList();
                if(round==0 && part==='moderator'){
                    logger.trace("moderatorReadyToStart");
                    this.setState({moderatorReadyToStart: true})
                }
            })
            .catch(err => {
                logger.error("Undebate.preFetchObjectURL fetch caught error", part, speaking, round, url, err.name, err.message)
                this.preFetchQueue= Math.max(this.preFetchQueue-1,0);
                this.setState({preFetchQueue: this.preFetchQueue+this.preFetchQueue + this.preFetchList.length});
                let retries=this.retries[part+speaking+round] || 0;
                if(retries<3){
                    logger.trace("Undebate.preFetchObjectURL retrying", retries, part, speaking, round, url)
                    this.retries[part+speaking+round]=retries+1;
                    this.preFetchList.push([part,speaking,round]);
                } else {
                    logger.error("Undebate.preFetchObjectURL retries exceeded, using external link", part, speaking, round, url)
                    this.setExternalObjectURL(part,speaking,round);  
                }
                shiftPreFetchList();
            })
    }

    async playObjectURL(part, objectURL, speaking) {
        if(!this[part]) return; // we don't have a space for this participant
        logger.trace("playObjectURL part:",part, "objectURL:", objectURL);
        if(this.participants[part].youtube) {
            this.youtubePlayers[part].loadVideoById({videoId: getYouTubeID(objectURL)})
            let chair=this.seat(Object.keys(this.props.participants).indexOf(part));
            if(chair!=='speaking')
                this.youtubePlayers[part].mute()
            else
                this.youtubePlayers[part].unMute();
            if(this.youtubePlayers[part].getPlayerState()!==YT.PlayerState.PLAYING)
                this.youtubePlayers[part].playVideo();
        } else {
            let element = this[part].current;
            if(element.src === objectURL){
                return; // don't change it.
            }
            //element.src=null;
            if(part==='human' && !speaking){ // human is not speaking
                if(element.srcObject === this.cameraStream){
                    if(element.muted && element.loop) return;
                    element.muted=true;
                    element.loop=true;
                } else {
                    element.src=""
                    element.muted=true;
                    element.loop=true;
                    element.srcObject=this.cameraStream; // objectURL should be camera - this.cameraStream
                }
                return; // not need to play - source is a stream
            }else if(part==='human' && speaking && (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord) ){ // human is speaking (not playing back what was spoken)
                element.src="";
                element.srcObject=this.cameraStream; // objectURL should be camera - this.cameraStream
                element.muted=true;
                element.loop=false
                return; // no need to play source is a stream
            } else if(part==='human' && speaking && this.participants.human.speakingObjectURLs[this.state.round] ){ // human is playing back what was spoken
                element.srcObject=null;
                element.src=objectURL;
                element.muted=false;
                element.loop=false
            } else if(speaking) {
                element.src = objectURL;
                element.muted=false;
                element.loop=false;
            } else {
                if(element.src===objectURL && element.muted && element.loop) return;
                element.src=objectURL;
                element.muted=true;
                element.loop=true;
            }
            try {
                // we have to stallWatch before we play because play might not return right away for lack of data
                let stallWatchPlayed;  
                if(speaking)
                    stallWatchPlayed=this.stallWatch(part);
                await element.play()
                if(stallWatchPlayed) stallWatchPlayed();
            }
            catch (err) {
                if (err.name === "NotAllowedError") {
                    this.requestPermissionElements.push(element);
                    if(!this.state.requestPermission) this.setState({ requestPermission: true });
                } else if (err.name === "AbortError") {
                    if(element.loop && element.autoplay && element.muted) 
                        return; // safari generates this error but plays anyway - chome does not generate an error
                    this.requestPermissionElements.push(element);
                    if(!this.state.requestPermission) this.setState({ requestPermission: true });
                } else {
                    logger.error("Undebate.playObjectURL caught error", err.name, err);
                }
            }
        }
    }

    async playAudioObject(part, obj, onended) {
        if(!this[part]) return; // we don't have a space for this participant
        if(this.participants[part] && this.participants[part].youtube) return; // don't use HTML5 operations on a YouTube player, part might be audio
        logger.trace("playAudioObject part:",part, "obj:", obj);
        let element = this[part].current;
        element.src = null;
        //element.srcObject = null;
        element.src = obj.objectURL;
        element.volume=obj.volume || 1; // default is 1, some objects may set volume others not
        element.onended=onended;
        try {
            await element.play()
        }
        catch (err) {
            if (err.name === "NotAllowedError") {
                logger.trace("playAudioObject caught NotAllowedError", part, obj, err);
                this.requestPermissionElements.push(element);
                if(!this.state.requestPermission) this.setState({ requestPermission: true });
            } else if (err.name === "AbortError") {
                logger.trace("playAudioObject caught AbortError", part, obj, err);
                this.requestPermissionElements.push(element);
                if(!this.state.requestPermission) this.setState({ requestPermission: true });
            } else {
                logger.error("Undebate.playAudioObject caught error", err.name, err);
            }
        }
    }

    async requestPermission(e) { // the click event is passed but not used
        var element;
        function playFunc(e){
            e.play()
            .then((result)=>logger.trace("requestPermission played",e.src, result))
            .catch(err=>{
                logger.error("requestPermission caught error", err.name, err.message)
                if (err.name === "NotAllowedError") {
                    this.requestPermissionElements.push(e); // put it back to try again
                    if(!this.state.requestPermission) this.setState({requestPermission: true})
                } else 
                    logger.error("requestPermission caught error on play after requesting permission. element:", element, "err:" , err.name, err.message)
            })
        }
        while (element = this.requestPermissionElements.shift()){
            playFunc(element);
        }
        this.setState({ requestPermission: false });
    }

    seat(i, seatOffset) {
        if (this.state.finishUp) return 'finishUp';
        if (typeof seatOffset === 'undefined') seatOffset = this.state.seatOffset;
        return seating[(seatOffset + i) % this.numParticipants]
    }

buttons=[
    {name: ()=><IconPrevSection width="60%" height="auto"/> , func: this.prevSection},
    {name: ()=><IconPrevSpeaker width="60%" height="auto" />, func: this.prevSpeaker},
    {name: ()=>this.state.allPaused ? <IconPlay width="75%" height="auto" /> : <IconPause width="75%" height="75%" />, func: this.allPause},
    {name: ()=><IconSkipSpeaker width="60%" height="auto" />, func: this.nextSpeaker},
    {name: ()=><IconNextSection width="60%" height="auto" />, func: this.nextSection, disabled: ()=>this.participants.human && !this.participants.human.speakingObjectURLs[this.state.round] },
]

    recorderButtons=[
        {name: ()=>"Redo", func: this.rerecordButton},
        {name: ()=>"key1", func: null}, // keyN because react keys have to have unigue names
        {name: ()=>"key2", func: null},
        {name: ()=>"key3", func: null},
        {name: ()=>"Finished Speaking", func: this.finishedSpeaking},
    ]

    allPause(){
        if(!this.state.begin){
            this.beginButton()
        } else if(!this.state.allPaused) {
            Object.keys(this.participants).forEach(participant=>{
                if(this[participant] && this[participant].current) this[participant].current.pause();
            })
            this.setState({allPaused: true});
        }
        else{
            this.allPlay();
            this.setState({allPaused: false})
        }
    }

    allStop(){
        Object.keys(this.participants).forEach(participant=>{
            if(this[participant] && this[participant].current){
                this[participant].current.pause();
                this[participant].current.src=null;
            }
        })
        if(this.audio && this.audio.current) {
            this.audio.current.pause();
            this.audio.current.src=null;
        }
    }

    allPlay(){
        Object.keys(this.participants).forEach(async participant=>{
            if(this[participant]) {
                if(this[participant].current.paused){
                    try {
                        await this[participant].current.play();
                    }
                    catch(err){
                        if (err.name === "NotAllowedError") {
                            this.requestPermissionElements.push(element);
                            this.setState({ requestPermission: true });
                        } else if (err.name === "AbortError") {
                            this.requestPermissionElements.push(element);
                            this.setState({ requestPermission: true });
                        }else{
                            logger.error("undebate.play() for ", participant, "caught error",err)
                        }
                    }
                }
            }
        })
    }

    prevSection(){
        var { seatOffset, round } = this.state;
        logger.info("Undebate.prevSection",seatOffset, round);
        seatOffset=0;
        round-=1;
        if(round<0 )round=0;
        this.newOrder(seatOffset, round)
    }

    prevSpeaker() {
        var { seatOffset, round } = this.state;
        logger.info("Undebate.prevSpeaker",seatOffset, round);
        if(this.numParticipants===1){
            round-=1;
            if(round<0) round=0;
        }else{
            if(seatOffset===0){ //we were listening to the moderator
                if(round > 0) {
                    round--;
                    seatOffset=1; // one because if we were going to the next seat, we would be subtracting on, and then going to 
                }else{
                    round=0;
                }
            } else {
                seatOffset+=1;
                if(seatOffset >= this.numParticipants){
                    round -=1;
                    seatOffset=0;
                }
                if(round<0)round=0;
            }
        }
        this.newOrder(seatOffset, round)
    }

    nextSection(){
        var { seatOffset, round } = this.state;
        logger.info("Undebate.nextSection",seatOffset, round);
        if(this.numParticipants===1){
            round+=1;
            if(!this.props.participants.moderator.speaking[round])
                return this.finished();
        }else{
            round+=1;
            seatOffset=0;
            if(!this.props.participants.moderator.speaking[round])
                return this.finished();
        }
        this.newOrder(seatOffset, round)
    }

    nextSpeaker() {
        var { seatOffset, round } = this.state;
        logger.info("Undebate.nextSpeaker",seatOffset, round);
        if(this.numParticipants===1){
            round+=1;
            if(!this.props.participants.moderator.speaking[round])
                return this.finished();
        }else{
            seatOffset -= 1;
            if (seatOffset === 0 ) round += 1; // back to the moderator, switch to the next round
            if (seatOffset < 0) {
                if (this.props.participants.moderator.speaking[round + 1])
                    seatOffset = this.numParticipants - 1; // moderator just finished, he moves to the back of the order
                else
                    return this.finished();
            }
        }
        this.newOrder(seatOffset, round)
    }

    autoNextSpeaker() {
        var { seatOffset, round } = this.state;
        logger.trace("Undebate.autoNextSpeaker",seatOffset, round);
        if(this.numParticipants===1){
            round+=1;
            if(!this.props.participants.moderator.speaking[round])
                return this.finished();
        }else{
            seatOffset -= 1;
            if (seatOffset === 0 ) round += 1; // back to the moderator, switch to the next round
            if (seatOffset < 0) {
                if (this.props.participants.moderator.speaking[round + 1])
                    seatOffset = this.numParticipants - 1; // moderator just finished, he moves to the back of the order
                else
                    return this.finished();
            }
        }
        this.newOrder(seatOffset, round)
    }

    finishedSpeaking(){ // this is different than nextSpeaker to avoid the race condition that one might hit the finished speaking button just after the timeout and things have already advanced
        logger.info("Undebate.finishedSpeaking");
        if(this.seat(Object.keys(this.props.participants).indexOf('human')) === 'speaking')
            return this.autoNextSpeaker();
    }

    rerecordButton(){
        logger.info("Undebate.rerecordButton");
        this.stopRecording();  // it might be recording when the user hit's rerecord
        this.rerecord=true;
        const {seatOffset, round}=this.state;
        this.newOrder(seatOffset,round)
    }

    newOrder(seatOffset, round){
        this.clearStallWatch();
        this.stopCountDown();
        if (this.talkativeTimeout) {
            clearTimeout(this.talkativeTimeout);
            this.talkativeTimeout = 0;
        }
        var followup = [];
        Object.keys(this.props.participants).forEach((participant, i) => {
            let oldChair = this.seat(i);
            let newChair = this.seat(i, seatOffset);
            logger.trace("rotateOrder", round, seatOffset, participant, oldChair, newChair)
            if (participant === 'human') {
                const listeningRound=this.props.participants.human.listening && this.props.participants.human.listening.round || Infinity;
                const listeningSeat=this.props.participants.human.listening && this.props.participants.human.listening.seat || 'seat2';
                // first see if recording needs to be turned off (do this first)
                if(oldChair==='speaking' && newChair==='speaking' && this.rerecord) { // the user is initiating a rerecord
                    ;
                } else if(oldChair==='speaking' && (!this.participants.human.speakingObjectURLs[this.state.round] || this.rerecord) ){ // the oldChair and the old round
                    this.rerecord=false;
                    this.stopRecording();
                }else if(oldChair===listeningSeat && this.state.round===listeningRound){ // the oldChair and the old round
                    this.stopRecording();
                }
                // then see if it needs to be turned on - both might happen at the same transition
                if (newChair === listeningSeat && round === listeningRound) {
                        followup.push(()=>{
                            this.nextMediaState(participant)
                            this.startRecording(false,round);
                        })
                } else if (newChair === 'speaking') {
                    if(this.participants.human.speakingObjectURLs[round] && !this.rerecord){
                        followup.push(()=>this.nextMediaState(participant))
                    } else {
                        followup.push(()=>{
                            let limit=this.props.participants.moderator.timeLimits && this.props.participants.moderator.timeLimits[round] || 60;
                            this.startCountDown(limit,()=>this.autoNextSpeaker())
                            this.talkativeTimeout = setTimeout(() => this.setState({ talkative: true }), limit * 0.75 * 1000)
                            this.nextMediaState(participant);
                            this.startRecording(true,round);
                        })
                    }
                } else { // human just watching
                    followup.push(()=>this.nextMediaState(participant));
                }
            } else if (oldChair === 'speaking' || newChair === 'speaking' || this.state.allPaused) { // will be speaking or need to start media again
                followup.push(() => this.nextMediaState(participant));
            } else {
                logger.trace("participant continue looping", participant)
            }
        })
        logger.trace("rotateOrder: ", seatOffset);

        this.setState({ seatOffset, round, talkative: false, allPaused: false}, () => { if(this.audioSets.transition) {this.playAudioObject('audio',this.audioSets.transition);} while (followup.length) followup.shift()(); })
    }

    finished() {
        logger.info("Undebate.finished");
        this.audioSets && this.audioSets.ending && this.playAudioObject('audio',this.audioSets.ending)
        setTimeout(() => {
            this.releaseCamera();
            this.setState({ done: true });
        }, 1.5* TransitionTime);
        return this.setState({ finishUp: true });
    }

    hangup() {
        logger.info("Undebate.hangup");
        this.releaseCamera();
        this.allStop();
        delete this.uploadQueue;
        return this.setState({ hungUp: true, done: true });
    }

    updateProgress(chunk){
        this.transferred+=chunk.length;
        var percentComplete= Math.round((this.transferred/this.totalSize)*100)+'%';
        this.setState({progress: percentComplete})
    }

    upload(blob,seat,round,userId) {
        var name = userId + '-' + round + '-' + seat + new Date().toISOString().replace(/[^A-Z0-9]/ig, "") + '.mp4'; // mp4 was put here to get around something with Apple - check in future 

        // socketIo-streams does not seem to be passing call backs (undefined is received)
        // so we are using a socket io event to send the response back
        const responseUrl=(url)=>{
            if(url){
                logger.trace("url", url);
                if(seat==='speaking') {
                    // what if the come out of order -- to be determined
                    this.participant.speaking.push(url);
            } else 
                    this.participant.listening=url;

            }else {
                logger.error("upload video failed", name)
            }
            if(this.participant.speaking.length===this.props.participants.audience1.speaking.length && this.participant.listening){
                logger.trace("creat participant", this.participant);
                var pIota={ //participant iota
                    parentId: this.props.parentId, 
                    subject: 'Participant:' + this.props.subject, 
                    description: 'A participant in the following discussion:' + this.props.description,
                    component: {
                        component: 'MergeParticipants',
                        participant: this.participant
                    }
                }
                if(this.props.bp_info) {// don't cause the property to exist in the Iota if there is none. 
                    pIota.component.participant.bp_info=this.props.bp_info;
                    if(this.props.bp_info.candidate_name) pIota.component.participant.name=this.props.bp_info.candidate_name;
                }   
                window.socket.emit('create participant', pIota , (result)=>{logger.trace("participant created", result)})
            }
        }

        var stream = ss.createStream();
        stream.on('error',(err)=>{
            logger.error("AskWebRTC.upload socket stream error:",err)
        })

        ss(window.socket).emit('upload video', stream, { name, size: blob.size }, responseUrl);

        var bstream=ss.createBlobReadStream(blob, {highWaterMark: 1024 * 200}).pipe(through2((chunk, enc, cb) =>{
            this.updateProgress(chunk)
            cb(null,chunk)  // 'this' becomes this of the react component rather than this of through2 - so pass the data back in the callback
           })).pipe(stream); // high hiwWaterMark to increase upload speed

        bstream.on('error',(err)=>{
            logger.error("AskWebRTC.upload blob stream error:",err)
        })
        stream.on('end',()=>{
            var uploadArgs;
            if(uploadArgs=this.uploadQueue.shift()){
                return this.upload(...uploadArgs)
            } else {
                this.setState({progress: 'complete.', uploadComplete: true})
                logger.trace("upload after login complete");
            }
        })
    }

    onUserLogin(info){
        logger.info("Undebate.onUserLogin");
        logger.trace("onUserLogin",info);
        this.participant={speaking: [], name: this.state.name}
        const {userId}=info;
        this.setState({newUserId: userId});
    }

    onUserUpload(){
        logger.info("Undebate.onUserUpload");
        logger.trace("onUserUpload",this.props);
        this.participant={speaking: [], name: this.state.name}
        const userId=this.props.user && this.props.user.id || this.state.newUserId;
        this.totalSize=0;
        this.transferred=0;

        for(let round=0; round<this.participants.human.speakingBlobs.length; round++){
            this.totalSize+=this.participants.human.speakingBlobs[round].size;
            this.uploadQueue.push([this.participants.human.speakingBlobs[round],"speaking",round,userId]);
        }
        if(this.participants.human.listeningBlob){
            this.uploadQueue.push([this.participants.human.listeningBlob,"listening",0,userId]);
            this.totalSize+=this.participants.human.listeningBlob.size;
        }
        
        let uploadArgs;
        if(uploadArgs=this.uploadQueue.shift()){
            this.upload(...uploadArgs)
        }
        this.setState({progress: `${this.totalSize} to upload`})
    }

    startCountDown(seconds,finishFunc){
        if(this.recordTimeout) clearTimeout(this.recordTimeout);
        const counter=(sec)=>{
            if(sec>0){
                this.recordTimeout=setTimeout(()=>counter(sec-1),1000);
                this.setState({countDown: sec-1})
            }else{
                this.recordTimeout=0;
                finishFunc && setTimeout(finishFunc); // called after timeout to avoid setState collisions
                if(this.state.countDown!==0) this.setState({countDown: 0})
            }
        }
        this.recordTimeout=setTimeout(()=>counter(seconds),TransitionTime); // can't call setState from here because it will collide with the setstate of the parent event handler
    }

    stopCountDown(){
        if(this.recordTimeout) {
            clearTimeout(this.recordTimeout);
            this.recordTimeout=0;
        }
        if(this.setState.countDown >0) this.setState({countDown: 0})
    }

    onIntroEnd(){
        this.audio.current.onended=undefined;
        this.setState({begin: true},()=>{this.getCameraMedia();})
    }

    videoError(participant,e){
        logger.error("Undebate.videoError " + e.target.error.code + "; details: " + e.target.error.message, participant);
        if(e.target.error.code===3 && e.target.error.message.startsWith("PIPELINE_ERROR_DECODE") ) { // there is something wrong with the video we are trying to play
            if(this.seat(Object.keys(this.props.participants).indexOf(participant))==='speaking'){
                this.autoNextSpeaker(); // skip to the next speaker
                logger.error("Undebate.videoError on speaker, skipping", e.target.error.message, this[participant].current.src);
            } else {
                logger.error("Undebate.videoError on listener, ignoring", e.target.error.message, this[participant].current.src)
            }
        } else 
            this.autoNextSpeaker(); // skip to the next speaker
    }
    
    // we have to check on the speaker's video periodically to see if it's stalled by checking if the currentTime is increasing
    // the video.stalled event just doesn't respond to all the situations, and it doesn't tell you when the stall has ended
    stallWatch(speaker){
        if(this.participants[speaker].youtube) return;

        if(this.participants[speaker].speakingImmediate[this.state.round] && this.stallWatchTimeout) // was called because preFetch hadn't completed when it was time to play
            return;

        if(this.stallWatchTimeout){
            logger.error("Undebate.stallWatch called but timeout already set", this.stallWatchTimeout)
        }

        const element=this[speaker].current;
        var lastTime=-1;
        var tickCount=0;

        const calcWaitingPercent=()=>{
            if(element.duration !== Infinity)
                return Math.round(  (element.buffered.end(0) / element.duration) * 100);
            else  // webm files don't have duration information
                return Math.round( ( Math.max(0,((element.buffered.end(0)-element.buffered.start(0))-element.currentTime))/15) * 100); // get 15 seonds of data
        }
        
        const stallWatchPlayed=()=>{ // this is called after the player has started
            if(this.state.stalled){
                if(element.readyState===4 || element.buffered.end(0)-element.currentTime > 15){
                    logger.trace("Undebate.stallWatch.stallWatchPlayed unstalled", speaker)
                    this.setState({stalled: false, waitingPercent: 0})
                } else {
                    element.pause();
                    logger.trace("Undebate.stallWatch.stallWatchPlayed paused", speaker)
                    this.setState({waitingPercent: calcWaitingPercent()})
                }
            }
        }

        const updater=()=>{
            if(this.state.allPaused) return this.stallWatchTimeout=setTimeout(updater,250);
            let currentTime=element.currentTime;
            if (element.readyState > 1){  // wait for the Meta Data to be ready
                let duration=element.duration || Infinity; // it might be Infinity, it might be NAN if the Meta Data hasn't loaded yet
                if(currentTime===Infinity){
                    logger.error("Undebate.stallWatch CurrentTime is Infinity")
                    ; // it might be - so just come back again later
                    this.stallWatchTimeout=setTimeout(updater,250);
                } else if(currentTime>=duration){
                    if(this.state.stalled){
                        logger.trace("Undebate.stallWatch unstalling on end", speaker)
                        this.setState({stalled: false, waitPercent: 0})
                    }
                    this.stallWatchTimeout=false;
                    return; // don't set the timeout again.
                } else if(currentTime===lastTime){
                    tickCount++;
                    if(tickCount<3){
                        this.stallWatchTimeout=setTimeout(updater,250);
                    } else if(this.state.stalled!==speaker){
                        element.pause();
                        logger.trace("Undebate.stallWatch stalled", speaker)
                        this.setState({stalled: speaker})
                        this.stallWatchTimeout=setTimeout(updater,250);
                    } else {
                        if(element.readyState===4) {// HAVE_ENOUGH_DATA
                            element.play()
                            .then(()=>{
                                this.stallWatchTimeout=setTimeout(updater,250); // don't call updater again until play has completed - it might take longer than 250mS
                                this.setState({stalled: false, waitingPercent: 0});
                            })
                            .catch(err=>{logger.error("Undebate.stallWatch.updater caught error on play", err.name, err.message)})
                        } else {
                            this.setState({waitingPercent: calcWaitingPercent()})
                            this.stallWatchTimeout=setTimeout(updater,250);
                        }
                    }
                }else {
                    lastTime=currentTime;
                    tickCount=0;
                    if(this.state.stalled===speaker) { // it was stalled and now its moved forward, but we don't want it to stall again too soon
                        if(element.readyState===4 || element.buffered.end(0)-currentTime > 15){
                            logger.trace("Undebate.stallWatch unstalled", speaker)
                            this.setState({stalled: false, waitingPercent: 0})
                        } else {
                            this.setState({waitingPercent: calcWaitingPercent()})
                        }
                    }
                    this.stallWatchTimeout=setTimeout(updater,250);
                }
            }else {  // the play can take a long time to start - if it does through up the warning
                if(currentTime===lastTime){
                    tickCount++;
                    if(tickCount<3){
                       ; // don't do anything yet
                    } else if(!this.state.stalled)
                        this.setState({stalled: speaker, waitingPercent: 0})
                } else {
                    if(this.state.stalled)
                        this.setState({stalled: false, waitingPercent: 0})
                    lastTime=currentTime;
                    tickCount=0;
                }
                this.stallWatchTimeout=setTimeout(updater,250); // come back later
            }
        }
        this.stallWatchTimeout=setTimeout(updater,750); // intially
        return stallWatchPlayed;
    }

    clearStallWatch(){
        if(this.stallWatchTimeout) clearTimeout(this.stallWatchTimeout);
        this.stallWatchTimeout=false;
        if(this.state.stalled)
            this.setState({stalled: false, waitingPercent: 0})
    }

    keyHandler(e){
        if(e){
            if(this.participants.human && this.seat(Object.keys(this.props.participants).indexOf('human')) === 'speaking' && e.keyCode===32 && !this.state.done) { // don't consume it if not human speaking
                e.preventDefault();
                this.finishedSpeaking();
            }
        }
    }

    beginButton(e){
        logger.info("Undebate.beginButton");
        if(this.audioSets && this.audioSets.intro) {
            this.setState({intro: true, stylesSet: true}, ()=>{this.playAudioObject('audio',this.audioSets.intro, this.onIntroEnd.bind(this))})
        } else 
            this.setState({intro: true, stylesSet: true}, ()=>this.onIntroEnd());
    }
    
    render() {
        const { className, classes, closing={thanks: "Thank You"} } = this.props;
        const { round, finishUp, done, begin, requestPermission, talkative, moderatorReadyToStart, intro, seatStyle, agendaStyle, buttonBarStyle, recorderButtonBarStyle, introSeatStyle, introStyle, stylesSet, titleHeight } = this.state;

        const getIntroStyle=(name)=>Object.assign({}, stylesSet && {transition: IntroTransition}, introStyle[name], intro && introSeatStyle[name] )
        const innerWidth=typeof window!== 'undefined' ? window.innerWidth : 1920;

        //const scrollableIframe=done && !this.state.hungUp && closing.iframe && (!this.participants.human || (this.participants.human && this.state.uploadComplete));
        const scrollableIframe= ( (done && !this.state.hungUp && closing.iframe && (!this.participants.human || (this.participants.human && this.state.uploadComplete))) 
                                || (done && this.state.hungUp && closing.iframe && this.participants.human)
                                );

        const bot=this.props.browserConfig.type==='bot';
        const noOverlay=true;

        if((seatStyle.speaking.width*HDRatio+titleHeight) !== agendaStyle.height) console.error("speaking height was",seatStyle.speaking.width*HDRatio+titleHeight,"!=","agenda height",agendaStyle.height);

        if(this.canNotRecordOnSafari){
            return (
                <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <img style={getIntroStyle('introRight')} src="/assets/images/female_hands_mug.png"/>
                    <img style={getIntroStyle('introLeft')} src='/assets/images/male_hands_mug.png'/>
                    <img style={getIntroStyle('introTopLeft')} src='/assets/images/left_flowers.png'/>
                    <img style={getIntroStyle('introTopRight')} src='/assets/images/right_flowers.png'/>
                    <div className={classes['note']}>
                        <div style={{ width: '100%', height: '100%', display: 'table' }} >
                            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                                <p style={{fontSize: '150%'}}>We're still building this.</p>
                                <p>Recording on Safari is not supported yet.  Please use Chrome for now.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        const surveyForm=()=>(
            (closing.iframe && (!this.participants.human || (this.participants.human && (this.state.uploadComplete || this.state.hungUp))) && <iframe src={closing.iframe.src} width={Math.min(closing.iframe.width,innerWidth)} height={closing.iframe.height} frameBorder="0" marginHeight="0" marginWidth="0">Loading...</iframe>)
            || 
            (closing.link && (!this.participants.human || (this.participants.human && (this.state.uploadComplete || this.state.hungUp))) && <div className={classes['thanks-link']}><a href={closing.link.url} target={closing.link.target || "_self"} >{closing.link.name}</a></div>)
        )
            
        const beginOverlay=()=>(!begin && !done &&
            <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <div style={{ width: '100%', height: '100%', display: 'table' }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                        <button className={classes['beginButton']} onClick={this.beginButton}>Begin</button>
                        </div>
                    </div>
            </div>
        )

        const waitingOnModeratorOverlay=()=>(
            begin && !moderatorReadyToStart &&  
            <div className={cx(classes['outerBox'],classes['beginBox'])}>
                <div style={{ width: '100%', height: '100%', display: 'table', backgroundColor: 'rgba(255,255,255,0.8)' }} >
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                        <div><span className={cx(classes['thanks'],scrollableIframe&&classes['scrollableIframe'])}>Waiting for the video to download before we begin.</span></div>
                        <div><span className={cx(classes['thanks'],scrollableIframe&&classes['scrollableIframe'])}>{this.state.preFetchQueue}</span></div>
                    </div>
                </div>
            </div>
        )

        const permissionOverlay=()=>(
            requestPermission &&
                <div className={cx(classes['outerBox'],classes['beginBox'])}>
                    <div style={{ width: '100%', height: '100%', display: 'table', backgroundColor: "rgba(255,255,255,0.5)" }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                            <div><span className={classes['thanks']}>The browser wants your permission to continue</span></div>
                            <div><button className={classes['beginButton']} onClick={this.requestPermission}>Continue</button></div>
                        </div>
                    </div>
                </div>
        )

        const ending = () => done && !this.state.hungUp && (
            <React.Fragment>
                <div className={cx(classes['outerBox'],scrollableIframe&&classes['scrollableIframe'])} key="ending">
                    <div style={{ width: '100%', height: '100%', display: 'table' }} >
                        <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                            <span className={cx(classes['thanks'],scrollableIframe&&classes['scrollableIframe'])}>{closing.thanks}</span>
                            {surveyForm()}
                            {this.participants.human && !this.state.uploadComplete &&
                                <>
                                    <div style={{ textAlign: 'center' }}>
                                    {!this.props.bp_info || !this.props.bp_info.candidate_name ? <div><label>Name<Input className={this.props.classes['name']} block medium required placeholder="Name" ref="name" name="name" onChange={(e) => this.setState({ name: e.value })} /></label><span>This will be shown with your video</span></div>:null}
                                        {!this.newUser || this.state.newUserId ? 
                                            <div><button className={classes['beginButton']} onClick={this.onUserUpload.bind(this)}>Post</button></div> 
                                        :
                                            <>
                                                <div style={{ textAlign: 'center' }}><span>Join and your recorded videos will be uploaded and shared</span></div>
                                                <div><Join className={this.props.classes['join']} userInfo={{ name: this.state.name }} onChange={this.onUserLogin.bind(this)} ></Join></div>
                                            </>
                                        }
                                        {this.state.progress && <div>{'uploading: ' + this.state.progress}</div>}
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )

        const hungUp = () => this.state.hungUp && (
            <div className={cx(classes['outerBox'],scrollableIframe&&classes['scrollableIframe'])} key="hungUp">
                <div style={{ width: '100%', height: '100%', display: 'table' }} >
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }} >
                    <span className={cx(classes['thanks'],scrollableIframe&&classes['scrollableIframe'])}>{closing.thanks}</span>
                        {surveyForm()}
                    </div>
                </div>
            </div>
        )

        let humanSpeaking = false;

        function pxSeatStyleWidth(seat){
            let width=seatStyle[seat].width;
            if(typeof width==='number')return width;
            if(width.endsWith('vw')) return parseFloat(width)*innerWidth/100;
            return parseFloat(width);
        }

        var videoBox = (participant, i, seatStyle) => {
            if(!this[participant]) return null; // we don't have room for this participant
            let chair = this.seat(i);
            let videoWidth=pxSeatStyleWidth(this.seat(i));
            let videoHeight=pxSeatStyleWidth(this.seat(i)) * HDRatio;
            if (participant === 'human' && this.seat(i) === 'speaking')
                humanSpeaking = true;
                const style= noOverlay || bot || intro ? seatStyle[chair] : Object.assign({},seatStyle[chair],introSeatStyle[chair]) 
                let participant_name;
                if(participant==='human'&&this.props.bp_info&&this.props.bp_info.candidate_name)
                    participant_name=this.props.bp_info.candidate_name
                else
                    participant_name=this.props.participants[participant].name;
            /*src={"https://www.youtube.com/embed/"+getYouTubeID(this.participants[participant].listeningObjectURL)+"?enablejsapi=1&autoplay=1&loop=1&controls=0&disablekb=1&fs=0&modestbranding=1&rel=0"}*/
            return (
                <div style={style} className={cx(className, classes['box'], stylesSet && classes['stylesSet'], stylesSet && !intro && classes['intro'], stylesSet && !begin && classes['begin'])} key={participant}>
                    <div style={{width: videoWidth, height: videoHeight}}
                        className={cx(className, classes['participantBackground'], stylesSet && classes['stylesSet'], stylesSet && !intro && classes['intro'], stylesSet && !begin && classes['begin'])}
                    >
                        <img style={{'transition': `all ${TransitionTime}ms linear`, height:videoHeight }} height={pxSeatStyleWidth('speaking') *  HDRatio } width="auto" src={this.participants[participant] && this.participants[participant].placeholderUrl || undefined} ></img>
                    </div>
                    {bot ? null :
                        participant!=='human' && this.participants[participant].youtube ? 
                            <div className={cx(className, classes['participant'], stylesSet && classes['stylesSet'], stylesSet && !intro && classes['intro'], stylesSet && !begin && classes['begin'])}
                                style={{fontSize: '8px', width: videoWidth, height: videoHeight}}
                            >
                                <div id={'youtube-'+participant} style={{fontSize: "8px"}}></div>
                            </div>
                         :
                        <>
                            <video className={cx(className, classes['participant'], stylesSet && classes['stylesSet'], stylesSet && !intro && classes['intro'], stylesSet && !begin && classes['begin'])}
                                ref={this[participant]}
                                playsInline
                                autoPlay={!bot}
                                controls={false}
                                onEnded={this.autoNextSpeaker.bind(this)}
                                onError={this.videoError.bind(this,participant)}
                                style={{width: videoWidth, height: videoHeight}}
                                key={participant + '-video'}>
                            </video>
                            <div className={cx(classes['stalledOverlay'],this.state.stalled===participant && classes['stalledNow'])} 
                                style={{width: videoWidth, height: videoHeight}}
                            >
                                <div className={classes['stalledBox']}>
                                    <p>Hmmmm... the Internet is slow here</p>
                                    <p>{`${this.props.participants[participant].name} will be with us shortly`}</p>
                                    <p>{`${this.state.waitingPercent}% complete`}</p>
                                </div>
                            </div>
                        </>
                    }
                    <div className={cx(classes['title'], stylesSet&&classes['stylesSet'],finishUp && classes['finishUp'])}><span>{participant_name}</span></div>
                </div>
            )
        }

        var agenda = (agendaStyle) => {
            const style= finishUp ? {} :  noOverlay || bot || intro ? agendaStyle : Object.assign({},agendaStyle,introSeatStyle['agenda']);
            return (
                <div style={style} className={cx(classes['agenda'], stylesSet && classes['stylesSet'], finishUp && classes['finishUp'], begin && classes['begin'], !intro && classes['intro'])} key={'agenda' + round + agendaStyle.left}>
                    <div className={classes['innerAgenda']}>
                        {this.props.participants.moderator.agenda[round] &&
                            <>
                                <div className={classes['agendaItem']}>
                                    <div className={classes['agendaTitle']}>
                                        <button className={classes['agenda-icon-left']} onClick={this.prevSection.bind(this)}><Icon  icon="chevron-left" size="1.5"  name="previous-section" /></button>
                                        Agenda
                                        <button className={classes['agenda-icon-right']} onClick={this.nextSection.bind(this)}><Icon  icon="chevron-right" size="1.5" name="previous-section" /></button>
                                    </div>
                                    <ul className={classes['agendaList']}>
                                        {this.props.participants.moderator.agenda[round] && this.props.participants.moderator.agenda[round].map((item, i) => <li className={classes['item']} key={item + i}>{item}</li>)}
                                    </ul>
                                </div>
                            </>
                        }
                    </div>
                </div>
            )
        };

        const buttonBar=(buttonBarStyle)=>(( bot || ((noOverlay || (begin && intro)) && !finishUp && !done)) &&
            <div style={buttonBarStyle} className={classes['buttonBar']} key="buttonBar">
                {this.buttons.map(button=>
                    <div style={{width: 100/this.buttons.length+'%', display: "inline-block", height: "auto"}} key={button.name}>
                            <div disabled={button.disabled && button.disabled()} onClick={button.func.bind(this)}>{button.name()}</div>
                    </div>
                )}
            </div>
        )

        const recorderButtonBar=(recorderButtonBarStyle)=>(this.participants.human && begin && intro && !finishUp && !done &&
            <div style={recorderButtonBarStyle} className={classes['recorderButtonBar']} key="recorderButtonBar">
                {this.recorderButtons.map(button=>
                    <div style={{width: 100/this.recorderButtons.length+'%', display: "inline-block", height: "100%"}} key={button.name}>
                            {button.func ?<button disabled={!humanSpeaking } onClick={button.func.bind(this)}>{button.name()}</button> : <div></div>}
                    </div>
                )}
            </div>
        )

        const hangupButton=()=>(!this.state.hungUp && this.participants.human &&
                    <div style={{height: '5.5rem'}}>
                        <button className={classes['hangUpButton']} onClick={this.hangup} key='hangup'>Hang Up</button>
                    </div>)

        var main=()=>!done && (
                <>
                    <ConversationHeader  subject={this.props.subject} bp_info={this.props.bp_info}/>
                    <div className={classes['outerBox']}>
                        {Object.keys(this.props.participants).map((participant,i)=>videoBox(participant,i,seatStyle))}
                        {agenda(agendaStyle)}
                    </div>
                    <div className={cx(classes['countdown'],humanSpeaking && (this.rerecord || !this.participants.human.speakingObjectURLs[round]) && classes['counting'], talkative && classes['talkative'])}>{TimeFormat.fromS(Math.round(this.state.countDown),"mm:ss")}</div>
                    <div style={{whiteSpace: 'pre-wrap'}}>
                        <span>{this.state.errorMsg}</span>
                    </div>
                </>
            )

        return (
            <div className={cx(classes['wrapper'],scrollableIframe && classes["scrollableIframe"])} >
                <section id="syn-ask-webrtc" key='began' className={cx(classes['innerWrapper'],scrollableIframe&&classes["scrollableIframe"])} style={{left: this.state.left}} ref={this.calculatePositionAndStyle}>
                    <audio ref={this.audio} playsInline controls={false} onEnded={this.audioEnd} key="audio"></audio>
                    {main()}
                    {this.participants.human && !intro && !begin && !done && <Preamble agreed={this.state.preambleAgreed} onClick={()=>{logger.info("Undebate preambleAgreed true"); this.setState({preambleAgreed: true}); noOverlay && this.beginButton()}} /> }
                    {ending()}
                    {(this.participants.human && this.state.preambleAgreed || !this.participants.human) && buttonBar(buttonBarStyle)} 
                    {recorderButtonBar(recorderButtonBarStyle)}
                    {(this.participants.human && this.state.preambleAgreed || !this.participants.human) && !bot && beginOverlay()}
                    {permissionOverlay()}
                    {waitingOnModeratorOverlay()}
                    {hangupButton()}
                    {hungUp()}
                </section>
            </div>
        );
    }
}

/*                     <div className={cx(intro&&classes['intro'],classes['innerImageOverlay'])}></div> */

export default injectSheet(styles)(CandidateConversation);



