import React from 'react'

import App from '../app/components/app'

export default {
  title: 'Undebate',
  component: App,
  argTypes: {},
}

const Template = args => <App {...args} />

export const Normal = Template.bind({})
Normal.args = {
  iota: {
    webComponent: {
      webComponent: 'Undebate',
      logo: 'undebate',
      instructionLink: '',
      participants: {
        moderator: {
          speaking: [
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893716/5d5b74751e3b194174cd9b94-1-speaking20210304T213504684Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893717/5d5b74751e3b194174cd9b94-3-speaking20210304T213516602Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893718/5d5b74751e3b194174cd9b94-5-speaking20210304T213517487Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893719/5d5b74751e3b194174cd9b94-6-speaking20210304T213517927Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894042/5d5b74751e3b194174cd9b94-1-speaking20210304T214041075Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614894043/5d5b74751e3b194174cd9b94-2-speaking20210304T214041861Z.mp4',
          ],
          name: 'David Fridley, EnCiv',
          listening:
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1614893720/5d5b74751e3b194174cd9b94-0-listening20210304T213518628Z.mp4',
          agenda: [
            ['How this works', 'Placeholder'],
            ['What is your favorite color?'],
            ['Do you have a pet?'],
            ['Should we try to fix income inequality?'],
            ['Make your closing - to the audience'],
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
  },
}

export const NothingHere = Template.bind({})
NothingHere.args = {
  iota: {
    webComponent: {
      webComponent: 'Undebate',
    },
  },
}
