'use strict;'
import cloudinary from 'cloudinary'

export default function streamUploadVideo(stream, data, cb) {
  try {
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
    stream.pipe(cloudStream).on('error', err => {
      logger.error('Error uploading stream:', filename, err)
      cb()
    })
    cloudStream.on('error', err => {
      console.info('cloudStream error:', err)
      cb()
    })
  } catch (err) {
    logger.error('caught error in streamUploadVideo, continuing')
    return
  }
}
