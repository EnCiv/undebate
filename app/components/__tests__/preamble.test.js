import React from 'react'
import { shallow } from 'enzyme'

import Preamble from '../preamble'

describe('Preamble', () => {
  it('should render correctly', () => {
    const component = shallow(<Preamble />)

    expect(component).toMatchSnapshot()
  })
})
