import { Injectable } from '@nestjs/common'
import { Logger } from '@nestjs/common'

export type Status = 'CHAT' | 'PONG' | 'OFFLINE' | 'IDLE'

interface UserStatus {
  userID: number
  status: Status
}

@Injectable()
export class UserStatusService {
  private userStatusList: UserStatus[] = []
  private log = new Logger('UserStatusService')

  setStatus(userID: number, status: Status): void {
    if (status === 'OFFLINE') {
      this.deleteStatus(userID)
      return
    }
    const userStatus = this.userStatusList.find(
      (userStatus) => userStatus.userID === userID
    )
    if (userStatus) {
      userStatus.status = status
    } else {
      this.userStatusList.push({ userID, status })
    }
    this.log.debug(`userStatusList: ${JSON.stringify(this.userStatusList)}`)
  }

  fetchFriendStatus(userID: number): Status {
    const userStatus = this.userStatusList.find(
      (userStatus) => userStatus.userID === userID
    )
    if (userStatus) {
      return userStatus.status
    } else {
      return 'OFFLINE'
    }
  }

  deleteStatus(userID: number): void {
    this.userStatusList = this.userStatusList.filter(
      (userStatus) => userStatus.userID !== userID
    )
    this.log.debug(`userStatusList: ${JSON.stringify(this.userStatusList)}`)
  }
}
