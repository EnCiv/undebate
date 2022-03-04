import React from 'react'

import App from '../app/components/app'

export default {
  title: 'App',
  component: App,
  argTypes: {},
}

const Template = args => <App {...args} />

export const Normal = Template.bind({})
Normal.args = {
  iota: {
    _id: {
      $oid: '600610cd63b01a0854ddf1b3',
    },
    path: '/home',
    subject: 'Civil Server Template',
    description: 'Civil Server Template Home Page',
    webComponent: 'TestJoin',
  },
}

export const NothingHere = Template.bind({})
NothingHere.args = {}
