describe('Candidate Conversation', () => {
  beforeEach(() => {
    cy.visit('/schoolboard-conversation')

    cy.get('video').each($video => {
      $video.attr('muted', true)
    })
  })

  it('clicking on the Begin button should cause the videos to play', () => {
    cy.get('button')
      .contains('Begin')
      .click()

    cy.wait(3000)

    cy.get('video').each($video => {
      const participant = $video.attr('participant')
      const video = $video.get(0)
      const videoIsPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2
      expect(videoIsPlaying, `${participant} video is playing`).to.be.true
    })
  })
})
