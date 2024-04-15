import {
  LoginStatus,
  registerStatus,
} from '@/lib/LoginStatus/registerLoginStatus'
import toast from 'react-hot-toast'

const x_registerStatus = (useID: number, status: LoginStatus) => {
  registerStatus(useID, status)
}

export default x_registerStatus
