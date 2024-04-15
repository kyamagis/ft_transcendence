export enum RoomType {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  PASSWORD_PROTECTED = 'PASSWORD_PROTECTED',
  DM = 'DM',
}

export type ChatRoomWithOutPassword = {
  id: number
  roomName: string
  roomType: string
  userRoles: {
    userId: number
    userRole: string
  }[]
  userMuted: {
    userId: number
  }[]
  userBanned: {
    userId: number
  }[]
}

export type CreateChatRoominput = {
  roomName: string
  roomPassword?: string
  roomType: RoomType
}

export type MessageWithUser = {
  id: number
  content: string
  timestamp: Date
  user: User
  chatRoomId: number
  gameParametersJson: string | undefined
}

export type CreateMessageInput = {
  content: string
  timestamp: Date
  userId: number
  chatRoomId: number
}

export type User = {
  id: number
  username: string
  avatar?: Buffer
}

export enum UserRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum RelationType {
  FRIEND = 'FRIEND',
  BLOCKING = 'BLOCKING',
}
