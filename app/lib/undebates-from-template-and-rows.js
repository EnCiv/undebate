const cloneDeep = require('lodash/cloneDeep')
const mergeWith = require('lodash/mergeWith')
const Iota = require('civil-server').Iota

function mergeWithVerbose(dst, src, messages) {
  mergeWith(dst, src, (objValue, srcValue, key, object, source) => {
    if (messages && typeof objValue !== 'object' && typeof srcValue !== 'object' && objValue !== srcValue) {
      messages.push(`key: ${key} changing ${objValue} to ${srcValue}`)
    }
    return undefined // do the default thing - were just here to print a message about it.
  })
}

// When updating viewer/recorder pairs, once a url is created it can't be changed - even if data changes and even if some of that data is incorporated into the url calculation
// recorders need to link to the viewer records
function updateOrCreatePair(csvRowObj, template, messages) {
  return new Promise(async (ok, ko) => {
    async function createNewRecorder(viewerObj) {
      try {
        var newRecorder = cloneDeep(template.getRecorder(csvRowObj))
        template.overWriteRecorderInfo.call(template, newRecorder, viewerObj, csvRowObj)
        var recorderObj = await Iota.create(newRecorder)
        messages && messages.push(`created recorder ${viewerObj.subject}, ${viewerObj.path}, ${recorderObj.path}`)
        return ok({ viewerObj, recorderObj })
      } catch (err) {
        logger.error('createNewRecorder caught err', err)
        return err
      }
    }
    var viewers = await Iota.find({ path: template.viewerPath.call(template, csvRowObj) })
    if (viewers.length == 0) {
      // create the new race
      var newViewer = cloneDeep(template.getViewer(csvRowObj))
      template.overWriteViewerInfo.call(template, newViewer, csvRowObj)
      try {
        var viewerObj = await Iota.create(newViewer)
        createNewRecorder(viewerObj)
        return
      } catch (err) {
        logger.error('create viewer caught error:', err)
        ko(err)
      }
    } else if (viewers.length) {
      // update the race
      var viewerObj = cloneDeep(viewers[0])
      mergeWithVerbose(viewerObj, template.getViewer(csvRowObj), messages)
      template.overWriteViewerInfo.call(template, viewerObj, csvRowObj)
      const newViewerObj = await Iota.findOneAndReplace({ _id: viewerObj._id }, viewerObj, { returnNewDocument: true })
      if (!newViewerObj) ko("couldn't update viewer")
      var recorders = await Iota.find({ path: template.recorderPath.call(template, csvRowObj) })
      if (recorders.length === 0) {
        // it didn't exist
        createNewRecorder(viewerObj)
        return
      } else {
        var newRecorder = cloneDeep(recorders[0])
        mergeWithVerbose(newRecorder, template.getRecorder(csvRowObj), messages)
        template.overWriteRecorderInfo.call(template, newRecorder, viewerObj, csvRowObj)
        var recorderObj = await Iota.findOneAndReplace({ _id: newRecorder._id }, newRecorder, {
          returnNewDocument: true,
        })
        if (!recorderObj) ko("couldn't update recorder")
        return ok({ viewerObj, recorderObj })
      }
    }
  })
}

function undebatesFromTemplateAndRows(viewerRecorderTemplate, rowObjs) {
  let messages = []
  let updatedRowObjs = cloneDeep(rowObjs)
  return new Promise(async (ok, ko) => {
    viewerRecorderTemplate.setup && viewerRecorderTemplate.setup(updatedRowObjs)
    try {
      for await (let csvRowObj of updatedRowObjs) {
        // need to make sure the preceeding update is done, before doing the next one - so don't do this in a forEach loop where they all get fired off in parallel
        const { viewerObj, recorderObj } = await updateOrCreatePair(csvRowObj, viewerRecorderTemplate, messages)
        viewerRecorderTemplate.updateProperties.call(viewerRecorderTemplate, csvRowObj, viewerObj, recorderObj)
      }
      ok({ rowObjs: updatedRowObjs, messages })
    } catch (error) {
      logger.error('undebatesFromTemplateAndRows caught error', error.message ? error.message : error)
      ko(error)
    }
  })
}

module.exports = undebatesFromTemplateAndRows
