'use strict'
import Iota from '../../models/iota'

export default async function getViewersByOffice(office_id) {
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
