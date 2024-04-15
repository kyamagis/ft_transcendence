import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Injectable, UseGuards } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
// import { Logger, UseGuards } from '@nestjs/common'
import ChatRepository, {
  ChatRoomWithOutPassword,
} from '@/repository/chat.repository'
import {
  Prisma,
  RoomType,
  User,
  Session,
  ChatRoom,
  UserRole,
  UserRoleInChat,
} from '@prisma/client'
import {
  CreateMessageInput,
  MessageWithUser,
} from '@/repository/chat.repository'
import { Logger } from '@nestjs/common'
import { ChatSessionGuard } from '@/chat/chat.guard'
import * as bcrypt from 'bcryptjs'

@Injectable()
@WebSocketGateway({ namespace: '/chat', cors: 'http://localhost:5000' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  private clients: { [id: number]: Socket } = {}
  constructor(private readonly chatRepo: ChatRepository) {}
  private logger: Logger = new Logger('ChatGateway')

  /************* 接続要求を受けた ****************/
  async handleConnection(client: Socket): Promise<void> {
    const userId = client.handshake.query.userId
    if (typeof userId !== 'string') {
      this.logger.debug('query.userId is not string')
      client.emit('session_error')
      client.disconnect()
      return
    }
    const userIdNum = parseInt(userId)
    const session: Session = await this.chatRepo.getSessionByUserId(userIdNum)

    let errorMessages = null
    if (!session) errorMessages = 'session not found for userID: ' + userId
    else if (!session?.expire)
      errorMessages = 'session expired for userID: ' + userId
    else if (session.expire < new Date())
      errorMessages = 'session expired for userID: ' + userId

    if (errorMessages) {
      this.logger.debug(errorMessages)
      client.emit('session_error')
      client.disconnect()
    }

    this.clients[userIdNum] = client

    try {
      const roomList: ChatRoomWithOutPassword[] =
        await this.chatRepo.getMyEnterRoomListByUserId(userIdNum)
      this.logger.debug('roomList: ', roomList)

      const updatedRoomList: ChatRoomWithOutPassword[] = []
      for (const room of roomList) {
        if (room.roomType !== RoomType.DM) {
          updatedRoomList.push(room)
          continue
        }

        const dmRoomNameList = room.roomName.split('&')
        if (dmRoomNameList.length !== 2) {
          this.logger.debug('dmRoomNameList.length !== 2')
          updatedRoomList.push(room)
          continue
        }

        const [userId1, userId2] = dmRoomNameList.map((id) => parseInt(id))
        // NaNだったら
        if (isNaN(userId1)) {
          this.logger.debug('userId1 is NaN')
          updatedRoomList.push(room)
          continue
        }
        if (isNaN(userId2)) {
          this.logger.debug('userId2 is NaN')
          updatedRoomList.push(room)
          continue
        }

        const targetUserId = userId1 === userIdNum ? userId2 : userId1
        try {
          const user: User = await this.chatRepo.getUserById(targetUserId)
          room.roomName = user.username
        } catch (error) {
          this.logger.debug('Failed to get user info', error)
        }
        updatedRoomList.push(room)
      }

      client.emit('room_list', updatedRoomList)
    } catch (err) {
      this.logger.debug(err)
    }
  }

  /* ルーム一覧の要求 */
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('request_room_list')
  async handleRequestRoomList(client: Socket): Promise<void> {
    const userIdNum = parseInt(client.handshake.query.userId as string)
    try {
      const roomList: ChatRoomWithOutPassword[] =
        await this.chatRepo.getMyEnterRoomListByUserId(userIdNum)
      this.logger.debug('roomList: ', roomList)

      const updatedRoomList: ChatRoomWithOutPassword[] = []
      for (const room of roomList) {
        if (room.roomType !== RoomType.DM) {
          updatedRoomList.push(room)
          continue
        }

        const dmRoomNameList = room.roomName.split('&')
        if (dmRoomNameList.length !== 2) {
          this.logger.debug('dmRoomNameList.length !== 2')
          updatedRoomList.push(room)
          continue
        }

        const [userId1, userId2] = dmRoomNameList.map((id) => parseInt(id))
        // NaNだったら
        if (isNaN(userId1)) {
          this.logger.debug('userId1 is NaN')
          updatedRoomList.push(room)
          continue
        }
        if (isNaN(userId2)) {
          this.logger.debug('userId2 is NaN')
          updatedRoomList.push(room)
          continue
        }

        const targetUserId = userId1 === userIdNum ? userId2 : userId1
        try {
          const user: User = await this.chatRepo.getUserById(targetUserId)
          room.roomName = user.username
        } catch (error) {
          this.logger.debug('Failed to get user info', error)
        }
        updatedRoomList.push(room)
      }

      client.emit('room_list', updatedRoomList)
    } catch (err) {
      this.logger.debug(err)
      client.emit('error', 'Failed to get room list')
    }
  }

  /************* 切断された ****************/
  handleDisconnect(client: Socket): void {
    const userId = client.handshake.query.userId as string
    const userIdNum = parseInt(userId)
    delete this.clients[userIdNum]
  }

  /* 接続エラー */
  handleError(client: Socket): void {
    const userId = client.handshake.query.userId as string
    this.logger.debug('error: ' + userId)
    delete this.clients[userId]
  }

  /************* ルーム作成 ****************/
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('create_room')
  handleCreateRoom(client: Socket, roomData: Prisma.ChatRoomCreateInput): void {
    this.logger.debug('create_room: ', roomData)
    const userId = parseInt(client.handshake.query.userId as string)

    const salt = bcrypt.genSaltSync(10)
    if (roomData.roomType === RoomType.PASSWORD_PROTECTED) {
      const hashedPassword = bcrypt.hashSync(roomData.roomPassword, salt)
      roomData.roomPassword = hashedPassword
    }

    this.chatRepo.wsCreateRoom(roomData, userId).then((room) => {
      this.logger.debug('作ったルーム' + room)
      // DM用のルームだったら、
      if (room.roomType === RoomType.DM) {
        const dmRoomNameList = room.roomName.split('&')
        const [userId1, userId2] = dmRoomNameList.map((id) => parseInt(id))
        // それぞれの相手方の名前にルーム名を変更して配信
        this.chatRepo.getUserById(userId1).then((user1: User) => {
          if (this.clients[userId2] === undefined) {
            this.logger.debug(
              'this.clients[userId2] === undefined なので配信不要'
            )
          } else {
            room.roomName = user1.username
            this.clients[userId2].emit('room_created', room)
          }
        })

        this.chatRepo.getUserById(userId2).then((user2: User) => {
          if (this.clients[userId1] === undefined) {
            this.logger.debug(
              'this.clients[userId1] === undefined なので配信不要'
            )
            return
          } else {
            room.roomName = user2.username
            this.clients[userId1].emit('room_created', room)
          }
        })
        return
      }
      // プライベートチャンネルだったら
      if (room.roomType === RoomType.PRIVATE) {
        // 作成者にだけ返せばいい
        client.emit('room_created', room)
        return
      } else {
        // それ以外のルームだったら
        // 全員に配信すればいい
        this.server.emit('room_created', room)
        return
      }
    })
  }

  /************* ルーム削除 ****************/
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('delete_room')
  handleDeleteRoom(client: Socket, room: ChatRoomWithOutPassword | null): void {
    this.logger.debug('delete_room: ' + room.roomName)
    this.chatRepo.deleteRoom(room)
    this.server.emit('room_deleted', room)
  }

  /************* パスワード付きルームのパスワードを送信 ****************/
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('send_room_password')
  handleSendRoomPassword(
    client: Socket,
    {
      currentRoom,
      roomPassword,
    }: {
      currentRoom: ChatRoomWithOutPassword
      roomPassword: string
    }
  ): void {
    this.logger.debug('send_room_password: ' + currentRoom.roomName)
    this.logger.debug('password: ' + roomPassword)
    if (currentRoom === null || roomPassword === null) {
      this.logger.debug('currentRoom or roomPassword is null')
      return
    }
    // パスワードが正しいかどうかを確認
    this.chatRepo.getRoomById(currentRoom.id).then((room: ChatRoom) => {
      this.logger.debug('room: ' + room.roomName)
      this.logger.debug('roomPassword: ' + room.roomPassword)
      if (bcrypt.compareSync(roomPassword, room.roomPassword)) {
        // パスワードが正しい場合は、ロールを付与し、クライアントにjoin_roomイベントを送信するように要求
        const userId = parseInt(client.handshake.query.userId as string)
        this.chatRepo.joinDbRoom(userId, currentRoom.id)
        client.emit('join_room_success', currentRoom)
      } else {
        // パスワードが正しくない場合は、クライアントにパスワードが正しくないことを通知
        client.emit('join_room_error', 'Password is incorrect')
      }
    })
  }

  // DB上でルームに参加していることを確認した後に呼び出されるヘルパー
  private joinedMessageToDbAndClient(
    userId: number,
    room: ChatRoomWithOutPassword
  ): void {
    // セッションIDからセッション情報を取得し、ユーザーIDを得てユーザー情報を取得
    this.chatRepo.getUserById(userId).then((user: User) => {
      // DBに保存するために、ユーザー情報を付与
      const joinedMessage: CreateMessageInput = {
        content: user.username + ' is joined',
        timestamp: new Date(),
        userId: user.id,
        chatRoomId: room.id,
      }
      // メッセージをDBに追加
      this.chatRepo.createMessage(joinedMessage).then((message) => {
        const messageWithUser: MessageWithUser = {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          user: user,
          chatRoomId: message.chatRoomId,
        }
        // メッセージをクライアントに送信
        this.server
          .to(message.chatRoomId.toString())
          .emit('receive_message', messageWithUser)
      })
    })
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('join_room') // client -> server
  async handleJoinRoom(
    client: Socket,
    room: ChatRoomWithOutPassword
  ): Promise<void> {
    this.logger.debug('join_room: ' + room.roomName)
    const userId = parseInt(client.handshake.query.userId as string)
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (isBanned) {
      client.emit('join_room_error', 'You are banned from this room')
      return
    }
    const isJoined = await this.chatRepo.isJoined(userId, room)

    if (!isJoined && room.roomType === RoomType.PASSWORD_PROTECTED) {
      this.logger.debug('password protected room: ' + room.roomName)
      client.emit('require_password', room)
      return
    }
    if (!isJoined) {
      await this.chatRepo.joinDbRoom(userId, room.id)
      this.joinedMessageToDbAndClient(userId, room)
    }
    client.join(room.id.toString())
    this.chatRepo
      .getRoomMessageHistory(room)
      .then((messageHistory: MessageWithUser[]) => {
        // メッセージヒストリーをクライアントに送信
        client.emit('message_history', messageHistory)
      })
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('leave_ws_room') // client -> server
  handleLeaveRoom(client: Socket, room: ChatRoomWithOutPassword): void {
    this.logger.debug('leave_room: ' + room.roomName)
    client.leave(room.id.toString()) // クライアントをルームから退出させる
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('delete_role') // client -> server
  handleLeaveDbRoom(client: Socket, room: ChatRoomWithOutPassword): void {
    this.logger.debug('delete_role: ' + room.roomName)
    // クライアントを特定するために、セッションIDを取得

    const userId = parseInt(client.handshake.query.userId as string)
    this.chatRepo.leaveDbRoom(userId, room.id)

    // メッセージをDBに追加
    this.chatRepo.getUserById(userId).then((user: User) => {
      const leftMessage: CreateMessageInput = {
        content: user.username + ' is leaved',
        timestamp: new Date(),
        userId: user.id,
        chatRoomId: room.id,
      }
      this.chatRepo.createMessage(leftMessage).then((message) => {
        const messageWithUser: MessageWithUser = {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          user: user,
          chatRoomId: message.chatRoomId,
        }
        // メッセージをクライアントに送信
        this.server
          .to(message.chatRoomId.toString())
          .emit('receive_message', messageWithUser)
      })
    })
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('send_message') // client -> server
  handleMessage(client: Socket, message: CreateMessageInput): void {
    // Prismaを使ってDBに追加
    this.chatRepo.createMessage(message).then((message) => {
      this.logger.debug('send_message: ' + message.content)
      // User情報を付与
      this.chatRepo.getUserById(message.userId).then((user: User) => {
        const messageWithUser: MessageWithUser = {
          id: message.id,
          content: message.content,
          timestamp: message.timestamp,
          user: user,
          chatRoomId: message.chatRoomId,
        }
        this.server
          .to(message.chatRoomId.toString())
          .emit('receive_message', messageWithUser)
      })
    })
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('invite_user') // client -> server
  async handleInviteUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // そのユーザーが実在するか
    this.logger.debug('invite_user: ' + userId)
    this.logger.debug('invite_room: ', room)
    const user: User = await this.chatRepo.getUserById(userId)
    if (!user) {
      this.logger.debug('user not found')
      client.emit('error', 'user not found')
      return
    }
    // ルームにロールがあるか
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length !== 0) {
      this.logger.debug('user already joined')
      client.emit('error', 'user already joined')
      return
    }

    // キックバンされていないか
    const isMuted = await this.chatRepo.isMuted(userId, room)
    if (isMuted) {
      this.logger.debug('user is kicked')
      client.emit('error', 'user is kicked')
      return
    }
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (isBanned) {
      this.logger.debug('user is banned')
      client.emit('error', 'user is banned')
      return
    }

    // clientのuserIdを使って、ユーザー情報を取得
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)

    // ルームに参加
    this.chatRepo.joinDbRoom(userId, room.id)
    // メッセージをDBに追加
    const invitedMessage: CreateMessageInput = {
      content: user.username + ' is invited by ' + clientUser.username,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }

    // 相手がprivate clients: { [id: number]: Socket } = {}に入っていたら、相手にルームcreatedを送信
    if (this.clients[userId] !== undefined) {
      this.clients[userId].emit('room_created', room)
    }

    this.chatRepo.createMessage(invitedMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('transfer_ownership') // client -> server
  async handleTransferOwnership(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    this.logger.debug('transfer_ownership: ' + userId)
    this.logger.debug('transfer_room: ' + room)
    // そのユーザーがそのルームに参加しているか。また、バンやミュートされていないか
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    const isMuted = await this.chatRepo.isMuted(userId, room)
    if (isMuted) {
      this.logger.debug('user is muted')
      client.emit('error', 'user is muted')
      return
    }
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (isBanned) {
      this.logger.debug('user is banned')
      client.emit('error', 'user is banned')
      return
    }
    // 譲渡元のユーザーのロールを一旦削除
    const clientUserId = parseInt(client.handshake.query.userId as string)
    this.logger.debug('clientUserId: ' + clientUserId)
    await this.chatRepo.leaveDbRoom(clientUserId, room.id)
    // 譲渡元のユーザーのロールを追加
    await this.chatRepo.joinDbRoom(clientUserId, room.id)

    // 譲渡先のユーザーにオーナー権限を付与
    await this.chatRepo.addUserRole(userId, room.id, 'OWNER')

    // メッセージをDBに追加
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const transferMessage: CreateMessageInput = {
      content:
        clientUser.username +
        ' transfer ownership to ' +
        user.username +
        ' in ' +
        room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(transferMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    // ChatRoomWithOutPasswordの最新の情報を取得
    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('set_admin') // client -> server
  async handleSetAdmin(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // そのユーザーがそのルームに参加しているか。また、バンやミュートされていないか
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    const isMuted = await this.chatRepo.isMuted(userId, room)
    if (isMuted) {
      this.logger.debug('user is muted')
      client.emit('error', 'user is muted')
      return
    }
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (isBanned) {
      this.logger.debug('user is banned')
      client.emit('error', 'user is banned')
      return
    }

    if (userRoleInChat.some((userRole) => userRole.userRole === 'ADMIN')) {
      this.logger.debug('user is already admin')
      client.emit('error', 'user is already admin')
      return
    }

    // ユーザーのロールをADMINに変更
    await this.chatRepo.addUserRole(userId, room.id, 'ADMIN')

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const setAdminMessage: CreateMessageInput = {
      content:
        clientUser.username +
        ' set admin to ' +
        user.username +
        ' in ' +
        room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(setAdminMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })
    // ChatRoomWithOutPasswordの最新の情報を取得
    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('remove_admin') // client -> server
  async handleRemoveAdmin(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // そのユーザーが管理者かどうか
    const userRoleInChat: UserRoleInChat[] =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    if (!userRoleInChat.some((userRole) => userRole.userRole === 'ADMIN')) {
      this.logger.debug('user is not admin')
      client.emit('error', 'user is not admin')
      return
    }

    // ユーザーのロールをADMINを削除
    await this.chatRepo.removeUserRole(userId, room.id, 'ADMIN')

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const removeAdminMessage: CreateMessageInput = {
      content:
        clientUser.username +
        ' remove admin from ' +
        user.username +
        ' in ' +
        room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(removeAdminMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })
    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  // キック
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('kick_user') // client -> server
  async handleKickUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // オーナー以外はキック可能
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    for (const userRole of userRoleInChat) {
      this.logger.debug('userRole: ' + userRole.userRole)
    }
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    if (
      userRoleInChat.some((userRole) => userRole.userRole === UserRole.OWNER)
    ) {
      this.logger.debug('user is owner')
      client.emit('error', 'user is owner')
      return
    }

    // 相手ユーザーのロールをすべて削除
    await this.chatRepo.leaveDbRoom(userId, room.id)

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const kickMessage: CreateMessageInput = {
      content:
        clientUser.username + ' kick ' + user.username + ' in ' + room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(kickMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
    if (
      room.roomType === RoomType.PRIVATE &&
      this.clients[userId] !== undefined
    ) {
      this.clients[userId].emit('room_deleted', room)
    }
  }

  // バン
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('ban_user') // client -> server
  async handleBanUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // オーナー以外はバン可能
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    if (userRoleInChat.some((userRole) => userRole.userRole === 'OWNER')) {
      this.logger.debug('user is owner')
      client.emit('error', 'user is owner')
      return
    }

    // バンテーブルに存在しないか確認
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (isBanned) {
      this.logger.debug('user is already banned')
      client.emit('error', 'user is already banned')
      return
    }

    // 相手ユーザーのロールをすべて削除
    await this.chatRepo.leaveDbRoom(userId, room.id)
    // 相手ユーザーをバンリストに追加
    await this.chatRepo.addBannedUser(userId, room.id)

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const banMessage: CreateMessageInput = {
      content:
        clientUser.username + ' ban ' + user.username + ' in ' + room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(banMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
    if (
      room.roomType === RoomType.PRIVATE &&
      this.clients[userId] !== undefined
    ) {
      this.clients[userId].emit('room_deleted', room)
    }
  }

  // バン解除
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('unban_user') // client -> server
  async handleUnbanUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    const isBanned = await this.chatRepo.isBanned(userId, room)
    if (!isBanned) {
      this.logger.debug('user is not banned')
      client.emit('error', 'user is not banned')
      return
    }

    await this.chatRepo.removeBannedUser(userId, room.id)

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const unbanMessage: CreateMessageInput = {
      content:
        clientUser.username +
        ' unban ' +
        user.username +
        ' in ' +
        room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }

    await this.chatRepo.createMessage(unbanMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  // ミュート
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('mute_user') // client -> server
  async handleMuteUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    // オーナー以外はミュート可能
    const userRoleInChat =
      await this.chatRepo.getUserRolesInChatByUserIdAndChatRoomIdFindMany(
        userId,
        room.id
      )
    if (userRoleInChat.length === 0) {
      this.logger.debug('user not joined')
      client.emit('error', 'user not joined')
      return
    }
    if (userRoleInChat.some((userRole) => userRole.userRole === 'OWNER')) {
      this.logger.debug('user is owner')
      client.emit('error', 'user is owner')
      return
    }

    // ミュートテーブルに存在しないか確認
    const isMuted = await this.chatRepo.isMuted(userId, room)
    if (isMuted) {
      this.logger.debug('user is already muted')
      client.emit('error', 'user is already muted')
      return
    }

    // 相手ユーザーをミュートリストに追加
    await this.chatRepo.addMutedUser(userId, room.id)

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const muteMessage: CreateMessageInput = {
      content:
        clientUser.username + ' mute ' + user.username + ' in ' + room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }
    await this.chatRepo.createMessage(muteMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  // ミュート解除
  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('unmute_user') // client -> server
  async handleUnmuteUser(
    client: Socket,
    { userId, room }: { userId: number; room: ChatRoomWithOutPassword }
  ): Promise<void> {
    const isMuted = await this.chatRepo.isMuted(userId, room)
    if (!isMuted) {
      this.logger.debug('user is not muted')
      client.emit('error', 'user is not muted')
      return
    }

    await this.chatRepo.removeMutedUser(userId, room.id)

    // メッセージをDBに追加
    const clientUserId = parseInt(client.handshake.query.userId as string)
    const clientUser: User = await this.chatRepo.getUserById(clientUserId)
    const user: User = await this.chatRepo.getUserById(userId)
    const unmuteMessage: CreateMessageInput = {
      content:
        clientUser.username +
        ' unmute ' +
        user.username +
        ' in ' +
        room.roomName,
      timestamp: new Date(),
      userId: clientUser.id,
      chatRoomId: room.id,
    }

    await this.chatRepo.createMessage(unmuteMessage).then((message) => {
      const messageWithUser: MessageWithUser = {
        id: message.id,
        content: message.content,
        timestamp: message.timestamp,
        user: clientUser,
        chatRoomId: message.chatRoomId,
      }
      // メッセージをクライアントに送信
      this.server
        .to(message.chatRoomId.toString())
        .emit('receive_message', messageWithUser)
    })

    this.server.emit(
      'room_modified',
      await this.chatRepo.getRoomWithOutPasswordById(room.id)
    )
  }

  @UseGuards(ChatSessionGuard)
  @SubscribeMessage('set_password') // client -> server
  async setPassowrd(
    client: Socket,
    { room, password }: { room: ChatRoomWithOutPassword; password: string }
  ): Promise<void> {
    this.logger.debug('set_password: ' + room.roomName)
    this.logger.debug('password: ' + password)
    if (password === '') {
      await this.chatRepo.setRoomPassword(room, password)
      const newRoom = await this.chatRepo.getRoomWithOutPasswordById(room.id)
      this.logger.debug('newRoom: ', newRoom)
      this.server.emit('room_modified', newRoom)
      return
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    await this.chatRepo.setRoomPassword(room, hashedPassword)
    const newRoom = await this.chatRepo.getRoomWithOutPasswordById(room.id)
    this.logger.debug('newRoom: ', newRoom)
    this.server.emit('room_modified', newRoom)
  }
}
