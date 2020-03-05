#!/usr/bin/env node
'use strict'

// this file makes it possible to create conversation viewer and candidate-recorder link pairs by combining information from a spreadsheet file, and an object template (below)
// the csv file lists the election Race names, and links to the viewer and recorder for that race - if they exist
// the program creates or updates records in the db, and generates a new spreadsheet -out.csv that includes the new links.  If a link was changes, a column shows that it was changed.

import Iota from '../models/iota'
import cloneDeep from 'lodash/cloneDeep'
import S from 'underscore.string'
import MongoModels from 'mongo-models'
const csv = require('csvtojson')
const ObjectsToCsv = require('objects-to-csv')
import mergeWith from 'lodash/mergeWith'

// Iota uses logger
import log4js from 'log4js'

if (!global.logger) {
  global.logger = log4js.getLogger('node')
  log4js.configure({
    appenders: { err: { type: 'stderr' } },
    categories: { default: { appenders: ['err'], level: 'DEBUG' } },
  })
}

const viewer = {
  // properties that are commented out so prevent messages about their are being changed when they are overwriten by whats in the CSV file
  //"path": "",
  //"subject": "",
  //"description": "",
  component: {
    component: 'MergeParticipants',
  },
  webComponent: {
    webComponent: 'Undebate',
    opening: {
      line1: 'You are about to experience a <strong>new</strong> kind of conversation',
      line2: 'Learn about your candidates in a more human way',
      line3: 'Fostering personal connection and understanding between candidates and voters',
      line4: 'The topic of this Candidate Conversation is:',
      //            "bigLine": "",
      subLine: '',
    },
    closing: {
      thanks: 'Thank You.',
      iframe: {
        src:
          'https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true',
        width: '640',
        height: '1511',
      },
      link: {
        name: 'Your feedback would help us make this even better',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform',
      },
    },
    audio: {
      intro: {
        url: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1567095028/Generic_Light_Intro_7_sec_yp3lxk.mp3',
        volume: 0.8,
      },
      ending: {
        url: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1572494761/Heart_Soul_10-sec_FadeIn_Out_ordi04.mp3',
        volume: 0.2,
      },
    },
    shuffle: true,
    participants: {
      moderator: {
        name: 'David Fridley',
        speaking: [
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573166596/Moderator-0-speaking20191107T220406962Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573166767/Moderator-1-speaking20191107T220408106Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573167014/Moderator-2-speaking20191107T221043151Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573167180/Moderator-3-speaking20191107T221043814Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573167269/Moderator-4-speaking20191107T221044387Z.webm',
        ],
        listening:
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175176/5d5b73c01e3b194174cd9b92-5-speaking20191108T010614689Z.webm',
        agenda: [
          [
            'Introductions',
            '1- Name',
            '2- City and State',
            '3- One word to describe yourself',
            '4- What office are you running for?',
          ],
          ['What was your first job?'],
          ['What do you love most about where you live?'],
          ['Why are you running for office; what inspired you?'],
          ['Thank you!'],
        ],
        timeLimits: [15, 60, 60, 60],
      },
    },
  },
}

