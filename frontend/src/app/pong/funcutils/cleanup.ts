import { Socket } from 'socket.io-client'
import x_registerStatus from './x_registerStatus'
import { keyDownHandler, keyUpHandler } from './keyHandlers'

const cleanup = (socket: Socket, useID: number) => {
  socket.disconnect()
  document.removeEventListener('keydown', (e) => keyDownHandler(e, socket))
  document.removeEventListener('keyup', (e) => keyUpHandler(e, socket))
  x_registerStatus(useID, 'IDLE')
}

export default cleanup
