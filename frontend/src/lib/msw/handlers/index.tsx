import { rest } from 'msw'

import { API_URL } from '@/config/constants'

export const handlers = [
  rest.get(`${API_URL}/health`, (req, res, ctx) => {
    return res(ctx.delay(200), ctx.status(200), ctx.text('OK'))
  }),
]
