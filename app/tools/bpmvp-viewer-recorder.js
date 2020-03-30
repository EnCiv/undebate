const viewer_recorder_pair = {
  viewerPath: raceObj => {
    return `/country:us/state:${raceObj.state}/office:${S(raceObj.race)
      .slugify()
      .value()}/${raceObj['Election Date']}`
  },
  recorderPath: raceObj => {
    return this.viewerPath(raceObj) + '-candidate-recorder'
  },
  overWriteViewerInfo: (newViewer, raceObj) => {
    newViewer.path = this.viewerPath()
    newViewer.subject = raceObj.Race
    newViewer.description = 'A Candidate Conversation for: ' + raceObj.Race
    newViewer.webComponent.opening.bigLine = raceObj.Race
  },
  overWriteRecorderInfo: (newRecorder, viewerObj) => {
    newRecorder.path = this.recorderPath()
    newRecorder.subject = raceObj.Race + '-Candidate Recorder'
    newRecorder.description = 'A Candidate Recorder for the Conversation: ' + raceObj.Race
    newRecorder.webComponent.opening.bigLine = raceObj.Race
    newRecorder.parentId = viewerObj._id.toString()
  },
  updateLinkProperty: (raceObj, property, path) => {
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
  },
  updateLinkProperties: (raceObj, viewerObj, recorderObj) => {
    this.updateLinkProperty(raceObj, 'CC link Recorder', recorderObj.path)
    this.updateLinkProperty(raceObj, 'CC Link Viewer', viewerObj.path)
  },
  viewer: {
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
  },

  recorder: {
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
  },
}

module.exports.viewer_recorder_pair = viewer_recorder_pair
module.exports.default = viewer_recorder_pair
