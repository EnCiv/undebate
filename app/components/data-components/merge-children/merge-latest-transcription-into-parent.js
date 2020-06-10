'use strict;'

export default function mergeLatestTranscriptionIntoParent(childIotas, parentIota) {
  // the list is sorted by date, find the first / youngest child with a socialpreview
  let transcribe
  childIotas.some(iota =>
    iota.component && iota.component.component === 'Transcription' ? (transcribe = iota) : false
  ) // .some to stop after finding the first one
  if (transcribe) {
    if (!parentIota.webComponent) parentIota.webComponent = {}
    if (!parentIota.webComponent.metaTags) parentIota.webComponent.metaTags = []
    else
      parentIota.webComponent.metaTags = parentIota.webComponent.metaTags.filter(tag => !/og:transcription/.test(tag)) // filter out any image tags
    parentIota.webComponent.metaTags.push(`property="og:transcription" content="${transcribe.component.transcription}"`)
  }
}
