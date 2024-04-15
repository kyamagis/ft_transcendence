import { apiClient } from '@/lib/axios/apiClient'
import { useState } from 'react'
import { User } from '../../types/types'
import toast from 'react-hot-toast'

type UserIdAndUsername = {
  id: number
  username: string
}

interface propsType {
  onClickHandler: (targetUser: User) => void
  onClose: () => void
  guideMessage?: string
}

export function UserSearchModal({
  onClickHandler,
  onClose,
  guideMessage,
}: propsType) {
  const [query, setQuery] = useState('')
  const [searchResult, setSearchResult] = useState<UserIdAndUsername[]>([])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    try {
      const res = await apiClient.get(`/user-search?query=${value}`)
      console.log('query: ', value)
      console.log('res: ', res)
      console.log('res.data: ', res.data)
      setSearchResult(res.data)
    } catch (error: any) {
      if (error.response && error.response.data) {
        // レスポンスボディにエラーメッセージを設定してくれている場合
        console.log(
          'エラーレスポンスにボディ有り:',
          error.response.data.message
        )
        toast.error(error.response.data.message)
      } else {
        console.log('エラーレスポンスにボディ無し', error.message)
        toast.error(error.message)
      }
    }
  }

  const handleUserClick = (user: User) => {
    onClickHandler(user)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div className="mb-4 text-center text-white">
        {guideMessage
          ? guideMessage.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))
          : 'Search for users'}
      </div>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for users..."
        className="w-1/2 md:w-1/3 p-2 mb-2 text-center text-sm border border-gray-300 rounded"
        onClick={(e) => e.stopPropagation()}
      />
      {searchResult.length > 0 && (
        <ul className="w-1/2 md:w-1/3 bg-white rounded shadow-lg">
          {searchResult.map((user) => (
            <li
              key={user.id}
              onClick={() => handleUserClick(user)}
              className="p-2 cursor-pointer border-b border-gray-200 hover:bg-gray-100"
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
