'use strict'
import Iota from '../../../models/iota'

/**
 * MergeChildren
 *
 * find all the iotas that have property parentId referencing this parentIota
 * then call functions to merge those children into the parentIota
 * the merge functions will look for components that match their type, and do specific things for the merge - like take participant recordings and them as participants in the viewer
 *
 * the parentIota is mutated (added to) and also returned
 */

// wishlist: tool that would build this list automatically out of the other files in this directory
// question: the order doesn't matter right now - but will it in the future?

const Components = {
  mergeParticipantsIntoParent: require('./merge-participants-into-parent').default,
  mergeLatestSocialpreviewIntoParent: require('./merge-latest-socialpreview-into-parent').default,
}

export default class MergeChildren {
  static fetch(parentIota) {
    return new Promise(async (ok, ko) => {
      try {
        //find all the children of this iota, and sort them with latest first
        const childIotas = await Iota.aggregate([
          { $match: { parentId: parentIota._id.toString() } },
          { $sort: { _id: -1 } },
        ])
        Object.keys(Components).forEach(mergeFunc => {
          try {
            console.info('mergeFunc', mergeFunc)
            Components[mergeFunc](childIotas, parentIota)
          } catch (err) {
            logger.error('MergeChildren caught error running:', mergeFunc, 'parentIota:', parentIota, 'error:', err)
            // skip this error and keep going
          }
        })
        ok(parentIota)
      } catch (err) {
        logger.error('MergeChildren caught error', err, 'parentIota', parentIota)
        ok(parentIota)
      }
    })
  }
}
