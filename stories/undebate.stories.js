import React from 'react'

import App from '../app/components/app'
import { cloneDeep, merge } from 'lodash'
import iotas from '../iotas.json'

export default {
  title: 'Undebate',
  component: App,
  argTypes: {},
}

const iota = {
  webComponent: {
    webComponent: 'Undebate',
    logo: 'undebate',
    instructionLink: '',
    participants: {
      moderator: {
        speaking: [
          'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4',
          'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4',
          //'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
          //'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
          //'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
          'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
        ],
        name: 'David Fridley, EnCiv',
        listening:
          'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
        agenda: [
          ['How this works', 'Placeholder'],
          ['What is your favorite color?'],
          //['Do you have a pet?'],
          //['Should we try to fix income inequality?'],
          //['Make your closing - to the audience'],
          ['Thank you'],
        ],
        timeLimits: [15, 60, 60, 60, 60],
      },
      human: {
        listening: {
          round: 0,
          seat: 'speaking',
        },
        name: 'Bill Smith',
      },
    },
    opening: {
      noPreamble: false,
    },
    closing: {
      thanks: 'Thank You.',
      iframe: {
        src: 'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
        width: 640,
        height: 1550,
      },
    },
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

const Template = args => <App {...args} />

export const Undebate = Template.bind({})
Undebate.args = {
  iota: iota,
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

export const NothingHere = Template.bind({})
NothingHere.args = {
  iota: {
    webComponent: {
      webComponent: 'Undebate',
    },
  },
}
