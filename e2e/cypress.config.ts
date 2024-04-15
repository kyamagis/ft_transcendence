const { defineConfig } = require('cypress')
const fs = require('fs')
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

module.exports = defineConfig({
  defaultCommandTimeout: 10000,
  chromeWebSecurity: false,
  e2e: {
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on, config) {
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        async createTestUserAndSession() {
          const user = await prisma.user.create({
            data: {
              username: 'testUser',
            },
          })
          const session = await prisma.session.create({
            data: {
              sid: 'testSessionId',
              sess: {},
              expire: new Date(Date.now() + 24 * 60 * 60 * 1000),
              userId: user.id,
            },
          })
          return {
            user: user,
            session: session,
          }
        },
        async deleteTestUser() {
          await prisma.session.deleteMany({
            where: {
              userId: {
                equals: (
                  await prisma.user.findUnique({
                    where: { username: 'testUser' },
                    select: { id: true },
                  })
                ).id,
              },
            },
          })
          await prisma.user.delete({ where: { username: 'testUser' } })
          return null
        },
      })
    },
  },
})
