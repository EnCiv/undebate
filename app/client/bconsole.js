"use strict";


// on the broswer, console.log displays objects in a way that is compact and lets you expand them through the UI.
// so this default layout will preserve the objects and pass them to console.log
function bconsoleAppender (layout, timezoneOffset) {
  layout = layout || function(e,t){
    var d=e.startTime.toString().split(' '); 
    return [d[3]+d[1]+d[2]+' '+d[4],
     e.categoryName, ...e.data]
  }
  return function(loggingEvent) {
    console.log(...layout(loggingEvent, timezoneOffset));
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return bconsoleAppender(layout, config.timezoneOffset);
}

export {bconsoleAppender as appender, configure as configure}
export default {appender: bconsoleAppender, configure: configure}
