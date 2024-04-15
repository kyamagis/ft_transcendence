// seed.ts
import { PrismaClient, UserRole, RoomType } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const linus = await prisma.user.create({
    data: {
      username: 'LinusTorvalds',
    },
  })

  const ada = await prisma.user.create({
    data: {
      username: 'AdaLovelace',
    },
  })

  const rms = await prisma.user.create({
    data: {
      username: 'RichardStallman',
    },
  })
  const fuji = await prisma.user.create({
    data: {
      username: 'tfujiwara',
    },
  })
  const yama = await prisma.user.create({
    data: {
      username: 'kyamagis',
    },
  })
  const nf = await prisma.user.create({
    data: {
      username: 'nfukuma',
    },
  })

  const chatRoom = await prisma.chatRoom.create({
    data: {
      roomName: 'test-room',
      roomType: 'PUBLIC',
    },
  })

  // パブリックルーム
  const publicRoom = await prisma.chatRoom.create({
    data: {
      roomName: 'public-room',
      roomType: 'PUBLIC',
    },
  })

  // プライベートルーム
  const privateRoom = await prisma.chatRoom.create({
    data: {
      roomName: 'private-room',
      roomType: 'PRIVATE',
    },
  })

  // パスワード付き公開ルーム
  const roomPassword = await bcrypt.hash('mysecretpassword', 10)
  const passwordRoom = await prisma.chatRoom.create({
    data: {
      roomName: 'password-protected-room',
      roomType: 'PASSWORD_PROTECTED',
      roomPassword: roomPassword, // パスワードを設定
    },
  })

  await prisma.message.create({
    data: {
      content: 'Linux is the best! Yeeeeaaaaahhhhh!',
      userId: linus.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2021-01-01T00:00:00.000Z'),
    },
  })

  await prisma.message.create({
    data: {
      content: 'Did you know the first algorithm was written by a woman? Ha ha',
      userId: ada.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2021-01-02T00:00:00.000Z'),
    },
  })

  await prisma.message.create({
    data: {
      content: 'Free software is a matter of liberty, not price.',
      userId: rms.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2021-01-03T00:00:00.000Z'),
    },
  })
  await prisma.message.create({
    data: {
      content: 'テストメッセージ1',
      userId: nf.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2021-01-04T00:00:00.000Z'),
    },
  })
  await prisma.message.create({
    data: {
      content: 'Yeeeeaaaaahhhhh!',
      userId: fuji.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2024-01-05T00:00:00.000Z'),
    },
  })
  await prisma.message.create({
    data: {
      content: 'Super Dosukoi!!!!',
      userId: yama.id,
      chatRoomId: chatRoom.id,
      timestamp: new Date('2020-01-06T00:00:00.000Z'),
    },
  })

  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: linus.id,
      userRole: UserRole.ADMIN,
    },
  })

  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: ada.id,
      userRole: UserRole.OWNER,
    },
  })

  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: rms.id,
      userRole: UserRole.USER,
    },
  })

  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: nf.id,
      userRole: UserRole.USER,
    },
  })
  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: fuji.id,
      userRole: UserRole.USER,
    },
  })
  await prisma.userRoleInChat.create({
    data: {
      chatRoomId: chatRoom.id,
      userId: yama.id,
      userRole: UserRole.USER,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
