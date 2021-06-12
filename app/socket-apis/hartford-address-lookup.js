'use strict'
import { Iota } from 'civil-server'

async function getViewersByOffice(office_id) {
  try {
    const viewers = await Iota.find({ 'bp_info.race.office.id': { $eq: office_id } })
    console.log(viewers, office_id)
    const urls = await viewers.map(
      v => `${process.env.HOSTNAME === 'localhost:3011' ? 'http' : 'https'}://${process.env.HOSTNAME}${v.path}`
    )
    console.log(urls)
    return urls
  } catch (error) {
    logger.error('caught error trying to getViewersByOffice', office_id, error.message)
    return error
  }
}

/* This is the structure of a viewer Iota
{
    "_id": {
        "$oid": "5ef28004e7179a4006925fb4"
    },
    "component": {
        "component": "MergeChildren"
    },
    "webComponent": {
        "webComponent": "CandidateConversation",
        "closing": {
            "thanks": "Thank You.",
            "iframe": {
                "src": "https://docs.google.com/forms/d/e/1FAIpQLSeh7kAVWpyjnSYmHhjfpjfalgznfDA_AF2xmrFB8ZzQj75Vyw/viewform?embedded=true",
                "width": "640",
                "height": "1511"
            }
        },
        "shuffle": "bp_info_alphabetize",
        "participants": {
            "moderator": {
                "name": "Sarah Rosier",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804991/5dfbd2cade08bc00174be9c2-0-speaking20191220T012308880Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804992/5dfbd2cade08bc00174be9c2-1-speaking20191220T012311425Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804993/5dfbd2cade08bc00174be9c2-2-speaking20191220T012312246Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804993/5dfbd2cade08bc00174be9c2-3-speaking20191220T012312981Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804995/5dfbd2cade08bc00174be9c2-4-speaking20191220T012313581Z.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1576804997/5dfbd2cade08bc00174be9c2-5-speaking20191220T012315245Z.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "1- Name",
                        "2- City and State",
                        "3- One word to describe yourself",
                        "4- What office are you running for?"
                    ],
                    [
                        "What do you love most about where you live?"
                    ],
                    [
                        "What inspired you to run for office?"
                    ],
                    [
                        "If elected, how will you know you that you've succeeded in this position?"
                    ],
                    [
                        "Thank you!"
                    ]
                ],
                "timeLimits": [
                    15,
                    30,
                    30,
                    30
                ]
            }
        }
    },
    "path": "/country:us/state:ct/state-legislative-upper:connecticut-state-senate-district-2/stage:primary/party:democratic-party/2020-08-11-qa",
    "subject": "Connecticut State Senate District 2",
    "bp_info": {
        "stage_id": "123456789",
        "election_date": "2020-08-11",
        "race": {
            "id": "123456789",
            "year": 2020,
            "type": "Regular",
            "office": {
                "id": "8218",
                "name": "Connecticut State Senate District 2",
                "level": "State",
                "branch": "Legislative",
                "district": {
                    "id": "771",
                    "name": "Kentucky House of Representatives District 70",
                    "type": "State Legislative (Upper)",
                    "state": "CT"
                }
            }
        }
    },
    "description": "A Candidate Conversation for: Connecticut State Senate District 2 Election Date:2020-08-11"
}
*/

/*
 * function takes an address in Hartford CT
 * returns a list of offices that are relevant to
 * assembly districts and senatorial districts
 * pertinent to the the given address
 **/
const https = require('https')
const geocodeRootURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=' // must be followed by a '+' separated string where + is space
const censusGeocoder = address =>
  `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=${address}&benchmark=9&format=json`
const key = `&key=${process.env.GOOGLE_MAPS_API_KEY}`

const getOfficials = (long, lat, doOnSuccess, address_found) => {
  try {
    https
      .get(`${process.env.ELECTED_OFFICIALS_URL}?long=${long}&lat=${lat}`, resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })

        resp.on('end', async () => {
          const success = JSON.parse(data).success
          if (success) {
            const officials = JSON.parse(data).data[0].elected_officials
            const districts = officials.districts

            /*
             * districts is an array of objects
             * format:
             * name: String -> containing district name
             * id: Number
             * type: String -> containing type of district e.g. School District
             * state: 'CT'
             * offices: [{id, name:???,office_holders}]
             * */

            let officeNames = []
            districts.forEach(district => {
              // the upper legislative body is being used for testing
              if (district.offices && district.type === 'State Legislative (Lower)') {
                district.offices.forEach(office => {
                  officeNames.push({
                    id: office.id,
                    name: office.name,
                    district_number: parseInt(office.name[office.name.length - 1]),
                    type: district.type,
                  })
                })
              }
            })

            //officeNames.forEach(office => {
            //console.log(parseInt(office.name[office.name.length - 1]))
            //})
            //TODO remove this later as the tabs should be filled
            let viewers = []
            for (let office of officeNames) {
              let viewer = await getViewersByOffice(String(office.id))
              viewers.push(viewer)
            }
            //send info after success
            doOnSuccess({ ok: true, address_found, officeNames, viewers })
          } else {
            doOnSuccess({ ok: false, error: JSON.parse(data) })
          }
        })
      })
      .on('error', err => {
        console.log('Error: ' + err)
      })
    https
      .get(`${process.env.ELECTED_OFFICIALS_URL}?long=${long}&lat=${lat}`, resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })

        resp.on('end', async () => {
          const success = JSON.parse(data).success
          if (success) {
            const officials = JSON.parse(data).data[0].elected_officials
            const districts = officials.districts

            /*
             * districts is an array of objects
             * format:
             * name: String -> containing district name
             * id: Number
             * type: String -> containing type of district e.g. School District
             * state: 'CT'
             * offices: [{id, name:???,office_holders}]
             * */

            let officeNames = []
            districts.forEach(district => {
              // the upper legislative body is being used for testing
              if (district.offices && district.type === 'State Legislative (Lower)') {
                district.offices.forEach(office => {
                  officeNames.push({
                    id: office.id,
                    name: office.name,
                    district_number: parseInt(office.name[office.name.length - 1]),
                    type: district.type,
                  })
                })
              }
            })

            //officeNames.forEach(office => {
            //console.log(parseInt(office.name[office.name.length - 1]))
            //})
            //TODO remove this later as the tabs should be filled
            let viewers = []
            for (let office of officeNames) {
              let viewer = await getViewersByOffice(String(office.id))
              viewers.push(viewer)
            }
            //send info after success
            doOnSuccess({ ok: true, address_found, officeNames, viewers })
          } else {
            doOnSuccess({ ok: false, error: JSON.parse(data) })
          }
        })
      })
      .on('error', err => {
        console.log('Error: ' + err)
      })
  } catch (error) {
    console.log(error)
  }
}

