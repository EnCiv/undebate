'use strict;'

export default function supportsVideoType(type) {
  // Allow user to create shortcuts, i.e. just "webm"
  let formats = {
    ogg: 'video/ogg; codecs="theora"',
    mp4: 'video/mp4; codecs="avc1.42E01E"',
    webm: 'video/webm; codecs="vp8, vorbis"',
    vp9: 'video/webm; codecs="vp9"',
    hls: 'application/x-mpegURL; codecs="avc1.42E01E"',
  }

  let video = document.createElement('video')

  return video.canPlayType(formats[type] || type)
}
