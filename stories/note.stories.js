import React from 'react'

import App from '../app/components/app'

export default {
  title: 'Note',
  component: App,
  argTypes: {},
}

const Template = args => <App {...args} />

export const Normal = Template.bind({})
Normal.args = {
  iota: {
    webComponent: 'Note',
    title: 'Just a quick note',
    content: 'Just a quick note to show how notes are working',
  },
}
