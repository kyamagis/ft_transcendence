'use client'
import { useAuth, AuthForm } from './auth'

// Authの状態によるコンテンツのだし分け
const ContentView: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authStatus } = useAuth()
  if (authStatus === 'AUTHORIZED') {
    return <>{children}</>
  } else {
    return <AuthForm />
  }
}

export default ContentView
