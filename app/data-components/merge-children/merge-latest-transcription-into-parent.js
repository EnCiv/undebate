'use strict;'

export default function mergeLatestTranscriptionIntoParent(childIotas, parentIota) {
  // the list is sorted by date, find each transcription and add it to the participant in parentIota - caution there may be old transcriptions
  childIotas.forEach(iota => {
    if (!iota.component || iota.component.component !== 'Transcription') return
    Object.keys(parentIota.webComponent.participants).forEach(participant => {
      if (parentIota.webComponent.participants[participant].participantId === iota.component.participantId) {
        if (parentIota.webComponent.participants[participant].transcriptions) return // there is already a transcription here
        parentIota.webComponent.participants[participant].transcriptions = iota.component.transcriptions
      }
    })
  })
}

/*
//  What we are trying to create:
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
        "participantId": "flsjfldsje93u2093u0",
        "userId": "lisjdfkljs93028092",
        "speaking": [
          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w1.mp4",
          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w2.mp4",
          "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641286/undebate-short-w3.mp4"
        ],
        "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/v1565641303/undebate-short-ws.mp4",
        "transcriptions": [
          {
            "words": [
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 200000000
                },
                "word": "I",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "word": "would",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 100000000
                },
                "word": "love",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 100000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 300000000
                },
                "word": "to",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 300000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "word": "go",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 700000000
                },
                "word": "for",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 700000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "word": "like",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 0
                },
                "word": "a",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 500000000
                },
                "word": "minimum",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 600000000
                },
                "word": "of",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 0
                },
                "word": "like",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 300000000
                },
                "word": "four",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 300000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 500000000
                },
                "word": "days",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 900000000
                },
                "word": "he",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "word": "works",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "word": "for",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "word": "a",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 500000000
                },
                "word": "long",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 900000000
                },
                "word": "weekend",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "word": "at",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 300000000
                },
                "word": "minimum",
                "speakerTag": 0
              }
            ],
            "transcript": "I would love to go for like a minimum of like four days he works for a long weekend at minimum",
            "confidence": 0.819003701210022
          },
          {
            "words": [
              {
                "startTime": {
                  "seconds": "0",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 200000000
                },
                "word": "I",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "word": "would",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "1",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 100000000
                },
                "word": "love",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 100000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 300000000
                },
                "word": "to",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 300000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "word": "go",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 400000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 700000000
                },
                "word": "for",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 700000000
                },
                "endTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "word": "like",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "2",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 0
                },
                "word": "a",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 500000000
                },
                "word": "minimum",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "3",
                  "nanos": 600000000
                },
                "word": "of",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "3",
                  "nanos": 600000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 0
                },
                "word": "like",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 300000000
                },
                "word": "four",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 300000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 500000000
                },
                "word": "days",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "4",
                  "nanos": 900000000
                },
                "word": "he",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "4",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "word": "works",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "word": "for",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "word": "a",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 200000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 500000000
                },
                "word": "long",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 500000000
                },
                "endTime": {
                  "seconds": "5",
                  "nanos": 900000000
                },
                "word": "weekend",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "5",
                  "nanos": 900000000
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "word": "at",
                "speakerTag": 0
              },
              {
                "startTime": {
                  "seconds": "6",
                  "nanos": 0
                },
                "endTime": {
                  "seconds": "6",
                  "nanos": 300000000
                },
                "word": "minimum",
                "speakerTag": 0
              }
            ],
            "transcript": "I would love to go for like a minimum of like four days he works for a long weekend at minimum",
            "confidence": 0.819003701210022
          },
        ]

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