const recorder = {
  //"path": "",
  //"subject": "",
  //"description": "",
  component: {
    component: 'UndebateCreator',
    participants: {
      moderator: {
        name: 'David Fridley',
        speaking: [
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175167/5d5b73c01e3b194174cd9b92-0-speaking20191108T010554433Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175171/5d5b73c01e3b194174cd9b92-1-speaking20191108T010606287Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175173/5d5b73c01e3b194174cd9b92-2-speaking20191108T010610113Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175174/5d5b73c01e3b194174cd9b92-3-speaking20191108T010612686Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175175/5d5b73c01e3b194174cd9b92-4-speaking20191108T010613566Z.webm',
        ],
        listening:
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1573175176/5d5b73c01e3b194174cd9b92-5-speaking20191108T010614689Z.webm',
        agenda: [
          [
            'Introductions',
            '1- Name',
            '2- City and State',
            '3- One word to describe yourself',
            '4- What office are you running for?',
          ],
          ['What was your first job?'],
          ['What do you love most about where you live?'],
          ['Why are you running for office; what inspired you?'],
          ['Thank you!'],
        ],
        timeLimits: [15, 60, 60, 60],
      },
      audience1: {
        speaking: [
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631736/5d9d3d70b558b4001722b9fc-1-speaking20191009T143533241Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631741/5d9d3d70b558b4001722b9fc-2-speaking20191009T143536132Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631753/5d9d3d70b558b4001722b9fc-3-speaking20191009T143549533Z.webm',
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631758/5d9d3d70b558b4001722b9fc-4-speaking20191009T143553523Z.webm',
        ],
        name: 'Adolf Gundersen',
        listening:
          'https://res.cloudinary.com/hf6mryjpf/video/upload/v1570631749/5d9d3d70b558b4001722b9fc-2-nextUp20191009T143541489Z.webm',
      },
      human: {
        listening: {
          round: 2,
          seat: 'nextUp',
        },
      },
    },
  },
  webComponent: {
    webComponent: 'Undebate',
    audio: {
      intro: {
        url: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1567095028/Generic_Light_Intro_7_sec_yp3lxk.mp3',
        volume: 0.8,
      },
      ending: {
        url: 'https://res.cloudinary.com/hf6mryjpf/video/upload/v1572494761/Heart_Soul_10-sec_FadeIn_Out_ordi04.mp3',
        volume: 0.2,
      },
    },
    participants: {},
    opening: {
      line1: 'Thank you for taking the lead in this <strong>new</strong> way to engage with voters',
      line2:
        'We want voters to learn about candidates in a more personal way, and candidates to have an easy way to reach voters',
      line3: 'And we want to host Candidate Conversations for every election, every election season',
      line4: 'So, we invite you to speak in this Candidate Conversation about:',
      //"bigLine": "",
      subLine:
        'After you hit Begin, your browser may ask you to authorize the camera and mic for use by this application.',
    },
    closing: {
      thanks: 'Thank You.',
      link: {
        name: 'Your feedback would help us make this even better',
        url: 'https://docs.google.com/forms/d/e/1FAIpQLSeMNX1zEUAVuI3aZY9qreBfqMaXsS-yMLf7WYiylqVjHvoP2g/viewform',
      },
      iframe: {
        src:
          'https://docs.google.com/forms/d/e/1FAIpQLSeMNX1zEUAVuI3aZY9qreBfqMaXsS-yMLf7WYiylqVjHvoP2g/viewform?embedded=true',
        width: 700,
        height: 1122,
      },
    },
  },
  //        "parentId": ""
}

function mergeWithVerbose(dst, src) {
  mergeWith(dst, src, (objValue, srcValue, key, object, source) => {
    if (typeof objValue !== 'object' && typeof srcValue !== 'object' && objValue !== srcValue) {
      console.info('key', key, 'changing', objValue, 'to', srcValue)
    }
    return undefined // do the default thing - were just here to print a message about it.
  })
}

