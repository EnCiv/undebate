'use strict'
const S = require('underscore.string')
const MongoModels = require('mongo-models')

/**
 * CSV File format
 *
 * fullname,lastname,race,party,street1,street2,city,state,zip,contactemail,Campaign Website,Facebook,Twitter,Phone #,election_date,recorded,candidate_stage_result_id,recorder url,recorder url updated,viewer url,viewer url updated

 *
 */

const hostName = process.env.HOST_NAME || 'https://cc.enciv.org'

function date_dash(date) {
  if (date.split('/').length > 1) {
    let mdy = date.split('/')
    return mdy[2] + '-' + mdy[0] + '-' + mdy[1]
  }
  return date
}

const viewer_recorder_pair = {
  viewerPath: function(csvRowObj) {
    // ()=> here will not get 'this'
    return `/country:us/state:${csvRowObj.state.toLowerCase()}/office:${S(csvRowObj.race)
      .slugify()
      .value()}/${date_dash(csvRowObj['election_date'])}`
  },
  recorderPath: function(csvRowObj) {
    return this.viewerPath(csvRowObj) + '-recorder-' + csvRowObj.candidate_stage_result_id
  },
  overWriteViewerInfo: function(newViewer, csvRowObj) {
    newViewer.path = this.viewerPath(csvRowObj)
    newViewer.subject = csvRowObj.race
    newViewer.description = 'A Candidate Conversation for: ' + csvRowObj.race
  },
  overWriteRecorderInfo: function(newRecorder, viewerObj, csvRowObj) {
    newRecorder.subject = csvRowObj.race + '-Candidate Recorder'
    newRecorder.description = 'A Candidate Recorder for the undebate: ' + csvRowObj.race
    newRecorder.bp_info.office = csvRowObj.race
    newRecorder.bp_info.election_date = csvRowObj.election_date
    newRecorder.bp_info.candidate_name = csvRowObj.fullname
    newRecorder.bp_info.last_name = csvRowObj.lastname
    if (csvRowObj.candidate_stage_result_id) newRecorder.bp_info.unique_id = csvRowObj.candidate_stage_result_id
    else if (newRecorder.bp_info.unique_id) {
      if (csvRowObj.candidate_stage_result_id !== newRecorder.bp_info.unique_id)
        console.error(
          'overWriteRecorderInfo',
          csvRowObj.candidate_stage_result_id,
          '!==',
          newRecorder.bp_info.unique_id
        )
      csvRowObj.candidate_stage_result_id = newRecorder.bp_info.unique_id
    } else {
      newRecorder.bp_info.unique_id = csvRowObj.candidate_stage_result_id = new MongoModels.ObjectID().toString() // if no id make a unique one
    }
    newRecorder.path = this.recorderPath(csvRowObj) // must set raceObject.candidate_stage_result_id before calling this
    newRecorder.bp_info.candidate_emails = [csvRowObj.contactemail]
    newRecorder.bp_info.party = csvRowObj.party
    newRecorder.parentId = viewerObj._id.toString()
  },
  updateLinkProperty: function(csvRowObj, property, path) {
    if (csvRowObj[property] && csvRowObj[property].length) {
      if (csvRowObj[property] !== hostName + path) {
        csvRowObj[property] = hostName + path
        csvRowObj[property + ' updated'] = 'yes'
      } else {
        csvRowObj[property + ' updated'] = ''
      }
    } else {
      csvRowObj[property] = hostName + path
      csvRowObj[property + ' updated'] = 'yes'
    }
  },
  updateProperties: function(csvRowObj, viewerObj, recorderObj) {
    this.updateLinkProperty(csvRowObj, 'recorder url', recorderObj.path)
    this.updateLinkProperty(csvRowObj, 'viewer url', viewerObj.path)
    if (!csvRowObj.candidate_stage_result_id) csvRowObj.candidate_stage_result_id = recorderObj.bp_info.unique_id
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
      webComponent: 'CandidateConversation',
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true',
          width: '640',
          height: '1511',
        },
      },
      shuffle: true,
      participants: {
        moderator: {
          name: 'Will Ferguson',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425647/5e41731909ef5200170e691a-0-speaking20200328T195937243Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425664/5e41731909ef5200170e691a-1-speaking20200328T200048122Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425672/5e41731909ef5200170e691a-2-speaking20200328T200105166Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425694/5e41731909ef5200170e691a-3-speaking20200328T200112517Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425713/5e41731909ef5200170e691a-4-speaking20200328T200134946Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585545499/5e41731909ef5200170e691a-5-speaking20200328T200153692Z_vzrhgw.mp4',
          agenda: [
            [
              'Introductions',
              '1- Name',
              '2- City and State',
              '3- One word to describe yourself',
              '4- What office are you running for?',
            ],
            ['What do you love about where you live?'],
            ['What inspired me to run for office?'],
            ['If elected, what will be your top 3 priorities?'],
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
          name: 'Will Ferguson',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425647/5e41731909ef5200170e691a-0-speaking20200328T195937243Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425664/5e41731909ef5200170e691a-1-speaking20200328T200048122Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425672/5e41731909ef5200170e691a-2-speaking20200328T200105166Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425694/5e41731909ef5200170e691a-3-speaking20200328T200112517Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585425713/5e41731909ef5200170e691a-4-speaking20200328T200134946Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585545499/5e41731909ef5200170e691a-5-speaking20200328T200153692Z_vzrhgw.mp4',
          agenda: [
            [
              'Introductions',
              '1- Name',
              '2- City and State',
              '3- One word to describe yourself',
              '4- What office are you running for?',
            ],
            ['What do you love about where you live?'],
            ['What inspired me to run for office?'],
            ['If elected, what will be your top 3 priorities?'],
            ['Thank you!'],
          ],
          timeLimits: [15, 60, 60, 60],
        },
        audience1: {
          speaking: [
            'https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1585548555/5e28efbf14af500017ddf308-0-speaking20200330T060914662Z.mp4',
            'https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1585548556/5e28efbf14af500017ddf308-1-speaking20200330T060915819Z.mp4',
            'https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1585548557/5e28efbf14af500017ddf308-2-speaking20200330T060916904Z.mp4',
            'https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1585548559/5e28efbf14af500017ddf308-3-speaking20200330T060917767Z.mp4',
          ],
          name: 'David D Fridley',
          listening:
            'https://res.cloudinary.com/hisfgxdff/video/upload/q_auto/v1585548559/5e28efbf14af500017ddf308-0-listening20200330T060919657Z.mp4',
        },
        human: {
          listening: {
            round: 3,
            seat: 'nextUp',
          },
        },
      },
    },
    webComponent: {
      webComponent: 'Undebate',
      participants: {},
      opening: {
        noPreamble: true,
      },
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSeMNX1zEUAVuI3aZY9qreBfqMaXsS-yMLf7WYiylqVjHvoP2g/viewform?embedded=true',
          width: 700,
          height: 1122,
        },
      },
    },
    bp_info: {
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
