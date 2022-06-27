'use strict'
import { Iota } from 'civil-server'

/* Example input document
the input document example
{
    "_id": {
        "$oid": "5d5f33ede7179a084ef28452"
    },
    "path": "/schoolboard-demo-creator",
    "subject": "School Board Candidate Conversation - Candidate Conversation",
    "description": "A prototype Candidate Conversation for schoolboard",
    "component": {
        "component": "UndebateCreator",
        "participants": {
            "audience1": {
                "name": "Adolf Gundersen",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a1.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a2.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-a3.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565640905/undebate-short-as.mp4"
            },
            "human": {}
        }
    },
    "webComponent": {
        "component": "Undebate",
        "participants": {}
    },
    "parentId": "5d5f33a7e7179a084ef28434"
}

what's found:
{
    "_id": {
        "$oid": "5d5f33a7e7179a084ef28434"
    },
    "path": "/schoolboard-demo-creator",
    "subject": "School Board Candidate Conversation - Candidate Conversation",
    "description": "A prototype Candidate Conversation for schoolboard",
    "component": {
        "component": "mergeParticipants"
    },
    "webComponent": {
        "component": "Undebate",
        "participants": {
            "moderator": {
                "name": "David Fridley",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565822556/Undebate-Create-1_oz0qq6.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565822503/Undebate-Create-2_pcnezp.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565822493/Undebate-Create-3_j10hax.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565822507/Undebate-Create-4_wrbu9s.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565822540/Undebate-Create-silence_feurmb.mp4",
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
                ],
                "timeLimits": [
                    10,
                    60,
                    60
                ]
            }
        }
    }
}


What we are trying to create:
{
    "_id": {
        "$oid": "5d5335187c213e60b8ef318c"
    },
    "path": "/us-ca-la-schoolboard-line",
    "subject": "Irvine School Board Candidate Conversation",
    "description": "The Irvine School Board Candidate discussion has 2 candidates, and a moderator",
    "webComponent": {
        "component": "Undebate",
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
            "human": {silence: {round: 0, seat: "seat2"}}
        }
    }
}

*/

export default class UndebateCreator {
  static fetch(undebateCreator) {
    return new Promise(async (ok, ko) => {
      try {
        var undebateDocs = await Iota.find({
          _id: Iota.ObjectID(undebateCreator.parentId),
          'webComponent.webComponent': 'Undebate',
        })
        // get the participants from the parent Undebate first
        undebateDocs.forEach(undebateDoc => {
          Object.keys(undebateDoc.webComponent.participants).forEach(participant => {
            undebateCreator.webComponent.participants[participant] = undebateDoc.webComponent.participants[participant]
          })
        })
        // then get the participants in this document's participants.
        // order matters
        Object.keys(undebateCreator.component.participants).forEach(participant => {
          undebateCreator.webComponent.participants[participant] = undebateCreator.component.participants[participant]
          delete undebateCreator.component.participants[participant] // don't let object be in two places
        })
        ok(undebateCreator)
      } catch (err) {
        logger.error('UndebateCreator caught error', err, 'undebate', undebateCreator)
        ok()
      }
    })
  }
}
