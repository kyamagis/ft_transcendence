'use client'

import { ReactNode } from 'react'
import { GameParameterRefArray } from '../types'

interface ModalProps {
  trigger: ReactNode
  modalContent?: string
  gameParameterRefArray: GameParameterRefArray
}

export default ModalProps
