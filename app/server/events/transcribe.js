//import Transcribe from '../../models/transcribe'
import serverEvents from './index'

async function notifyOfNewRecording() {
    logger.info('hi hih ihi hi hi hi hi hi hi')
}
serverEvents.on(serverEvents.eventNames.RecordingCreated, notifyOfNewRecording)