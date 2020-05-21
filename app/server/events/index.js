'use strict;'

/* creates an Event Emitter that can be imported across the project to be accessed by all components
serverEvents.eNames is a list of names of events that can be emitted and subscribed to.  Code should not just emit a string, 
it should add the string to this file so that we have a list of possible events, for future programmers to look at, and so that we avoid tyops in event names.
*/
var serverEvents = new (require('events').EventEmitter)()
serverEvents.eNames = {
  ParticipantCreated: 'ParticipantCreated', // (iota)=>{...} emitted by app/api/create-participant after a participant has been created,
  RecordingCreated: 'RecordingCreated',
}
module.exports = serverEvents
