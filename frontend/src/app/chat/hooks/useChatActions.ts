import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import {
  ChatRoomWithOutPassword,
  MessageWithUser,
  CreateMessageInput,
  CreateChatRoominput,
  RoomType,
  User,
} from '../../types/types'
import { Socket } from 'socket.io-client'
import { toast } from 'react-hot-toast'
import { UserData } from '../../auth/hooks/useAuth'

interface propsType {
  socket: Socket | null
  userData: UserData | undefined
  currentRoom: ChatRoomWithOutPassword | null
  setCurrentRoom: (room: ChatRoomWithOutPassword | null) => void

  roomList: ChatRoomWithOutPassword[]
  setCurrentRoomHistory: Dispatch<SetStateAction<MessageWithUser[]>>

  closeRoomCreateModal: () => void
  newRoomName: string
  setNewRoomName: Dispatch<SetStateAction<string>>
  newRoomType: RoomType
  setNewRoomType: Dispatch<SetStateAction<RoomType>>
  newRoomPassword: string
  setNewRoomPassword: Dispatch<SetStateAction<string>>
}

export function useChatActions({
  socket,
  userData,

  currentRoom,
  setCurrentRoom,

  roomList,
  setCurrentRoomHistory,

  closeRoomCreateModal,
  newRoomName,
  setNewRoomName,
  newRoomType,
  setNewRoomType,
  newRoomPassword,
  setNewRoomPassword,
}: propsType) {
  const [sendMessage, setSendMessage] = useState('')

  // メッセージ送信
  const WsSendMessage = () => {
    if (sendMessage === '') {
      return
    }
    const time = new Date()

    // サーバーにメッセージを送信
    if (!socket) return

    if (!currentRoom) return

    if (userData?.id === undefined) return

    const send_message: CreateMessageInput = {
      content: sendMessage,
      timestamp: time,
      userId: userData?.id,
      chatRoomId: currentRoom.id,
    }
    console.log('send_message: ', send_message)

    socket.emit('send_message', send_message)

    // inputエリアを空にする
    setSendMessage('')
  }

  // ルーム作成
  const wsCreateRoom = (roomName?: string, roomType?: RoomType) => {
    // 空文字の場合は作成しない
    if (newRoomName === '' && roomName === undefined) {
      toast.error('Prease input room name')
      return
    }
    console.log('newRoomName: ', newRoomName)
    console.log('newRoomType: ', newRoomType)
    console.log('roomName: ', roomName)
    console.log('roomType: ', roomType)

    if (newRoomType === RoomType.PASSWORD_PROTECTED) {
      if (!newRoomPassword) {
        toast.error('Prease input password')
        return
      }
      if (
        !newRoomPassword.match(
          /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{6,100}$/
        )
      ) {
        toast.error(
          'Require 6character lowercase, uppercase, and a number password'
        )
        return
      }
    }

    closeRoomCreateModal()
    console.log('wsCreateRoom Name: ', newRoomName)
    console.log('wsCreateRoom Type: ', newRoomType)

    const newRoom: CreateChatRoominput = {
      roomName: roomName ? roomName : newRoomName,
      roomType: roomType ? roomType : newRoomType,
      roomPassword: newRoomPassword,
    }
    setNewRoomName('')
    setNewRoomType(RoomType.PUBLIC)
    setNewRoomPassword('')
    // 重複チェック
    if (
      roomList.some(
        (room) =>
          room.roomName === newRoom.roomName &&
          room.roomType === newRoom.roomType
      )
    ) {
      toast('Room name already exists', {
        icon: '❗',
      })
      return
    }

    // サーバーにルーム作成を要求
    toast.success('Create Room Success')
    socket?.emit('create_room', newRoom)
  }

  // ルーム削除
  const wsDeleteRoom = (room: ChatRoomWithOutPassword | null) => {
    console.log('wsDeleteRoom: ', room?.roomName)
    if (!room) return

    // サーバーにルーム削除を要求
    socket?.emit('delete_room', room)
    setCurrentRoom(null)
    setCurrentRoomHistory((prev) => [])
    toast.success('Delete Room Success') // ほんとに消えたかわからないけど
  }

  // ルーム入室
  const wsJoinRoom = (room: ChatRoomWithOutPassword | null) => {
    console.log('wsJoinRoom: ', room)
    if (!room) return
    setCurrentRoom(room)
    // サーバーにルーム入室を要求
    socket?.emit('join_room', room)
  }

  // ルーム退室
  const wsLeaveRoom = (room: ChatRoomWithOutPassword | null) => {
    console.log('wsLeaveRoom: ', room)
    if (!room) return
    // サーバーにルーム退室を要求
    socket?.emit('leave_ws_room', room)
    // メモリ上のメッセージ履歴を削除
    setCurrentRoomHistory((prev) => [])
    setCurrentRoom(null)
  }

  // ルームのロールを削除する
  const wsDeleteRole = (room: ChatRoomWithOutPassword | null) => {
    console.log('wsDeleteRole: ', room)
    if (!room) return
    // サーバーにルーム退室を要求
    socket?.emit('delete_role', room)
  }

  // チャットルームにユーザーを追加する
  const wsInviteUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Invite User: ', user.username)
    console.log('Invite Room: ', room?.roomName)

    if (!room) return
    socket?.emit('invite_user', { userId: user.id, room: room })
  }

  // オーナー権限の譲渡
  const wsTransferOwner = (
    room: ChatRoomWithOutPassword | null,
    user: User
  ) => {
    console.log('Transfer Owner to: ', user.username)
    console.log('Transfer Owner Room: ', room?.roomName)
    if (!room) return
    socket?.emit('transfer_ownership', { userId: user.id, room: room })
  }

  // 管理者の指定
  const wsSetAdmin = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Set Admin to: ', user.username)
    console.log('Set Admin Room: ', room?.roomName)
    if (!room) return
    socket?.emit('set_admin', { userId: user.id, room: room })
  }

  // 管理者の解除
  const wsRemoveAdmin = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Remove Admin to: ', user.username)
    console.log('Remove Admin Room: ', room?.roomName)
    if (!room) return
    socket?.emit('remove_admin', { userId: user.id, room: room })
  }

  // ユーザーのキック
  const wsKickUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Kick User: ', user.username)
    socket?.emit('kick_user', { userId: user.id, room: room })
  }

  // ユーザーのミュート
  const wsMuteUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Mute User: ', user.username)
    socket?.emit('mute_user', { userId: user.id, room: room })
  }
  // ユーザーのミュート解除
  const wsUnMuteUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('UnMute User: ', user.username)
    socket?.emit('unmute_user', { userId: user.id, room: room })
  }

  // ユーザーのBAN
  const wsBanUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('Ban User: ', user.username)
    socket?.emit('ban_user', { userId: user.id, room: room })
  }
  // ユーザーのBAN解除
  const wsUnBanUser = (room: ChatRoomWithOutPassword | null, user: User) => {
    console.log('UnBan User: ', user.username)
    socket?.emit('unban_user', { userId: user.id, room: room })
  }

  // パスワードの設定
  const wsSetPassword = (
    room: ChatRoomWithOutPassword | null,
    password: string
  ) => {
    console.log('Set Password: ', password, ' to ', room?.roomName)
    if (!room) return
    if (
      password !== '' &&
      !password.match(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)[a-zA-Z\d]{6,100}$/)
    ) {
      toast.error(
        'Require 6character lowercase, uppercase, and a number password'
      )
      return
    }

    socket?.emit('set_password', { room: room, password: password })
  }

  // roomListの要求
  const wsGetRoomList = () => {
    socket?.emit('request_room_list')
  }

  // message historyの要求
  const wsGetMessageHistory = (roomId: number) => {
    socket?.emit('request_message_history', roomId)
  }

  return {
    sendMessage,
    setSendMessage,
    WsSendMessage,
    wsCreateRoom,
    wsDeleteRoom,
    wsJoinRoom,
    wsLeaveRoom,
    wsDeleteRole,
    wsInviteUser,
    wsTransferOwner,
    wsSetAdmin,
    wsRemoveAdmin,
    wsKickUser,
    wsMuteUser,
    wsBanUser,
    wsUnMuteUser,
    wsUnBanUser,
    wsSetPassword,
    wsGetRoomList,
    wsGetMessageHistory,
  }
}
