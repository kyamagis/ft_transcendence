import { useEffect, useRef, Dispatch, SetStateAction } from 'react'
import { io, Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { ChatRoomWithOutPassword, MessageWithUser } from '../../types/types'
import { CurrentRoom } from '../components/CurrentRoom'
import PreviousMap from 'postcss/lib/previous-map'

/*
接続確立時のQueryとしてユーザーID、
イベントハンドラー内で使う関数を引数を必要とする
*/
interface propsType {
  userId: number | undefined
  setRoomList: Dispatch<SetStateAction<ChatRoomWithOutPassword[]>>
  setCurrentRoomHistory: Dispatch<SetStateAction<MessageWithUser[]>>
  setCurrentRoom: Dispatch<SetStateAction<ChatRoomWithOutPassword | null>>
  openPasswordInputModal: () => void
  setSessionError: Dispatch<SetStateAction<boolean>>
}

/* 
WebSocket通信の接続確立と、
イベントハンドラーの登録を行う
*/
export function useWebSocket({
  userId,
  setRoomList,
  setCurrentRoomHistory,
  setCurrentRoom,
  openPasswordInputModal,
  setSessionError,
}: propsType) {
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!userId) {
      return
    }
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL + '/chat', {
      query: {
        userId: userId,
      },
    })

    const so = socketRef.current

    /******************** イベントハンドラーの登録 ******************************/
    so.on('room_list', (roomList: ChatRoomWithOutPassword[]) => {
      console.log('room_list received', roomList)
      setRoomList(roomList)
    })
    so.on('message_history', (messageHistory: MessageWithUser[]) => {
      setCurrentRoomHistory(messageHistory)
      console.log(messageHistory)
    })
    so.on('receive_message', (message: MessageWithUser) => {
      console.log('receive_message received', message)
      setCurrentRoomHistory((prev) => [...prev, message])
    })
    so.on('room_created', (newRoom: ChatRoomWithOutPassword) => {
      setRoomList((prev) => [...prev, newRoom])
      console.log('room_created received', newRoom)
    })
    so.on('room_deleted', (room: ChatRoomWithOutPassword) => {
      setRoomList((prev) => prev.filter((prevRoom) => prevRoom.id !== room.id))
      setCurrentRoom((prev) => {
        if (prev?.id === room.id) {
          return null
        } else {
          return prev
        }
      })
    })
    so.on('success', (message: string) => {
      toast.success(message)
    })
    so.on('join_room_success', (room: ChatRoomWithOutPassword) => {
      so.emit('join_room', room)
    })
    so.on('join_room_error', (error_message: string) => {
      toast.error(error_message)
      console.error(error_message)
      setCurrentRoom(null)
    })
    so.on('require_password', (room: ChatRoomWithOutPassword) => {
      openPasswordInputModal()
    })
    so.on('invalid_session', () => {
      toast.error('Invalid session detected. Please login again.')
      console.error('invalid_session')
      setSessionError(true)
    })

    so.on('error', (error) => {
      console.error(error)
      toast.error(error)
    })

    so.on('connect_error', (error) => {
      console.error(error)
      toast.error(error.message)
    })

    so.on('room_modified', (room: ChatRoomWithOutPassword) => {
      console.log('room_modified received', room)
      setRoomList((prev) =>
        prev.map((prevRoom) => {
          if (prevRoom.id === room.id) {
            return room
          } else {
            return prevRoom
          }
        })
      )
      setCurrentRoom((prev) => {
        if (prev?.id === room.id) {
          return room
        } else {
          return prev
        }
      })
    })

    return () => {
      so.disconnect()
    }
  }, [userId]) // eslint-disable-line react-hooks/exhaustive-deps
  return socketRef.current
}
