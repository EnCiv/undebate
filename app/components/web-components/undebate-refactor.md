Undebate refactor considerations:

- We will want to experiment with many different ways of rendering an Undebate

- We will want to experimant with different ways of moving the video elements around on the screen or transitioning from speaker to speaker.
- Many pieces of the functional code have to access the video element.
- We have a goal of keeping everything on screen - but that gets hard when there are many candidates.

It's not a requirement - but we have this design paradigm that it's like a web conference, and it could be live but it's not (yet)

A long term goal, that we don't have to get to in the first level of refactor, is to be able to define an undebate with a list of Iotas in the database where each iota defines one compnent, and some props that are all connected to together into a single undebate. Then undebates could be quickly customized for different situations.

For instance:

1. Preamble - that is shown to candidates before they record
2. Training - something that we don't have yet but where we have the camera element, and a moderator element, and the moderator is explaing what the buttons do and the user is pressing them, and recording 'practive' videos
3. Questions - Each question is a different instance of the same component, but with different data from the db.
4. Polls - future - like a question, but then we ask voters to vote for the one or 2 answers that they thought were best.
5. Sign Up page -
6. Upload page -

this.participants
{
moderator: {
element: {current: video.H-participant-0-2-8.H-stylesSet-0-2-42}
listeningImmediate: false
listeningObjectURL: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788719/candidate-conversation-moderator-listening_nlfeoy.mp4"
placeholderUrl: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto,so_0/v1566788719/candidate-conversation-moderator-listening_nlfeoy.png"
speakingImmediate: []
speakingObjectURLs: (4) ["https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-0_d7a3zr.mp4",
"https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-1_gtchg2.mp4",
"https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-2_bsceus.mp4",
"https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-3_qomqgj.mp4"]
youtube: false
}
audience1:{
element: {current: video.H-participant-0-2-8.H-stylesSet-0-2-42}
listeningImmediate: false
listeningObjectURL: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-as.mp4"
placeholderUrl: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto,so_0/v1565640905/undebate-short-as.png"
speakingImmediate: []
speakingObjectURLs: (3) [
"https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a1.mp4",
"https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a2.mp4",
"https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a3.mp4"]
youtube: false
}
human: {
element: {current: video.H-participant-0-2-8.H-stylesSet-0-2-42}
listeningImmediate: false
listeningObjectURL: null
placeholderUrl: ""
speakingBlobs: []
speakingImmediate: []
speakingObjectURLs: []
youtube: false
}
}

this.props.participants
{
moderator: {
agenda: (3) [Array(5), Array(1), Array(1)]
listening: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1566788719/candidate-conversation-moderator-listening_nlfeoy.mp4"
name: "David Fridley"
speaking: (4) ["https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-0_d7a3zr.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-1_gtchg2.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-2_bsceus.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/…idate-conversation-creator-moderator-3_qomqgj.mp4"]
timeLimits: (3) [10, 60, 60]
}
audience1: {
listening: "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-as.mp4"
name: "Adolf Gundersen"
speaking: (3) ["https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a1.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a2.mp4", "https://res.cloudinary.com/hf6mryjpf/video/upload/q_auto/v1565640905/undebate-short-a3.mp4"]
}
human:{
listening: {round: 2, seat: "nextUp"}
}
}
