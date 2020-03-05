'use strict'

function printTime() {
  const d = new Date()

  let hours = d.getHours(),
    minutes = d.getMinutes(),
    seconds = d.getSeconds()

  return [hours, minutes, seconds]
    .map(t => {
      if (t < 10) {
        t = `0${t}`
      }
      return t
    })
    .map(t => t.toString())
}

export default printTime
