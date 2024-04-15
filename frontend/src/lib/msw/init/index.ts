import { IS_SERVER, IS_BROWSER } from '@/config/constants'

const initializeMocks = async () => {
  if (IS_SERVER) {
    const { server } = await import('./server')
    server.listen()
  } else if (IS_BROWSER) {
    const { worker } = await import('./browser')
    worker.start()
  }
}

;(async () => {
  await initializeMocks()
})()
