import '@testing-library/jest-dom/extend-expect'
import { server } from '@/lib/msw/init/server'

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

afterAll(() => server.close())

afterEach(async () => {
  server.resetHandlers()
})
