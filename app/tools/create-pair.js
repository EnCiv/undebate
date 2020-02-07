'use strict';

import Iota from '../models/iota'
import cloneDeep from 'lodash/cloneDeep';
import S from 'string';
import MongoModels from 'mongo-models'

import log4js from 'log4js';

if(!global.logger) {
  global.logger=log4js.getLogger("node");
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } }
  });
}



const viewer={
    "path": "",
    "subject": "",
    "description": "",
    "component": {
        "component": "MergeParticipants"
    },
    "webComponent": {
        "webComponent": "CandidateConversation",
        "closing": {
            "thanks": "Thank You.",
            "iframe": {
                "src": "https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true",
                "width": "640",
                "height": "1111"
            }
        },
        "shuffle": true,
        "participants": {
            "moderator": {
                "name": "Krystina",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063510/5e3d18093ebd3a0017d9621b-0-speaking20200207T081823130Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063512/5e3d18093ebd3a0017d9621b-1-speaking20200207T081830137Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063515/5e3d18093ebd3a0017d9621b-2-speaking20200207T081832445Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063516/5e3d18093ebd3a0017d9621b-3-speaking20200207T081835275Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063517/5e3d18093ebd3a0017d9621b-4-speaking20200207T081836283Z.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581062208/5e3d18093ebd3a0017d9621b-5-speaking20200207T075645245Z.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "1- Name",
                        "2- City and State",
                        "3- One word to describe yourself",
                        "4- What role you are running for?"
                    ],
                    [
                        "How did you get started with your brigade?"
                    ],
                    [
                        "What do you hope a volunteer will be able to do by joining the CfA Brigade Network that they can’t do anywhere else?"
                    ],
                    [
                        "What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?"
                    ],
                    [
                        "Thank you!"
                    ]
                ],
                "timeLimits": [
                    15,
                    60,
                    60,
                    60
                ]
            }
        }
    }
}

const recorder={
        "path": "",
        "subject": "",
        "description": "",
        "component": {
            "component": "UndebateCreator",
            "participants": {
                "moderator": {
                    "name": "Krystina",
                    "speaking": [
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto,so_4,eo_79/v1581062197/5e3d18093ebd3a0017d9621b-0-speaking20200207T075617766Z.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto,so_0/l_video:v1581107486:5e3d18093ebd3a0017d9621b-0-speaking20200207T075617766Z_ajcca3,q_auto,fl_splice,so_0/v1581062198/5e3d18093ebd3a0017d9621b-1-speaking20200207T075637213Z.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063515/5e3d18093ebd3a0017d9621b-2-speaking20200207T081832445Z.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063516/5e3d18093ebd3a0017d9621b-3-speaking20200207T081835275Z.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581063517/5e3d18093ebd3a0017d9621b-4-speaking20200207T081836283Z.mp4"
                    ],
                    "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1581062208/5e3d18093ebd3a0017d9621b-5-speaking20200207T075645245Z.mp4",
                    "agenda": [
                        [
                            "Introductions",
                            "1- Name",
                            "2- City and State",
                            "3- One word to describe yourself",
                            "4- What role you are running for?"
                        ],
                        [
                            "How did you get started with your brigade?"
                        ],
                        [
                            "What do you hope a volunteer will be able to do by joining the CfA Brigade Network that they can’t do anywhere else?"
                        ],
                        [
                            "What is the one thing you want us to know about your candidacy that was not covered by the candidate questions provided?"
                        ],
                        [
                            "Thank you!"
                        ]
                    ],
                    "timeLimits": [
                        15,
                        60,
                        60,
                        60
                    ]
                },
                "audience1": {
                    "speaking": [
                        "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1581113918/5e28efbf14af500017ddf308-0-speaking20200207T221838206Z.webm",
                        "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1581113919/5e28efbf14af500017ddf308-1-speaking20200207T221839188Z.webm",
                        "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1581113921/5e28efbf14af500017ddf308-2-speaking20200207T221840554Z.webm",
                        "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1581113921/5e28efbf14af500017ddf308-3-speaking20200207T221842137Z.webm"
                    ],
                    "name": "David Fridley",
                    "listening": "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1581110091/5e28efbf14af500017ddf308-0-listening20200207T211451089Z.webm"
                },
                "human": {
                    "listening": {
                        "round": 3,
                        "seat": "nextUp"
                    }
                }
            }
        },
        "webComponent": {
            "webComponent": "Undebate",
            "participants": {},
            "closing": {
                "thanks": "Thank You.",
                "link": {
                    "name": "Your feedback would help us make this even better",
                    "url": "https://docs.google.com/forms/d/e/1FAIpQLSeMNX1zEUAVuI3aZY9qreBfqMaXsS-yMLf7WYiylqVjHvoP2g/viewform"
                },
                "iframe": {
                    "src": "https://docs.google.com/forms/d/e/1FAIpQLSeMNX1zEUAVuI3aZY9qreBfqMaXsS-yMLf7WYiylqVjHvoP2g/viewform?embedded=true",
                    "width": 700,
                    "height": 1122
                }
            }
        },
        "parentId": ""
    }


async function newPair(title){

    if ( ! process.env.MONGODB_URI ) {
        throw new Error('Missing MONGODB_URI');
    }
    await MongoModels.connect({uri: process.env.MONGODB_URI},{});
    while (MongoModels.toInit && MongoModels.toInit.length){  // any models that need to createIndexes will push their init function
        MongoModels.toInit.shift()();
    }


    var newViewer=cloneDeep(viewer);
    var newRecorder=cloneDeep(recorder);
    newViewer.path='/'+S(title).slugify().s;
    newViewer.subject=title;
    newViewer.description="A Candidate Conversation for: "+title;
    if(newViewer.webComponent.opening) newViewer.webComponent.opening.bigLine=title;


    newRecorder.path=newViewer.path+'-candidate-recorder';
    newRecorder.subject=title+"-Candidate Recorder";
    newRecorder.description="A Candidate Recorder for the Conversation: "+ title;
    if(newRecorder.webComponent.opening) newRecorder.webComponent.opening.bigLine=title;

    try {
        var viewerObj=await Iota.create(newViewer);

        newRecorder.parentId=viewerObj._id.toString();

        var recorderObj=await Iota.create(newRecorder);

        console.info("created",title,viewerObj.path,recorderObj.path);
        MongoModels.disconnect();
        return;
    }
    catch(err){
        console.error("create viewer caught error:", err);
        MongoModels.disconnect();
    }
}

if(process.argv.length===3){
    newPair(process.argv[2])
}else {
    console.error("error - expected 1 argument, got:", process.argv.length-2)
}