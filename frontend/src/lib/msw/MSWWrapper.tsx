import { ReactNode } from 'react'

export type MSWWrapperProps = {
  children: ReactNode
}

require('./init')
export const MSWWrapper = ({ children }: MSWWrapperProps) => {
  return <>{children}</>
}
