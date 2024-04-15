import { Socket } from "socket.io-client"

export const keyUpHandler = (e: KeyboardEvent, socket: Socket) => {
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    socket.emit('key_action', 'keyUp')
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    socket.emit('key_action', 'keyUp')
  }
}

export const keyDownHandler = (e: KeyboardEvent, socket: Socket): void => {
  if (e.key === 'Up' || e.key === 'ArrowUp') {
    socket.emit('key_action', 'keyDownUp')
  } else if (e.key === 'Down' || e.key === 'ArrowDown') {
    socket.emit('key_action', 'keyDownDown')
  }
}
