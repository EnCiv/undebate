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
  type_id: row => 'ucla-student-accociation',
  election_date: row => '2021-05-07',
  candidate_name: row => row['Name'],
  office: row => 'USAC ' + row['Office'],
  candidate_emails: row => (row['Email'] ? [row['Email']] : undefined),
  unique_id: row => row['unique_id'],
  set: {
    unique_id: (row, val) => (row['unique_id'] = val),
  },
  party: row => '',
  viewer_url_name: () => 'viewer_url',
  recorder_url_name: () => 'recorder_url',
  url_update_name: name => name + '_updated',
  lastname: row => row['Name'].split(' ').reduce((acc, word) => word, ''), // the last word in the full name will be the last name
  election_source: () => 'UCLA.USA',
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
    newViewer.bp_info.office = getIotaPropertyFromCSVColumn.office(csvRowObj)
    newViewer.bp_info.election_date = getIotaPropertyFromCSVColumn.election_date(csvRowObj)
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
    return viewer_recorder_pair['candidateViewer']
  },
  getRecorder: function(csvRowObj) {
    return viewer_recorder_pair['candidateRecorder']
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
      logo: 'undebate',
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSdA9nvQ4_4tZhslOC4IoG9yopgpG7Y89bPPz4JR_h0zZqHTJA/viewform?embedded=true',
          width: '640',
          height: '4900',
        },
      },
      shuffle: true,
      participants: {
        moderator: {
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267946/60658cdb7f01700017d440b7-0-speaking20210401T090542302Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267947/60658cdb7f01700017d440b7-1-speaking20210401T090545791Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267949/60658cdb7f01700017d440b7-2-speaking20210401T090547282Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267951/60658cdb7f01700017d440b7-3-speaking20210401T090548596Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267953/60658cdb7f01700017d440b7-4-speaking20210401T090550758Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267955/60658cdb7f01700017d440b7-5-speaking20210401T090553193Z.mp4',
          ],
          name: 'Alfred Tun ',
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
          agenda: [
            ['Introduction', 'Who are you?', 'Why did you choose UCLA?', 'Why are your running for this position?'],
            [
              'What are two examples of the most relevant experience you have for this position? Describe one specific skill and one personality trait that makes you qualified for this position.',
            ],
            [
              'What are your platforms that you will be bringing into this election as a candidate? Include THREE specific platforms you have and explain how and why they will help the student body.',
            ],
            [
              'What specific initiatives and projects do you have plans to enact if elected? Why? Make sure to include TWO specific projects or initiatives that you plan to enact that are specific and relevant to the position you are running for and explain why they are important.',
            ],
            [
              'How will you increase the awareness of the significance of your position to a wide range of students? Include TWO specific ideas you have that will help increase overall awareness of not only your position, but about USAC and student government as a whole.',
            ],
            ['Thank you!'],
          ],
          timeLimits: [20, 30, 30, 30, 30],
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
          speaking: [
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1617403763/5d5b74751e3b194174cd9b94-0-speaking20210402T224911384Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267946/60658cdb7f01700017d440b7-0-speaking20210401T090542302Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267947/60658cdb7f01700017d440b7-1-speaking20210401T090545791Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267949/60658cdb7f01700017d440b7-2-speaking20210401T090547282Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267951/60658cdb7f01700017d440b7-3-speaking20210401T090548596Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267953/60658cdb7f01700017d440b7-4-speaking20210401T090550758Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1617403764/5d5b74751e3b194174cd9b94-1-speaking20210402T224922326Z.mp4',
          ],
          name: 'Alfred Tun ',
          names: [
            'David Fridley',
            'Alfred Tun',
            'Alfred Tun',
            'Alfred Tun',
            'Alfred Tun',
            'Alfred Tun',
            'David Fridley',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
          listeningURLs: [
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1617403769/5d5b74751e3b194174cd9b94-5-speaking20210402T224926774Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1617267956/60658cdb7f01700017d440b7-0-listening20210401T090554706Z.mp4',
            'https://res.cloudinary.com/huu1x9edp/video/upload/q_auto/v1617403769/5d5b74751e3b194174cd9b94-5-speaking20210402T224926774Z.mp4',
          ],
          agenda: [
            ['1- How To', '2- Record Placeholder'],
            ['Introduction', 'Who are you?', 'Why did you choose UCLA?', 'Why are your running for this position?'],
            [
              'What are two examples of the most relevant experience you have for this position? Describe one specific skill and one personality trait that makes you qualified for this position.',
            ],
            [
              'What are your platforms that you will be bringing into this election as a candidate? Include THREE specific platforms you have and explain how and why they will help the student body.',
            ],
            [
              'What specific initiatives and projects do you have plans to enact if elected? Why? Make sure to include TWO specific projects or initiatives that you plan to enact that are specific and relevant to the position you are running for and explain why they are important.',
            ],
            [
              'How will you increase the awareness of the significance of your position to a wide range of students? Include TWO specific ideas you have that will help increase overall awareness of not only your position, but about USAC and student government as a whole.',
            ],
            ['Thank you!'],
          ],
          timeLimits: [20, 20, 30, 30, 30, 30],
        },
        human: {
          listening: {
            round: 0,
            seat: 'speaking',
          },
        },
      },
    },
    webComponent: {
      webComponent: 'Undebate',
      logo: 'undebate',
      instructionLink:
        'https://docs.google.com/document/d/e/2PACX-1vQeJDwY9vhNDH-YQh38JsC5kuqKVIWiDFdzidcdusFwQgT2TXh2HGwFWWXmYzLnBVdiPrX705BnboIY/pub',
      participants: {},
      opening: { noPreamble: false },
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSe6zjVgbaLeyTXGycF1-yMgYl34jGrhEq-nonPXMh7c6lY6hg/viewform?embedded=true',
          width: '640',
          height: '1590',
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
}

module.exports = viewer_recorder_pair
