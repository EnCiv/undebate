'use strict'

// send the loggingEvent to the sever - unchanged by layout
function socketloggerAppender(layout, timezoneOffset) {
  return function(loggingEvent) {
    window.socket.emit('socketlogger', loggingEvent)
  }
}

function configure(config) {
  var layout
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout)
  }
  return socketloggerAppender(layout, config.timezoneOffset)
}

export { socketloggerAppender as appender, configure }
export default { appender: socketloggerAppender, configure: configure }
