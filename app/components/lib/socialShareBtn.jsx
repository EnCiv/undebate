import React, { useState } from 'react'

export const SocialShareBtn = props => {
  console.log(props, '😈🎮🎰')
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div>
      <div onClick={handleClick}>SHARE TO THE MEDIA BTN</div>
      {isOpen && (
        <div>
          <a target="_blank" href="https://twitter.com/intent/tweet?text=Hello%20world">
            share to twitter
          </a>
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https://www.theendsciencemetaphysics.com&quote=Undebate"
            target="_blank"
          >
            Share on Facebook
          </a>
        </div>
      )}
    </div>
  )
}
