import React from 'react'
import { shallow } from 'enzyme'

import Button from '../button'

describe('Button', () => {
  it('should render correctly', () => {
    const component = shallow(<Button />)

    expect(component).toMatchSnapshot()
  })

  it('should call onClick when button is clicked', () => {
    const onClick = jest.fn()
    const component = shallow(<Button onClick={onClick} />)

    component.simulate('click')

    expect(onClick).toHaveBeenCalled()
  })

  it('should pass className to rendered component', () => {
    const component = shallow(<Button className="foo" />)

    expect(component).toHaveClassName('foo')
  })

  it('should render child element', () => {
    const component = shallow(<Button>Next</Button>)

    expect(component.childAt(0).text()).toEqual('Next')
    expect(component).toMatchSnapshot()
  })
})
