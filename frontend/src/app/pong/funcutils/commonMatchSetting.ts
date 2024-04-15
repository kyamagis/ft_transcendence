import { Socket, io } from 'socket.io-client'
import { ScreenManagement } from '../enums'
import { keyDownHandler, keyUpHandler } from './keyHandlers'
import x_registerStatus from './x_registerStatus'
import { useAuth } from '@/app/auth'

const commonMatchSetting = (
  errorMessageRef: React.MutableRefObject<string>,
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >,
  URL: string,
  useID: number
) => {
  x_registerStatus(useID, 'PONG')

  const socket: Socket = io(URL, {
    transports: ['websocket'],
  })

  socket.on('connect', () => {
    console.log('backendと接続完了')
  })

  socket.on('connect_error', () => {
    errorMessageRef.current = 'Server Error'
    setScreenManagementState(ScreenManagement.Error)
  })

  socket.on('session_check', () => {
    socket.emit('session_guard', useID)
  })

  socket.on('session_error', (errorMessage) => {
    errorMessageRef.current = errorMessage
    setScreenManagementState(ScreenManagement.Error)
    const { setAuthStatus } = useAuth()
    setAuthStatus('UNAUTHORIZED')
  })

  socket.on('error', (errorMessage) => {
    errorMessageRef.current = errorMessage
    setScreenManagementState(ScreenManagement.Error)
  })

  document.addEventListener('keydown', (e) => keyDownHandler(e, socket), false)
  document.addEventListener('keyup', (e) => keyUpHandler(e, socket), false)
  return socket
}

export default commonMatchSetting
