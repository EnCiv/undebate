'use strict;'
import cloudinary from 'cloudinary'

export default function streamUploadVideo(stream, data, cb) {
  try {
    logger.info("streamUploadVideo", data)
    let self = this // an ss(socket)
    const public_id = data.name.split('.')[0]
    var cloudStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: 'video',
        public_id,
        eager_async: true,
        eager: [
          { quality: 'auto:good', format: 'mp4' },
          { start_offset: 0, format: 'png' },
        ],
      },
      (err, result) => {
        // you can't set the timeout:120000 option in the first paramater - it gets an error 504
        if (err) {
          logger.error('stream-upload-video cloudinary.uploader.upload_stream error:', err, data)
          cb()
        } else {
          cb(result.secure_url)
        }
      }
    )
    logger.info("streamUploadVideo cloudStream opened")
    cloudStream.on('error', err => {
      logger.info('cloudStream error:', err)
      cb()
    })
    stream.pipe(cloudStream).on('error', err => {
      if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
        //socket-stream does not close correctly so we need to do it manually
        self._ondisconnect() // disconnect the stream
        self.sio.disconnect(true) // disconnect the whole socket
        logger.error('Error uploading stream - caught ERR_STREAM_PREMATIRE_CLOSE', public_id)
      } else logger.error('Error uploading stream:', public_id, err)
      cb()
    })
    logger.info("streamUploadVideo stream.pipe opened")
  } catch (err) {
    logger.error('caught error in streamUploadVideo, continuing', err)
    return
  }
}
