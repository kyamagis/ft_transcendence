import { GameParameter, GameParameterRefArray } from '../types'

const gameParameterRefToNumber = (
  gameParameterRefArray: GameParameterRefArray
) => {
  const tmp: GameParameter[] = []

  for (let i: number = 0; i < gameParameterRefArray.length; i++) {
    tmp.push({
      text: gameParameterRefArray[i].text,
      maxLevel: gameParameterRefArray[i].maxLevel,
      gameParameter: gameParameterRefArray[i].gameParameterRef.current,
    })
  }

  return tmp
}

export default gameParameterRefToNumber
