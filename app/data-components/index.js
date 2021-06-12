'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true,
})
exports.default = exports.DataComponents = void 0
// the line below will be replace with the auto generated table of components from the referenced directories
const Components = {
  CafeParticipants: require('./cafe-participants'),
  MergeChildren: require('./merge-children'),
  MergeParticipants: require('./merge-participants'),
  UndebateCreator: require('./undebate-creator'),
}
/**
 * The main source of the following code is in github.com/EnCiv/civil-server/app/components/data-components-template.js
 * do not edit it in any other repo - it will get clobbered by the next build.
 *
 */

class DataComponents {
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
    logger.error('DataComponent component not defined', {
      component,
    })
    return null
  }
}

exports.DataComponents = DataComponents
var _default = DataComponents
exports.default = _default
//# sourceMappingURL=data-components-template.js.map
