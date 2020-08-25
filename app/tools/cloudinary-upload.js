var fs = require('fs')
var cloudinary = require('cloudinary')

function uploadFile(filename) {
  return new Promise((ok, ko) => {
    var readStream = fs.createReadStream(filename)
    const public_id = filename.split('.')[0]

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function() {
      // This just pipes the read stream to the response object (which goes to the client)
      var cloudStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'video',
          public_id,
          eager_async: false, // wait for the response
          eager: [
            { width: 640, height: 360, crop: 'fill', quality: 'auto:good', format: 'mp4' },
            { width: 640, height: 360, crop: 'fill', start_offset: 0, format: 'png' },
          ],
        },
        (err, result) => {
          // you can't set the timeout:120000 option in the first paramater - it gets an error 504
          if (err) {
            console.error('upload video cloudinary.uploader.upload_stream error:', err, filename)
            ko()
          } else {
            console.info(filename, 'got:', result)
            ok(result.eager.map(obj => obj.secure_url))
          }
        }
      )
      cloudStream.on('error', err => {
        console.info('cloudStream error:', err)
        ko(err)
      })
      readStream.pipe(cloudStream).on('error', err => {
        console.error('Error uploading stream:', filename, err)
        ko(err)
      })
    })

    // This catches any errors that happen while creating the readable stream (usually invalid names)
    readStream.on('error', err => {
      console.error('stream file got error', err)
      ko(err)
    })
    readStream.on('end', () => console.info(filename, 'streamed'))
  })
}

async function uploadFiles(files) {
  for await (const file of files) {
    console.info('uploading', file)
    try {
      const url = await uploadFile(file)
      console.info(file, '=>', url)
    } catch (err) {
      console.error('error uploading file', file, 'continuing')
    }
  }
  console.info('files done')
  process.exit(0)
}

if (process.args < 2) {
  console.info('put file names on the command line')
  process.exit(0)
}
if (!process.env.CLOUDINARY_URL) {
  console.error('CLOUDINARY_URL must be defined in the environment')
}

const [arg1, arg2, ...files] = process.argv

uploadFiles(files)
