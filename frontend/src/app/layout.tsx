import dynamic from 'next/dynamic'

import './globals.css'
import Favicon from '@/app/favicon2.svg'
import { API_MOCKING } from '@/config/constants'
import { MSWWrapperProps } from '@/lib/msw/MSWWrapper'
import { AuthProvider } from './auth'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/navigation/navigation'
import ContentView from './view'

const MSWWrapper = dynamic<MSWWrapperProps>(() =>
  import('@/lib/msw/MSWWrapper').then(({ MSWWrapper }) => MSWWrapper)
)

export const metadata = {
  title: 'Pong',
  description: 'Generated by 42student',
  icons: [{ rel: 'icon', url: Favicon.src }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return API_MOCKING ? (
    <MSWWrapper>
      <AuthProvider>
        <Main>{children}</Main>
      </AuthProvider>
    </MSWWrapper>
  ) : (
    <AuthProvider>
      <Main>{children}</Main>
    </AuthProvider>
  )
}

// App全体のview
export const Main: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg_image bg-top bg-cover">
        <div className="flex flex-col h-screen w-screen">
          <main className="h-[calc(100vh-64px)]">
            <Toaster />
            <Navigation />
            <ContentView>{children}</ContentView>
          </main>
        </div>
      </body>
    </html>
  )
}
