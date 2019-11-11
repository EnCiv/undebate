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
        "webComponent": "Undebate",
        "opening": {
            "line1": "You are about to experience a <strong>new<\/strong> kind of conversation",
            "line2": "Learn about your candidates in a more human way",
            "line3": "Fostering personal connection and understanding between candidates and voters",
            "line4": "The topic of this Candidate Conversation is:",
            "bigLine": "",
            "subLine": ""
        },
        "closing": {
            "thanks": "Thank You.",
            "iframe": {
                "src": "https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true",
                "width": "640",
                "height": "1111"
            },
            "link": {
                "name": "Your feedback would help us make this even better",
                "url": "https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform"
            }
        },
        "audio": {
            "intro": {
                "url": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1567095028/Generic_Light_Intro_7_sec_yp3lxk.wav",
                "volume": 0.8
            },
            "ending": {
                "url": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1567096104/Heart_Soul_Entire_Duet_2_min_45_sec_1_j5sbpj.wav",
                "volume": 0.2
            }
        },
        "participants": {
            "moderator": {
                "name": "David Fridley",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285574/nov2019-viewer-m-0_rywttp.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285568/nov2019-viewer-m-1_b9ubsw.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285570/nov2019-viewer-m-2_imtgfr.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285569/nov2019-viewer-m-3_jjnhhi.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285575/nov2019-viewer-m-4_g0wpjq.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285562/nov2019-m-l_xxqzma.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "1- Name",
                        "2- City and State",
                        "3- One word to describe yourself",
                        "4- What office are you running for?"
                    ],
                    [
                        "What was your first job?"
                    ],
                    [
                        "What do you love most about where you live?"
                    ],
                    [
                        "Why are you running for office; what inspired you?"
                    ],
                    [
                        "Thank you!"
                    ]
                ],
                "timeLimits": [
                    10,
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
                    "name": "David Fridley",
                    "speaking": [
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285595/nov2019-recorder-m-0_vmozhn.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285559/nov2019-recorder-m-1_j0imtt.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285568/nov2019-recorder-m-2_rv4jmm.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285549/nov2019-recorder-m-3_wlqxbu.mp4",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285557/nov2019-recorder-m-4_dqk9hv.mp4"
                    ],
                    "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1571285562/nov2019-m-l_xxqzma.mp4",
                    "agenda": [
                        [
                            "Introductions",
                            "1- Name",
                            "2- City and State",
                            "3- One word to describe yourself",
                            "4- What office are you running for?"
                        ],
                        [
                            "What was your first job?"
                        ],
                        [
                            "What do you love most about where you live?"
                        ],
                        [
                            "Why are you running for office; what inspired you?"
                        ],
                        [
                            "Thank you!"
                        ]
                    ],
                    "timeLimits": [
                        10,
                        60,
                        60,
                        60
                    ]
                },
                "audience1": {
                    "speaking": [
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631736/5d9d3d70b558b4001722b9fc-1-speaking20191009T143533241Z.webm",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631741/5d9d3d70b558b4001722b9fc-2-speaking20191009T143536132Z.webm",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631753/5d9d3d70b558b4001722b9fc-3-speaking20191009T143549533Z.webm",
                        "https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631758/5d9d3d70b558b4001722b9fc-4-speaking20191009T143553523Z.webm"
                    ],
                    "name": "Adolf Gundersen",
                    "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631749/5d9d3d70b558b4001722b9fc-2-nextUp20191009T143541489Z.webm"
                },
                "human": {
                    "listening": {
                        "round": 2,
                        "seat": "nextUp"
                    }
                }
            }
        },
        "webComponent": {
            "webComponent": "Undebate",
            "audio": {
                "intro": {
                    "url": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1567095028/Generic_Light_Intro_7_sec_yp3lxk.wav",
                    "volume": 0.8
                },
                "ending": {
                    "url": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1567096104/Heart_Soul_Entire_Duet_2_min_45_sec_1_j5sbpj.wav",
                    "volume": 0.2
                }
            },
            "participants": {},
            "opening": {
                "line1": "Thank you for taking the lead in this <strong>new<\/strong> way to engage with voters",
                "line2": "We want voters to learn about candidates in a more personal way, and candidates to have an easy way to reach voters",
                "line3": "And we want to host Candidate Conversations for every election, every election season",
                "line4": "So, we invite you to speak in this Candidate Conversation about:",
                "bigLine": "",
                "subLine": "After you hit Begin, your browser may ask you to authorize the camera and mic for use by this application."
            },
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
    newViewer.webComponent.opening.bigLine=title;


    newRecorder.path=newViewer.path+'-candidate-recorder';
    newRecorder.subject=title+"-Candidate Recorder";
    newRecorder.description="A Candidate Recorder for the Conversation: "+ title;
    newRecorder.webComponent.opening.bigLine=title;

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