export default async function listOffices(address, doOnSuccess) {
  const query = address.trim().replace(/\s+/g, '+') // removes trailing whitespace and replaces inner spaces with '+'

  try {
    https
      .get(censusGeocoder(query), resp => {
        let data = ''
        resp.on('data', chunk => {
          data += chunk
        })
        resp.on('end', () => {
          const jsonData = JSON.parse(data)
          const { result } = jsonData
          console.log(jsonData)
          if (result && result.addressMatches.length > 0) {
            const matches = result.addressMatches[0]
            const address_found = matches.matchedAddress
            const lng = matches.coordinates.x
            const lat = matches.coordinates.y
            getOfficials(lng, lat, doOnSuccess, address_found)
          } else {
            doOnSuccess({ ok: false, jsonData })
          }
        })
      })
      .on('error', err => {
        console.log('Error: ' + err)
      })
  } catch (error) {
    console.log(error)
  }
}
//export default async function listOffices(address, doOnSuccess) {
//const query = address.trim().replace(/\s+/g, '+') // removes trailing whitespace and replaces inner spaces with '+'

//try {
//https
//.get(geocodeRootURL + query + key, resp => {
//let data = ''
//resp.on('data', chunk => {
//data += chunk
//})
//resp.on('end', () => {
//const jsonData = JSON.parse(data)
//const { status } = jsonData
//console.log(jsonData)
//if (status === 'OK') {
//const geo = jsonData.results[0].geometry
//const address_found = jsonData.results[0].formatted_address
//const lng = geo.location.lng
//const lat = geo.location.lat
//getOfficials(lng, lat, doOnSuccess, address_found)
//} else {
//doOnSuccess({ ok: false, jsonData })
//}
//})
//})
//.on('error', err => {
//console.log('Error: ' + err)
//})
//} catch (error) {
//console.log(error)
//}

// validate the address to check if it meets all the requirements
// check google maps to get a long + lat coordinate for the address
// send coordinates in a ballotpedia url get request format ?lat=xx.xxxx&long=xx.xxxx
// take list of offices and filter for relevant offices.
//}

//let hartford_voting_centers = [
//{
//lat: 41.792,
//long: -72.708,
//},
//{
//lat: 41.769,
//long: -72.707,
//},
//{
//lat: 41.757,
//long: -72.707,
//},
//{
//lat: 41.735,
//long: -72.694,
//},
//{
//lat: 41.75,
//long: -72.685,
//},
//{
//lat: 41.789,
//long: -72.671,
//},
//]
//for (let { long, lat } of hartford_voting_centers) {
//console.log(long, lat)
//https
//.get(`${process.env.ELECTED_OFFICIALS_URL}?long=${long}&lat=${lat}`, resp => {
//let data = ''
//resp.on('data', chunk => {
//data += chunk
//})

//resp.on('end', async () => {
//const success = JSON.parse(data).success
//if (success) {
//const officials = JSON.parse(data).data[0].elected_officials
//const districts = officials.districts

//let officeNames = []
//districts.forEach(district => {
//// the upper legislative body is being used for testing
//if (district.offices && district.type === 'State Legislative (Lower)') {
//district.offices.forEach(office => {
//officeNames.push({
//id: office.id,
//name: office.name,
//district_number: parseInt(office.name[office.name.length - 1]),
//type: district.type,
//})
//})
//}
//})

//let viewers = []
//for (let office of officeNames) {
//let viewer = await getViewersByOffice(String(office.id))
//viewers.push(viewer)
//}
////send info after success
//console.log(officeNames)
//} else {
//console.log(JSON.parse(data))
//}
//})
//})
//.on('error', err => {
//console.log('Error: ' + err)
//})
//}
