'use strict'
// @create-index
// imagine one day a program that automatically generates this
// until that day, this is manual
//
// TypeComponent will accept a function (.default) or a module (exports), so you don't need to add .default to new entries.
// Also, TypeComponent.attributes() will return module.attributes if it is defined.

const Components = {
  CafeParticipants: require('./cafe-participants'),
  MergeParticipants: require('./merge-participants'),
  UndebateCreator: require('./undebate-creator'),
}

export class DataComponent {
  static attributes(component) {
    let Component
    if (typeof component === 'object') {
      Component = Components[component.component]
      if (typeof Component === 'object') return Component.attributes
      else return {}
    } else {
      Component = Components[component]
      if (typeof Component === 'object') return Component.attributes
      else return {}
    }
  }
  static fetch(component) {
    var Component

    if (typeof component === 'object') {
      Component = Components[component.component]
      if (typeof Component === 'object') Component = Component.default
    } else {
      Component = Components[component]
      if (typeof Component === 'object') Component = Component.default
    }

    if (typeof Component === 'function') return Component
    logger.error('DataComponent component not defined', { component })
    return null
  }
}
