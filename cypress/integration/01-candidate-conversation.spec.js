describe('Candidate Conversation', () => {
  beforeEach(() => {
    cy.visit('/candidate-conversation')

    cy.get('video').each($video => {
      $video.attr('muted', true)
    })
  })

  it('clicking on the Begin button should cause the videos to play', () => {
    cy.get('[data-testid=begin-button]').click()

    cy.wait(3000)

    cy.get('video').each($video => {
      const participant = $video.attr('participant')
      const video = $video.get(0)
      const videoIsPlaying = video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2
      expect(videoIsPlaying, `${participant} video is playing`).to.be.true
    })
  })

  it('videos should rotate after the moderator finishes speaking', () => {
    cy.get('[data-testid=begin-button]').click()

    cy.wait(3000)

    cy.log('checking initial order')
    cy.get('video').each($video => {
      const chair = $video.attr('chair')
      const participant = $video.attr('participant')
      expect(chair, `initial chair for ${participant}`).to.equal(INITIAL_ORDER[participant])
    })

    cy.log('waiting for moderator to finish speaking')
    cy.get('[data-testid=moderator-video]', { timeout: 60000 }).should($video => {
      const video = $video.get(0)
      expect(video.ended, 'video has ended').to.be.true
    })

    cy.log('moderator has finished speaking, waiting for rotation')
    cy.wait(3000)

    cy.log('checking rotated order')
    cy.get('video').each($video => {
      const chair = $video.attr('chair')
      const participant = $video.attr('participant')
      expect(chair, `rotated chair for ${participant}`).to.equal(ROTATED_ORDER[participant])
    })

    cy.log('all videos have rotated')
  })
})

const INITIAL_ORDER = {
  moderator: 'speaking',
  audience1: 'nextUp',
  audience2: 'seat2',
  audience3: 'seat3',
}

const ROTATED_ORDER = {
  moderator: 'seat3',
  audience1: 'speaking',
  audience2: 'nextUp',
  audience3: 'seat2',
}
