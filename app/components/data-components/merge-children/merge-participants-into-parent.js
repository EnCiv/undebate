'use strict'
import shuffle from 'shuffle-array'

/* Example input document
the input document example
{
    "_id": {
        "$oid": "5d5f33ede7179a084ef28452"
    },
    "path": "/schoolboard-demo",
    "subject": "School Board Candidate Conversation - Candidate Conversation",
    "description": "A prototype Candidate Conversation for schoolboard",
    "component": {
        "component": "MergeParticipants",
    },
    "webComponent": {
        "component": "Undebate",
        "participants": {
            moderator": {
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641226/undebate-short-m1.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m2.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m4.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641207/undebate-short-m6.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565643095/undebate-short-ms.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "- Who you are",
                        "- Where you are",
                        "- One word to describe yourself",
                        "- What office you are running for"
                    ],
                    [
                        "What type of skills should students be learning for success in the 21st century?"
                    ],
                    [
                        "Closing Remarks"
                    ]
                ]
            },
            "audience1": {
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w1.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w2.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w3.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641303/undebate-short-ws.mp4"
            },
        }
    },
}

what's found
{
    "_id": {
        "$oid": "5d5f0e4a2a540f4b18f1b06b"
    },
    "parentId": "5d5491807c213e60b8efb908",
    "subject": "Participant:School Board Candidate Conversation - Participant",
    "description": "A participant in the following discussion: Participant - for a school board election.",
    "component": {
        "component": "MergeParticipants",
        "participant": {
            "speaking": [
                "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm"
            ],
            "creator": "5d5491807c213e60b8efb908",
            "name": "david",
            "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm"
        }
    }
}


What we are trying to create:
{
    "_id": {
        "$oid": "5d5335187c213e60b8ef318c"
    },
    "path": "/schoolboard-demo",
    "subject": "School Board Candidate Conversation",
    "description": "School Board Candidate discussion has 2 candidates, and a moderator",
    "webComponent": {
        "component": "UndebateLine",
        "participants": {
            "moderator": {
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641226/undebate-short-m1.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m2.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641208/undebate-short-m4.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641207/undebate-short-m6.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565643095/undebate-short-ms.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "- Who you are",
                        "- Where you are",
                        "- One word to describe yourself",
                        "- What office you are running for"
                    ],
                    [
                        "What type of skills should students be learning for success in the 21st century?"
                    ],
                    [
                        "Closing Remarks"
                    ]
                ]
            },
            "audience1": {
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w1.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w2.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w3.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641303/undebate-short-ws.mp4"
            },
            "audience2": {
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510654/5d5b73c01e3b194174cd9b92-1-speaking.webm",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510659/5d5b73c01e3b194174cd9b92-2-speaking.webm",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510665/5d5b73c01e3b194174cd9b92-3-speaking.webm"
                ],
                "name": "david",
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1566510649/5d5b73c01e3b194174cd9b92-0-seat2.webm"
            }
        }
    }
}

*/
const audience = 'audience'
export default function mergeParticipantsIntoParent(childIotas, parentIota) {
  const maxParticipants = parentIota.webComponent.maxParticipants || 7
  const participants = childIotas.filter(iota => iota.component && iota.component.component === 'MergeParticipants')
  let prevUserId = ''
  const latestParticipants = participants.filter(iota =>
    iota.userId !== prevUserId ? ((prevUserId = iota.userId), true) : false
  )
  let limitedLatestParticipants = latestParticipants.slice(0, maxParticipants)
  let nextIndex = 1
  // find the first unused participants.audience<index>
  Object.keys(parentIota.webComponent.participants).forEach(participant => {
    if (participant.indexOf(audience) === 0) {
      let val = Number.parseInt(participant.slice(audience.length))
      if (Number.isNaN(val)) return
      if (val >= nextIndex) nextIndex = val + 1
    }
  })
  if (parentIota.webComponent.shuffle === true) shuffle(limitedLatestParticipants)
  else if (parentIota.webComponent.shuffle === 'bp_info_alphabetize') {
    limitedLatestParticipants.sort((a, b) => {
      // sort by name
      const nameA =
        (a &&
          a.component &&
          a.component.participant &&
          a.component.participant.bp_info &&
          a.component.participant.bp_info.last_name &&
          a.component.participant.bp_info.last_name.toUpperCase()) ||
        '' // ignore upper and lowercase
      const nameB =
        (b &&
          b.component &&
          b.component.participant &&
          b.component.participant.bp_info &&
          b.component.participant.bp_info.last_name &&
          b.component.participant.bp_info.last_name.toUpperCase()) ||
        '' // ignore upper and lowercase
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0
    })
  }
  limitedLatestParticipants.forEach(participantDoc => {
    parentIota.webComponent.participants[audience + nextIndex++] = {
      participantId: participantDoc._id.toString(),
      userId: participantDoc.userId,
      ...participantDoc.component.participant,
    }
  })
}
