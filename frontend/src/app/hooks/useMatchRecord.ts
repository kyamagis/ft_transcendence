import { apiClient } from '@/lib/axios/apiClient'
import { useEffect, useState } from 'react'

interface MatchRecord {
  recordid: number
  myid: number
  matchtype: string
  opponentid: number
  myscore: number
  opponentscore: number
  playedat: Date
}

interface UserWithMatchRecords {
  id: number
  username: string
  ladderRank: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER'
  matchrecords: MatchRecord[]
}

export const useMatchRecords = (userId: number) => {
  const [matchRecords, setMatchRecords] = useState<UserWithMatchRecords>()

  useEffect(() => {
    const getMatchRecords = async () => {
      apiClient.get('/user/match/' + userId).then((res) => {
        console.log(res.data)
        setMatchRecords(res.data)
      })
    }

    getMatchRecords()
  }, [userId])

  return { matchRecords }
}
