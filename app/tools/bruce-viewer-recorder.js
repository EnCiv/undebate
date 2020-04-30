'use strict'
const S = require('underscore.string')
const MongoModels = require('mongo-models')

/**
 * CSV File format
 *
 * Ballot Name,	Office,	Slate,	Email Address,	unique_id,	recorder_url,	recorder_url_updated,	viewer_url,	viewer_url_updated
 *
 */

const hostName = process.env.HOST_NAME || 'https://cc.enciv.org'

const getIotaPropertyFromCSVColumn = {
  type_name: () => 'organization',
  type_id: row => 'ucla',
  election_date: row => '2020_05_04',
  candidate_name: row => row['Ballot Name'],
  office: row => row['Office'],
  candidate_emails: row => [row['Email Address']],
  unique_id: row => row['unique_id'],
  set: {
    unique_id: (row, val) => (row['unique_id'] = val),
  },
  party: row => row['Slate'],
  viewer_url_name: () => 'viewer_url',
  recorder_url_name: () => 'recorder_url',
  url_update_name: name => name + '_updated',
  lastname: row => row['Ballot Name'].split(' ').reduce((acc, word) => word, ''), // the last word in the full name will be the last name
  election_source: () => 'UniversityOfCaliforniaLosAngeles.UndergraduateStudentsAssociation',
}

function date_dash(date) {
  if (date.split('/').length > 1) {
    let mdy = date.split('/')
    return mdy[2] + '-' + mdy[0] + '-' + mdy[1]
  }
  return date
}

