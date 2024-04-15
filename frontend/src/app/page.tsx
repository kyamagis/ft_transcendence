'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const LandingPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.push('/pong')
  }, [router])

  return null
}

export default LandingPage
