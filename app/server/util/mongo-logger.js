"use strict";
import Log from "../../models/log";



// write the logging event into the mongo log collection as a document. 
// in this case we are adding source to indicate that this record came from the server - there may be another logger that's adding from a different source
function mongologgerAppender (layout, timezoneOffset, source) {
  return function(loggingEvent) {
    Log.create({startTime: loggingEvent.startTime, source, level: loggingEvent.level.levelStr.toLowerCase(), data: loggingEvent.data});
  };
}

function configure(config) {
  var layout;
  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }
  return mongologgerAppender(layout, config.timezoneOffset, config.source || "");
}

export {mongologgerAppender as appender, configure as configure}
export default {appender: mongologgerAppender, configure: configure}