var viewer_recorder_pair = {
  electionList: [],
  setup: function(csvRowObjList) {
    // make a list of all the elections in the table, so each viewer can navigate to other ones
    viewer_recorder_pair.electionList = csvRowObjList.reduce((acc, rowObj) => {
      let viewer_path = viewer_recorder_pair.viewerPath(rowObj)
      if (!acc.includes(viewer_path)) acc.push(viewer_path)
      return acc
    }, [])
  },
  viewerPath: function(csvRowObj) {
    // ()=> here will not get 'this'
    return `/country:us/${getIotaPropertyFromCSVColumn.type_name()}:${getIotaPropertyFromCSVColumn
      .type_id(csvRowObj)
      .toLowerCase()}/office:${S(getIotaPropertyFromCSVColumn.office(csvRowObj))
      .slugify()
      .value()}/${date_dash(getIotaPropertyFromCSVColumn.election_date(csvRowObj))}`
  },
  recorderPath: function(csvRowObj) {
    return this.viewerPath(csvRowObj) + '-recorder-' + getIotaPropertyFromCSVColumn.unique_id(csvRowObj)
  },
  overWriteViewerInfo: function(newViewer, csvRowObj) {
    newViewer.path = this.viewerPath(csvRowObj)
    newViewer.subject = getIotaPropertyFromCSVColumn.office(csvRowObj)
    newViewer.description = 'A Candidate Conversation for: ' + getIotaPropertyFromCSVColumn.office(csvRowObj)
    newViewer.bp_info.electionList = viewer_recorder_pair.electionList
    let nextPrev = viewer_recorder_pair.electionList.reduce((acc, viewerPath) => {
      if (acc.nextElection);
      else if (acc.found)
        // after this is set there's nothing to do
        acc.nextElection = viewerPath
      else if (viewerPath === newViewer.path) acc.found = true
      else acc.prevElection = viewerPath
      return acc
    }, {})
    if (nextPrev.nextElection) newViewer.bp_info.nextElection = nextPrev.nextElection
    if (nextPrev.prevElection) newViewer.bp_info.prevElection = nextPrev.prevElection
    newViewer.bp_info.election_source = getIotaPropertyFromCSVColumn.election_source(csvRowObj)
  },
  overWriteRecorderInfo: function(newRecorder, viewerObj, csvRowObj) {
    newRecorder.subject = getIotaPropertyFromCSVColumn.office(csvRowObj) + '-Candidate Recorder'
    newRecorder.description = 'A Candidate Recorder for the undebate: ' + getIotaPropertyFromCSVColumn.office(csvRowObj)
    newRecorder.bp_info.office = getIotaPropertyFromCSVColumn.office(csvRowObj)
    newRecorder.bp_info.election_date = getIotaPropertyFromCSVColumn.election_date(csvRowObj)
    newRecorder.bp_info.candidate_name = getIotaPropertyFromCSVColumn.candidate_name(csvRowObj)
    newRecorder.bp_info.last_name = getIotaPropertyFromCSVColumn.lastname(csvRowObj)
    if (getIotaPropertyFromCSVColumn.unique_id(csvRowObj))
      newRecorder.bp_info.unique_id = getIotaPropertyFromCSVColumn.unique_id(csvRowObj)
    else if (newRecorder.bp_info.unique_id) {
      if (getIotaPropertyFromCSVColumn.unique_id(csvRowObj) !== newRecorder.bp_info.unique_id)
        console.error(
          'overWriteRecorderInfo',
          getIotaPropertyFromCSVColumn.unique_id(csvRowObj),
          '!==',
          newRecorder.bp_info.unique_id
        )
      getIotaPropertyFromCSVColumn.set.unique_id(csvRowObj, newRecorder.bp_info.unique_id)
    } else {
      newRecorder.bp_info.unique_id = getIotaPropertyFromCSVColumn.set.unique_id(
        csvRowObj,
        new MongoModels.ObjectID().toString()
      ) // if no id make a unique one
    }
    newRecorder.path = this.recorderPath(csvRowObj) // must set raceObject.unique_id before calling this
    newRecorder.bp_info.candidate_emails = getIotaPropertyFromCSVColumn.candidate_emails(csvRowObj)
    newRecorder.bp_info.party = getIotaPropertyFromCSVColumn.party(csvRowObj)
    newRecorder.bp_info.election_source = getIotaPropertyFromCSVColumn.election_source(csvRowObj)
    newRecorder.parentId = viewerObj._id.toString()
  },
  updateLinkProperty: function(csvRowObj, property, path) {
    if (csvRowObj[property] && csvRowObj[property].length) {
      if (csvRowObj[property] !== hostName + path) {
        csvRowObj[property] = hostName + path
        csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = 'yes'
      } else {
        csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = ''
      }
    } else {
      csvRowObj[property] = hostName + path
      csvRowObj[getIotaPropertyFromCSVColumn.url_update_name(property)] = 'yes'
    }
  },
  updateProperties: function(csvRowObj, viewerObj, recorderObj) {
    this.updateLinkProperty(csvRowObj, getIotaPropertyFromCSVColumn.recorder_url_name(), recorderObj.path)
    this.updateLinkProperty(csvRowObj, getIotaPropertyFromCSVColumn.viewer_url_name(), viewerObj.path)
    if (!getIotaPropertyFromCSVColumn.unique_id(csvRowObj))
      getIotaPropertyFromCSVColumn.set.unique_id(csvRowObj, recorderObj.bp_info.unique_id)
  },
  getViewer: function(csvRowObj) {
    return viewer_recorder_pair[csvRowObj.Type + 'Viewer']
  },
  getRecorder: function(csvRowObj) {
    return viewer_recorder_pair[csvRowObj.Type + 'Recorder']
  },
  candidateViewer: {
    // properties that are commented out so prevent messages about their are being changed when they are overwriten by whats in the CSV file
    //"path": "",
    //"subject": "",
    //"description": "",
    component: {
      component: 'MergeParticipants',
    },
    webComponent: {
      webComponent: 'CandidateConversation',
      logo: 'Candidate Conversation',
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSfFJZF0N50n6vR9A8lc4Yqd3CUe7vwrTYNWeBMH0FfI1aeErg/viewform?embedded=true',
          width: '640',
          height: '4800',
        },
      },
      shuffle: true,
      participants: {
        moderator: {
          name: 'Navi Sidhu',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587521326/5e8b7be3946422001760d842-0-speaking20200422T020815621Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587521352/5e8b7be3946422001760d842-1-speaking20200422T020846814Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587521359/5e8b7be3946422001760d842-2-speaking20200422T020912223Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587521362/5e8b7be3946422001760d842-3-speaking20200422T020919009Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587521378/5e8b7be3946422001760d842-4-speaking20200422T020922069Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/so_0.5,w_640,h_360,c_fill,g_center,q_auto/v1587609069/5e8b7be3946422001760d842-0-speaking20200423T023039846Z.mp4',
          agenda: [
            ['Introductions', '1- Name', '2- Year', '3- Major', '4- What office are you running for?'],
            [
              'USAC officers have many resources at their disposal but often fail to accomplish the platforms they run on during their candidacy, for reasons such as lack of funding, complex logistics, and lack of support from UCLA Admin. How will you address these barriers and ensure that your ideas are implemented by the time you leave office?',
            ],
            [
              'In your opinion, what is the single greatest problem that UCLA students face and how do you plan to address this?',
            ],
            ['Why did you choose UCLA and what do you love about it?'],
            ['Thank you!'],
          ],
          timeLimits: [15, 45, 45, 45],
        },
      },
    },
    bp_info: {
      //election_source:
      //election_list: []
    },
  },

  candidateRecorder: {
    //"path": "",
    //"subject": "",
    //"description": "",
    component: {
      component: 'UndebateCreator',
      participants: {
        moderator: {
          name: 'Navi Sidhu',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587158129/5e8b7be3946422001760d842-0-speaking20200417T211221929Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074314/5e8b7be3946422001760d842-1-speaking20200416T215753103Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074325/5e8b7be3946422001760d842-2-speaking20200416T215834167Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074330/5e8b7be3946422001760d842-3-speaking20200416T215845703Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074358/5e8b7be3946422001760d842-4-speaking20200416T215850541Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074390/5e8b7be3946422001760d842-5-speaking20200416T215918176Z.mp4',
          agenda: [
            ['Introductions', '1- Name', '2- Year', '3- Major', '4- What office are you running for?'],
            [
              'USAC officers have many resources at their disposal but often fail to accomplish the platforms they run on during their candidacy, for reasons such as lack of funding, complex logistics, and lack of support from UCLA Admin. How will you address these barriers and ensure that your ideas are implemented by the time you leave office?',
            ],
            [
              'In your opinion, what is the single greatest problem that UCLA students face and how do you plan to address this?',
            ],
            ['Why did you choose UCLA and what do you love about it?'],
            ['Thank you!'],
          ],
          timeLimits: [15, 45, 45, 45],
        },
        audience1: {
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164209/5e8b7be3946422001760d842-0-speaking20200417T225637018Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164237/5e8b7be3946422001760d842-1-speaking20200417T225649811Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164272/5e8b7be3946422001760d842-2-speaking20200417T225717026Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164287/5e8b7be3946422001760d842-3-speaking20200417T225752465Z.mp4',
          ],
          name: 'Example Speaker',
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074390/5e8b7be3946422001760d842-5-speaking20200416T215918176Z.mp4',
        },
        human: {
          listening: {
            round: 0,
            seat: 'nextUp',
          },
        },
      },
    },
    webComponent: {
      webComponent: 'Undebate',
      instructionLink:
        'https://docs.google.com/document/d/1zELg9U-1kpHZmwyAEdCS_fp1QysG652DDbRjt2uj-1g/edit?usp=sharing',
      //logo: 'undebate',
      participants: {},
      opening: {
        noPreamble: true,
      },
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
          width: 640,
          height: 1550,
        },
      },
    },
    bp_info: {
      //election_source:
      //"office": "Illinois House of Representatives District 38",
      //"party": null,
      //"unique_id": "92251",
      //"election_date": "2020-11-03",
      //"candidate_name": "Max Solomon",
      //"last_name": "Solomon",
      //"candidate_emails": [],
      //"person_emails": []
    },
    //        "parentId": ""
  },
  referendumViewer: {
    // properties that are commented out so prevent messages about their are being changed when they are overwriten by whats in the CSV file
    //"path": "",
    //"subject": "",
    //"description": "",
    component: {
      component: 'MergeParticipants',
    },
    webComponent: {
      webComponent: 'CandidateConversation',
      logo: 'Candidate Conversation',
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSfFJZF0N50n6vR9A8lc4Yqd3CUe7vwrTYNWeBMH0FfI1aeErg/viewform?embedded=true',
          width: '640',
          height: '4800',
        },
      },
      shuffle: true,
      participants: {
        moderator: {
          name: 'Navi Sidhu',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587522220/5e8b7be3946422001760d842-0-speaking20200422T022310506Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587522223/5e8b7be3946422001760d842-1-speaking20200422T022340358Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587522233/5e8b7be3946422001760d842-2-speaking20200422T022343047Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587522240/5e8b7be3946422001760d842-3-speaking20200422T022353856Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587522255/5e8b7be3946422001760d842-4-speaking20200422T022400559Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/so_0.5,w_640,h_360,c_fill,g_center,q_auto/v1587609069/5e8b7be3946422001760d842-0-speaking20200423T023039846Z.mp4',
          agenda: [
            ['Introductions', '1- Name', '2- Year', '3- Major', '4- What referenda you represent?'],
            ['Describe your referenda and the purpose of your referenda.'],
            [
              'Seeing that an increase in student fees are generally considered last measures, has your referenda considered all other funding options and what have been some of the past challenges with the funding for your project?',
            ],
            [
              'If passed, when would students begin to see the tangible results from an increase in their student fees?',
            ],
            ['Thank you!'],
          ],
          timeLimits: [15, 45, 45, 45],
        },
      },
    },
    bp_info: {
      //election_source:
      //election_list: []
    },
  },

  referendumRecorder: {
    //"path": "",
    //"subject": "",
    //"description": "",
    component: {
      component: 'UndebateCreator',
      participants: {
        moderator: {
          name: 'Navi Sidhu',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587158129/5e8b7be3946422001760d842-0-speaking20200417T211221929Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074617/5e8b7be3946422001760d842-1-speaking20200416T220329980Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074636/5e8b7be3946422001760d842-2-speaking20200416T220337570Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074646/5e8b7be3946422001760d842-3-speaking20200416T220356087Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074358/5e8b7be3946422001760d842-4-speaking20200416T215850541Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/so_0.5,w_640,h_360,c_fill,g_center,q_auto/v1587609069/5e8b7be3946422001760d842-0-speaking20200423T023039846Z.mp4',
          agenda: [
            ['Introductions', '1- Name', '2- Year', '3- Major', '4- What referenda you represent?'],
            ['Describe your referenda and the purpose of your referenda.'],
            [
              'Seeing that an increase in student fees are generally considered last measures, has your referenda considered all other funding options and what have been some of the past challenges with the funding for your project?',
            ],
            [
              'If passed, when would students begin to see the tangible results from an increase in their student fees?',
            ],
            ['Thank you!'],
          ],
          timeLimits: [15, 45, 45, 45],
        },
        audience1: {
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164209/5e8b7be3946422001760d842-0-speaking20200417T225637018Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164237/5e8b7be3946422001760d842-1-speaking20200417T225649811Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164272/5e8b7be3946422001760d842-2-speaking20200417T225717026Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587164287/5e8b7be3946422001760d842-3-speaking20200417T225752465Z.mp4',
          ],
          name: 'Example Speaker',
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/w_640,h_360,c_fill,g_center,q_auto/v1587074390/5e8b7be3946422001760d842-5-speaking20200416T215918176Z.mp4',
        },
        human: {
          listening: {
            round: 0,
            seat: 'nextUp',
          },
        },
      },
    },
    webComponent: {
      webComponent: 'Undebate',
      instructionLink:
        'https://docs.google.com/document/d/1zELg9U-1kpHZmwyAEdCS_fp1QysG652DDbRjt2uj-1g/edit?usp=sharing',
      //logo: 'undebate',
      participants: {},
      opening: {
        noPreamble: true,
      },
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSchcQjvnbpwEcOl9ysmZ4-KwDyK7RynwJvxPqRTWhdq8SN02g/viewform?embedded=true',
          width: 640,
          height: 1550,
        },
      },
    },
    bp_info: {
      //election_source:
      //"office": "Illinois House of Representatives District 38",
      //"party": null,
      //"unique_id": "92251",
      //"election_date": "2020-11-03",
      //"candidate_name": "Max Solomon",
      //"last_name": "Solomon",
      //"candidate_emails": [],
      //"person_emails": []
    },
    //"parentId": ""
  },
}

module.exports = viewer_recorder_pair
