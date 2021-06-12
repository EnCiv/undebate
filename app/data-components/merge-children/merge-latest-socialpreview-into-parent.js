'use strict;'

/**
 * mergeLatestSocialpreivewIntoParent
 * 
 * look through the children for the latest socialpreview component and add or update the parentIota.webComponent.metaTags for og:image
 * 
 * see https://ogp.me/ for a more on the open graph protocol
 * 
 * a socialpreview iota looks like this
{
    "_id": {
        "$oid": "5ed71cac2a4adc21a8701465"
    },
    "parentId": "5d7ffe9ee7179a084efe16e0",
    "subject": "Social Media Preview: School Board Candidate Conversation - Candidate Conversation",
    "description": "a social media preivew for taken from https://undebate-qa.herokuapp.com/yc-conversation-demo",
    "component": {
        "component": "socialpreview",
        "imgUrl": "http://res.cloudinary.com/huu1x9edp/image/upload/v1591155884/uwtturpioiitujymcuxf.png"
    }
}
 * 
 * 
 */

/* a parent with a social media preview looks like this - see the meta tags
{
    "_id": {
        "$oid": "5e62eee2e7179a17e21444e7"
    },
    "path": "/what-is-democracy",
    "subject": "What is Democracy",
    "description": "This is a conversation cafe style discussion about democracy, what it is, its challenges, and its advantages.",
    "component": {
        "component": "CafeParticipants"
    },
    "webComponent": {
        "opening": {
            "noPreamble": true
        },
        "logo": "none",
        "instructionLink": "https://docs.google.com/document/d/1rTk1d7EP2SJxiXDJCG7opCO0-yNnVXhyiobwVoqo2is/edit?usp=sharing",
        "metaTags": [
            "property=\"og:title\" content=\"What is Democracy\"",
            "property=\"og:image\" content=\"https://res.cloudinary.com/hf6mryjpf/image/upload/v1587412519/what-is-democracy-preview-2020Apr20_cl3ziv.png\""
        ],
        "hangupButton": {
            "name": "Exit"
        },
        "maxParticipants": 5,
        "webComponent": "Undebate",
        "participants": {
            "moderator": {
                "name": "David Fridley",
                "speaking": [
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539961/5d5b74751e3b194174cd9b94-0-speaking20200307T001232226Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539962/5d5b74751e3b194174cd9b94-1-speaking20200307T001241427Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539962/5d5b74751e3b194174cd9b94-2-speaking20200307T001242059Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539963/5d5b74751e3b194174cd9b94-3-speaking20200307T001242736Z.mp4",
                    "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539964/5d5b74751e3b194174cd9b94-4-speaking20200307T001243414Z.mp4"
                ],
                "listening": "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1583539965/5d5b74751e3b194174cd9b94-5-speaking20200307T001244393Z.mp4",
                "agenda": [
                    [
                        "Introductions",
                        "1- What is your first name",
                        "2- What city and state are you in",
                        "3- One word to describe yourself"
                    ],
                    [
                        "What is democracy or what does it mean to you?"
                    ],
                    [
                        "What are the challenges in a democracy? Or what are its weaknesses"
                    ],
                    [
                        "What are the advantages, or strengths of democracy?"
                    ],
                    [
                        "Thank You!"
                    ]
                ],
                "timeLimits": [
                    15,
                    60,
                    60,
                    60
                ]
            },
            "human": {
                "listening": {
                    "round": 1,
                    "seat": "nextUp"
                }
            }
        },
        "closing": {
            "thanks": "Thank You!",
            "iframe": {
                "src": "https://docs.google.com/forms/d/e/1FAIpQLScYiUwoqCmlqr5KQf99ewVRxEvyCrx9CvSH196xlqqtj7cEkg/viewform?embedded=true",
                "width": 640,
                "height": 1579
            }
        }
    },
    "bp_info": {
        "stage_id": "0",
        "election_date": "2020-11-03"
    }
}
*/

export default function mergeLatestSocialpreviewIntoParent(childIotas, parentIota) {
  // the list is sorted by date, find the first / youngest child with a socialpreview
  let socialPreview
  childIotas.some(iota =>
    iota.component && iota.component.component === 'socialpreview' ? (socialPreview = iota) : false
  ) // .some to stop after finding the first one
  if (socialPreview) {
    if (!parentIota.webComponent) parentIota.webComponent = {}
    if (!parentIota.webComponent.metaTags) parentIota.webComponent.metaTags = []
    else parentIota.webComponent.metaTags = parentIota.webComponent.metaTags.filter(tag => !/og:image/.test(tag)) // filter out any image tags
    parentIota.webComponent.metaTags.push(`property="og:image" content="${socialPreview.component.imgUrl}"`)
  }
}
