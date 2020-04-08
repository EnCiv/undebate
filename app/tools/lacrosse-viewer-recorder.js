'use strict'
const S = require('underscore.string')
const MongoModels = require('mongo-models')

/**
 * CSV File format
 *
 * firstname, fullname,lastname,race,party,street1,street2,city,state,zip,contactemail,Campaign Website,Facebook,Twitter,Phone #,election_date,recorded,candidate_stage_result_id,recorder url,recorder url updated,viewer url,viewer url updated
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
      logo: 'undebate',
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSdupdesY-JhnhaB6rZn0-18VOMM3bkmrexrStPJ9-384NfqEg/viewform?embedded=true',
          width: '640',
          height: '2950',
        },
      },
      shuffle: true,
      participants: {
        moderator: {
          name: 'Will Ferguson',
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585598207/5e41731909ef5200170e691a-0-speaking20200330T195624691Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585598216/5e41731909ef5200170e691a-1-speaking20200330T195646995Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585598224/5e41731909ef5200170e691a-2-speaking20200330T195656021Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585598232/5e41731909ef5200170e691a-3-speaking20200330T195704022Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585598250/5e41731909ef5200170e691a-4-speaking20200330T195712661Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/v1585611305/5e41731909ef5200170e691a-5-speaking20200330T183448303Z_q1dd31.mp4',
          agenda: [
            [
              'Introductions',
              '1- Name',
              '2- City and State',
              '3- One word to describe yourself',
              '4- What office are you running for?',
            ],
            ['What do you love about where you live?'],
            ['What inspired you to run for office?'],
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
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763877/5e41731909ef5200170e691a-0-speaking20200401T175733191Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763885/5e41731909ef5200170e691a-1-speaking20200401T175757491Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763892/5e41731909ef5200170e691a-2-speaking20200401T175805840Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763900/5e41731909ef5200170e691a-3-speaking20200401T175812097Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763921/5e41731909ef5200170e691a-4-speaking20200401T175820847Z.mp4',
          ],
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585763942/5e41731909ef5200170e691a-5-speaking20200401T175841022Z.mp4',
          agenda: [
            [
              'Introductions',
              '1- Name',
              '2- City and State',
              '3- One word to describe yourself',
              '4- What office are you running for?',
            ],
            ['What do you love about where you live?'],
            ['What inspired you to run for office?'],
            ['If elected, what will be your top 3 priorities?'],
            ['Thank you!'],
          ],
          timeLimits: [15, 60, 60, 60],
        },
        audience1: {
          speaking: [
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585676624/5e838143548a860017fffba4-0-speaking20200331T174339908Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585676631/5e838143548a860017fffba4-1-speaking20200331T174342975Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585676641/5e838143548a860017fffba4-2-speaking20200331T174350659Z.mp4',
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585676655/5e838143548a860017fffba4-3-speaking20200331T174400726Z.mp4',
          ],
          name: 'Katie Karaoke',
          listening:
            'https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1585676656/5e838143548a860017fffba4-0-listening20200331T174414795Z.mp4',
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
      instructionLink:
        'https://docs.google.com/document/d/1jHt1Nvb4K5mamuWhvbksgDP_vpq09HnhXy_pJQXvAQM/edit?usp=sharing',
      logo: 'undebate',
      participants: {},
      opening: {
        noPreamble: true,
      },
      closing: {
        thanks: 'Thank You.',
        iframe: {
          src:
            'https://docs.google.com/forms/d/e/1FAIpQLSfAKYlqUpTlWSzUxwcltDjGNbMykiWLSHkPMYiqnX7hdcxEHA/viewform?embedded=true',
          width: 640,
          height: 1100,
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