function updateOrCreatePair(raceObj) {
  function viewerPath() {
    return (
      '/' +
      S(raceObj.Race)
        .slugify()
        .value() +
      '-2019Nov16'
    )
  }
  function recorderPath() {
    return viewerPath() + '-candidate-recorder'
  }
  function overWriteViewerInfo(newViewer) {
    newViewer.path = viewerPath()
    newViewer.subject = raceObj.Race
    newViewer.description = 'A Candidate Conversation for: ' + raceObj.Race
    newViewer.webComponent.opening.bigLine = raceObj.Race
  }
  function overWriteRecorderInfo(newRecorder, viewerObj) {
    newRecorder.path = recorderPath()
    newRecorder.subject = raceObj.Race + '-Candidate Recorder'
    newRecorder.description = 'A Candidate Recorder for the Conversation: ' + raceObj.Race
    newRecorder.webComponent.opening.bigLine = raceObj.Race
    newRecorder.parentId = viewerObj._id.toString()
  }
  return new Promise(async (ok, ko) => {
    async function createNewRecorder(viewerObj) {
      try {
        var newRecorder = cloneDeep(recorder)
        overWriteRecorderInfo(newRecorder, viewerObj)
        var recorderObj = await Iota.create(newRecorder)
        console.info('created recorder', viewerObj.subject, viewerObj.path, recorderObj.path)
        return ok({ viewerObj, recorderObj })
      } catch (err) {
        console.error('createNewRecorder caught err', err)
        return err
      }
    }
    var viewers = await Iota.find({ path: viewerPath() })
    if (viewers.length == 0) {
      // create the new race
      var newViewer = cloneDeep(viewer)
      overWriteViewerInfo(newViewer)
      try {
        var viewerObj = await Iota.create(newViewer)
        createNewRecorder(viewerObj)
        return
      } catch (err) {
        console.error('create viewer caught error:', err)
        ko(err)
      }
    } else if (viewers.length) {
      // update the race
      var viewerObj = cloneDeep(viewers[0])
      mergeWithVerbose(viewerObj, viewer)
      overWriteViewerInfo(viewerObj)
      await Iota.findOneAndReplace({ _id: viewerObj._id }, viewerObj)
      var recorders = await Iota.find({ path: recorderPath() })
      if (recorders.length === 0) {
        // it didn't exist
        createNewRecorder(viewerObj)
        return
      } else {
        var newRecorder = cloneDeep(recorders[0])
        mergeWithVerbose(newRecorder, recorder)
        overWriteRecorderInfo(newRecorder, viewerObj)
        var recorderObj = await Iota.findOneAndReplace({ _id: newRecorder._id }, newRecorder)
        return ok({ viewerObj, recorderObj })
      }
    }
  })
}

function updateLinkProperty(raceObj, property, path) {
  if (raceObj[property] && raceObj[property].length) {
    if (raceObj[property] !== 'https://undebate.herokuapp.com' + path) {
      raceObj[property] = 'https://undebate.herokuapp.com' + path
      raceObj[property + ' updated'] = 'yes'
    } else {
      raceObj[property + ' updated'] = ''
    }
  } else {
    raceObj[property] = 'https://undebate.herokuapp.com' + path
    raceObj[property + ' updated'] = 'yes'
  }
}

// fetch args from command line
var argv = process.argv
var args = {}
for (let arg = 2; arg < argv.length; arg++) {
  switch (argv[arg]) {
    case 'src': // the csv file
    case 'db': // the mongo database URI
      args[argv[arg]] = argv[++arg]
      break
    default:
      console.error('ignoring unexpected argument:', argv[arg])
  }
}

if (args.src && args.db) {
  csv()
    .fromFile(args.src)
    .then(async raceList => {
      await MongoModels.connect({ uri: args.db }, {})
      while (MongoModels.toInit && MongoModels.toInit.length) {
        // any models that need to createIndexes will push their init function
        MongoModels.toInit.shift()()
      }
      var count = 0
      raceList.forEach(async raceObj => {
        count++
        var result = await updateOrCreatePair(raceObj)
        updateLinkProperty(raceObj, 'CC link Recorder', result.recorderObj.path)
        updateLinkProperty(raceObj, 'CC Link Viewer', result.viewerObj.path)
        if (--count === 0) {
          const csvOut = new ObjectsToCsv(raceList)
          let outFileParts = args.src.split('.')
          outFileParts.splice(outFileParts.length - 1, 0, '-out')
          await csvOut.toDisk(outFileParts.join('.'))
          MongoModels.disconnect()
        }
      })
    })
    .catch(err => {
      console.error('csv caught error', err)
    })
} else {
  console.error('usage: csv-create-cc-pair src <csv file> db <database uri>')
  process.exit()
}
