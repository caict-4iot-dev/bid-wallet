import InternalMessage from '../../message/InternalMessage'
import * as InternalMessageTypes from '../../message/InternalMessageTypes'

const actions = {
  setLink () {
    // InternalMessage.widthPayload(InternalMessageTypes.TOLINK, 'https://explorer.zetrix.com/').send()
  },
  setLockStart () {
    InternalMessage.widthPayload(InternalMessageTypes.SETLOCKSTART).send()
  },
  setOpenWelcome () {
    InternalMessage.widthPayload(InternalMessageTypes.SETOPENWINDOW).send()
  }
}

export default actions
