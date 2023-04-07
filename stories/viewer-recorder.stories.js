import React from 'react'

import ViewerRecorder from '../app/web-components/cc-wrapper/viewer-recorder'
import { merge } from 'lodash'
import { DynamicFontSizeClientHelmet } from '../app/components/dynamic-font-size-helmet'

export default {
    title: 'ViewerRecorder',
    component: ViewerRecorder,
    argTypes: {},
    decorators: [
        Story => (
            <>
                <DynamicFontSizeClientHelmet />
                <Story />
            </>
        ),
    ],
}

const iota = {
    webComponent: {
        "autoCameraStart": true,
        "opening": {
            "noPreamble": true
        },
        "logo": "none",
        "instructionLink": "/candidate-conversation-candidate-recorder/instructions",
        "metaTags": [
            "property=\"og:title\" content=\"What is Democracy\"",
            "property=\"og:image\" content=\"https://res.cloudinary.com/hf6mryjpf/image/upload/v1587412519/what-is-democracy-preview-2020Apr20_cl3ziv.png\""
        ],
        "hangupButton": {
            "name": "Exit"
        },
        "maxParticipants": 5,
        "webComponent": "CcWrapper",
        "participants": {
            "moderator": {
                "name": "David Fridley",
                "speaking": [
                    ["https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341399/5e8cec3912d6e10017ed9caa-0-speaking20230320T194318392Z.mp4", "https://video.wixstatic.com/video/2796e1_f65b9429e7a144cc80f6cfe50d49e780/480p/mp4/file.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341401/5e8cec3912d6e10017ed9caa-1-speaking20230320T194319647Z.mp4"],
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341402/5e8cec3912d6e10017ed9caa-2-speaking20230320T194320764Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341403/5e8cec3912d6e10017ed9caa-3-speaking20230320T194322403Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341405/5e8cec3912d6e10017ed9caa-4-speaking20230320T194323624Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341406/5e8cec3912d6e10017ed9caa-5-speaking20230320T194325114Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341407/5e8cec3912d6e10017ed9caa-6-speaking20230320T194326426Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341408/5e8cec3912d6e10017ed9caa-7-speaking20230320T194327292Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341409/5e8cec3912d6e10017ed9caa-8-speaking20230320T194328169Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341410/5e8cec3912d6e10017ed9caa-9-speaking20230320T194329403Z.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1679341412/5e8cec3912d6e10017ed9caa-0-listening20230320T194330611Z.mp4",
                "agenda": [
                    [
                        ['The Electoral College'],
                        ["Reform 1: The National Popular Vote"],
                        ["Do you support or oppose a transition to a National Popular Vote system and the elimination of the Electoral College? Why? Why not?"],
                    ],
                    ["By having each person's vote count equally nationwide, does a National Popular Vote system create a more equal and fair system for the election of our president? Should this principle of equality be a necessary part of our democratic republic? "],
                    ["Is it valuable for every state to have at least a certain amount of influence in the election of our president, regardless of their size, as is the case in the current system?"],
                    ["Would smaller states and rural areas see their influence on national politics diminish as a result of a transition to a national popular vote? If so, is this an acceptable or unacceptable condition for our presidential elections?"],
                    ["What effect would a transition to a National Popular Vote have upon the way presidential candidates' campaign? Would they ignore small states and less populated areas in favor of more populous areas of the country? "],
                    ["Would the changes in the way presidential candidate's campaign be a fair outcome of each person's vote counting equally?"],
                    ["What effect would a transition to a National Popular Vote have upon voter turnout? "],
                    ["What is required for a transition to a National Popular Vote? Is a transition to a National Popular Vote practical and feasible within our current political system? Why? Why not?"],
                    ["Thank you"],
                ],
                "timeLimits": [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60]
            },
            "audience1": {
                "speaking": [
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583876500/5e68098e9f2f3600177ab1af-0-speaking20200310T214140489Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583876503/5e68098e9f2f3600177ab1af-1-speaking20200310T214141310Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583876507/5e68098e9f2f3600177ab1af-2-speaking20200310T214143708Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583876512/5e68098e9f2f3600177ab1af-3-speaking20200310T214148300Z.mp4"
                ],
                "name": "David Fridley",
                "listening": "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583876513/5e68098e9f2f3600177ab1af-0-listening20200310T214152882Z.mp4",
            },
            "audience2": {
                "speaking": [
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940332/5e68ff1619a56d0017c492ac-0-speaking20200311T152531818Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940335/5e68ff1619a56d0017c492ac-1-speaking20200311T152532379Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940339/5e68ff1619a56d0017c492ac-2-speaking20200311T152535299Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940344/5e68ff1619a56d0017c492ac-3-speaking20200311T152539296Z.mp4"
                ],
                "name": "Adolf G Gundersen",
                "listening": "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940350/5e68ff1619a56d0017c492ac-0-listening20200311T152544519Z.mp4",
                "bp_info": {
                    "stage_id": "0",
                    "election_date": "2020-11-03"
                }
            },
            "audience3": {
                "speaking": [
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940332/5e68ff1619a56d0017c492ac-0-speaking20200311T152531818Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940335/5e68ff1619a56d0017c492ac-1-speaking20200311T152532379Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940339/5e68ff1619a56d0017c492ac-2-speaking20200311T152535299Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940344/5e68ff1619a56d0017c492ac-3-speaking20200311T152539296Z.mp4"
                ],
                "name": "Adolf G Gundersen",
                "listening": "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940350/5e68ff1619a56d0017c492ac-0-listening20200311T152544519Z.mp4",
                "bp_info": {
                    "stage_id": "0",
                    "election_date": "2020-11-03"
                }
            },
            "audience4": {
                "speaking": [
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940332/5e68ff1619a56d0017c492ac-0-speaking20200311T152531818Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940335/5e68ff1619a56d0017c492ac-1-speaking20200311T152532379Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940339/5e68ff1619a56d0017c492ac-2-speaking20200311T152535299Z.mp4",
                    "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940344/5e68ff1619a56d0017c492ac-3-speaking20200311T152539296Z.mp4"
                ],
                "name": "Adolf G Gundersen",
                "listening": "https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1583940350/5e68ff1619a56d0017c492ac-0-listening20200311T152544519Z.mp4",
                "bp_info": {
                    "stage_id": "0",
                    "election_date": "2020-11-03"
                }
            }/*
            "human": {
                "listening": {
                    "round": 1,
                    "seat": "nextUp"
                }
            }*/
        },
        "closing": {
            "thanks": "Thank You!",
            "iframe": {
                "src": "https://docs.google.com/forms/d/e/1FAIpQLScYiUwoqCmlqr5KQf99ewVRxEvyCrx9CvSH196xlqqtj7cEkg/viewform?embedded=true",
                "width": 640,
                "height": 1579
            }
        }
    },
    env: 'development',
    path: '/country:us/organization:cfa/office:moderator/2021-03-21-recorder-622157bbc1644259e8614a9b',
    user: {
        email: 'ddfridley@yahoo.com',
        id: '621e826899902756d4ba49f5',
    },
    browserConfig: {
        os: {
            name: 'windows',
            version: [10, 0],
            versionString: '10.0',
        },
        browser: {
            name: 'chrome',
            version: [98, 0, 4758, 102],
            versionString: '98.0.4758.102',
        },
        type: 'desktop',
        model: '',
        ip: '::ffff:127.0.0.1',
    },
    _id: '622157bbc1644259e8614a9c',
    component: {
        component: 'UndebateCreator',
        participants: {},
    },
    bp_info: {
        office: 'Moderator',
        election_date: '03/21/2021',
        candidate_name: 'Bill Smith',
        last_name: 'Smith',
        unique_id: '622157bbc1644259e8614a9b',
        candidate_emails: ['billsmith@gmail.com'],
        party: '',
        election_source: 'CodeForAmerica.NAC',
    },
    subject: 'Moderator-Candidate Recorder',
    description: 'A Candidate Recorder for the undebate: Moderator',
    parentId: '621e8aefe7db9b6338d0ab74',
}

const otherProps = {
    env: 'development',
    user: {
        email: 'ddfridley@yahoo.com',
        id: '621e826899902756d4ba49f5',
    },
    browserConfig: {
        os: {
            name: 'windows',
            version: [10, 0],
            versionString: '10.0',
        },
        browser: {
            name: 'chrome',
            version: [98, 0, 4758, 102],
            versionString: '98.0.4758.102',
        },
        type: 'desktop',
        model: '',
        ip: '::ffff:127.0.0.1',
    },
    bp_info: {
        office: 'Moderator',
        election_date: '03/21/2021',
        candidate_name: 'Bill Smith',
        last_name: 'Smith',
        unique_id: '622157bbc1644259e8614a9b',
        candidate_emails: ['billsmith@gmail.com'],
        party: '',
        election_source: 'CodeForAmerica.NAC',
    },
}

const Template = args => <ViewerRecorder {...args} />

export const Undebate = Template.bind({})
Undebate.args = {
    dispatch: () => { },
    ccState: {
        reviewing: false, // true then ViewerRecorder is in review mode rather than record mode
        participants: {}, // this is written directly by ViewerRecorder to preserve stored video, and computed video url, referenced by Ending to upload the videos}
    },
    ...iota.webComponent,
}

const cc3 = {
    _id: {
        $oid: '5e7e6e147c213e3443f116e5',
    },
    path: '/candidate-conversation-3',
    subject: 'Candidate Conversation with 3 participants',
    description: 'A prototype Candidate Conversation for schoolboard',
    component: {
        component: 'MergeChildren',
    },
    webComponent: {
        webComponent: 'CandidateConversation',
        opening: {
            line1: 'You are about to experience a new kind of conversation',
            line2: 'This is how voters can learn about candidates in a more human way',
            line3:
                'And this is how we can efficiently facilitate 500K conversations all over the country, every election season',
            line4: 'The topic of the discussion is:',
            bigLine: 'US School Board Candidate Conversation',
            subLine: 'This is a mock conversation, these are not real candidates',
        },
        participants: {
            moderator: {
                name: 'David Fridley',
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788682/candidate-conversation-moderator-0_at5un1.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788667/candidate-converation-moderator-1_z2kjhr.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788659/candidate-confersation-moderator-2_cid3dq.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788634/candidate-conversation-moderator-3_iq0npa.mp4',
                ],
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788719/candidate-conversation-moderator-listening_nlfeoy.mp4',
                agenda: [
                    [
                        'Introductions',
                        '1- Who you are',
                        '2- Where you are',
                        '3- One word to describe yourself',
                        '4- What office you are running for',
                    ],
                    ['What type of skills should students be learning for success in the 21st century?'],
                    ['Closing Remarks'],
                    ['Thank you'],
                ],
                timeLimits: [10, 60, 60],
            },
            audience1: {
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566942893/5d5dc697d32514001766ca87-1-speaking20190827T215452394Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566942898/5d5dc697d32514001766ca87-2-speaking20190827T215455964Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566942903/5d5dc697d32514001766ca87-3-speaking20190827T215503161Z.mp4',
                ],
                name: 'Will',
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566942901/5d5dc697d32514001766ca87-2-nextUp20190827T215500659Z.mp4',
            },
            audience2: {
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1567120064/5d685ab98d5ab100175a1dd7-1-speaking20190829T230738520Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/du_41/v1567120076/5d685ab98d5ab100175a1dd7-2-speaking20190829T230743431Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1567120089/5d685ab98d5ab100175a1dd7-3-speaking20190829T230802074Z.mp4',
                ],
                name: 'MaryBeth MaryBeth McGarvey',
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1567120083/5d685ab98d5ab100175a1dd7-2-nextUp20190829T230755711Z.mp4',
            },
            audience3: {
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566839072/5d64111ba62cb60017dad9eb-1-speaking20190826T170428600Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566839081/5d64111ba62cb60017dad9eb-2-speaking20190826T170432708Z.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566839337/5d64111ba62cb60017dad9eb-3-speaking20190826T170818981Z.mp4',
                ],
                name: 'Alex Johnson',
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566926818/5d64111ba62cb60017dad9eb-listening20190826T170818981Z_s1wphm.mp4',
            },
        },
    },
}

