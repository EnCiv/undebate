'use strict'

import Iota from '../models/iota'

export default async function inputAndVotes(voteObj, round, input, inputParentId) {
  console.info('input', voteObj, round, input, inputParentId)
  if (inputParentId instanceof Iota.ObjectID) inputParentId = inputParentId.toString()
  if (!this.synuser) return // if no user do nothing
  const userId = this.synuser.id
  if (input) {
    var obj = {
      subject: input,
      description: input,
      component: 'answer',
      userId,
      parentId: inputParentId,
    }
    try {
      var result = await Iota.create(obj)
      voteOn(result._id.toString(), voteObj.input, round, userId)
    } catch (err) {
      logger.error('input-and-vote', err)
    }
  }
  Object.keys(voteObj).forEach(parentId => {
    if (parentId === 'input') return
    voteOn(parentId, voteObj[parentId], round, userId)
  })
}

async function voteOn(id, value, round, userId) {
  let vote = typeof value === 'boolean' ? (value ? 'up' : 'neutral') : value
  var voteOnObj = {
    parentId: id,
    userId: userId,
    subject: `voteOn for ${id}`,
    description: `a vote of ${value} for ${id}`,
    component: {
      component: 'voteOn',
      [`round-${round}-vote`]: vote,
    },
  }
  try {
    var result = await Iota.create(voteOnObj)
  } catch (err) {
    logger.error('voteOn caught error', err)
  }
}