export const CandidateConversation = Template.bind({})
const ccIota = merge({}, cc3, otherProps)
CandidateConversation.args = {
    iota: ccIota,
}

const ccWrapperIota = {
    _id: {
        $oid: '5f7ca753e7179a6ea5213fb0',
    },
    path: '/qa/ccwrapper-recorder',
    subject: 'You are invited to record a Candidate Conversation',
    description: 'A Recorder for the Candidate Conversation with 2 participants using CC wrapper',
    webComponent: {
        webComponent: 'CcWrapper',
        instructionLink: 'https://docs.google.com/document/d/1fORs9PlLss9azlsnf0A0lxFoOzDQJ9RJ-zNRZ583SVo/edit?usp=sharing',
        participants: {
            moderator: {
                name: 'David Fridley',
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788719/candidate-conversation-creator-moderator-0_d7a3zr.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788635/candidate-conversation-creator-moderator-1_gtchg2.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788669/candidate-conversation-creator-moderator-2_bsceus.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788656/candidate-conversation-creator-moderator-3_qomqgj.mp4',
                ],
                listening:
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788719/candidate-conversation-moderator-listening_nlfeoy.mp4',
                agenda: [
                    [
                        'Introductions',
                        '1- Who you are',
                        '2- Where you are',
                        '3- One word to describe yourself',
                        '4- What office you are running for',
                    ],
                    ['What type of skills should students be learning for success in the 21st century?'],
                    ['Closing Remarks'],
                    ['Thank you'],
                ],
                timeLimits: [10, 60, 60],
            },
            audience1: {
                name: 'Adolf Gundersen',
                speaking: [
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a1.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a2.mp4',
                    'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a3.mp4',
                ],
                listening: 'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-as.mp4',
            },
            human: {
                listening: {
                    round: 2,
                    seat: 'nextUp',
                },
            },
        },
        closing: {
            thanks: 'Thank You.',
            iframe: {
                src: 'https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true',
                width: '640',
                height: '1511',
            },
        },
    },
    parentId: '5f7ca481e7179a6ea5213f43',
}

export const CcWrapper = Template.bind({})
CcWrapper.args = {
    iota: merge({}, ccWrapperIota, otherProps),
}

export const CcWrapperWithListeningFirst = Template.bind({})
CcWrapperWithListeningFirst.args = {
    iota: merge({}, iota, { webComponent: { webComponent: 'CcWrapper' } }),
}

/* Todo fix Component so they do not error if empty props
export const NothingHere = Template.bind({})
NothingHere.args = {
  iota: {
    webComponent: {
      webComponent: 'Undebate',
    },
  },
}
*/
