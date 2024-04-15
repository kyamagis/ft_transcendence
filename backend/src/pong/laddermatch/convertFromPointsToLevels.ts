import { MIN_LADDER_POINTS } from '../execPong/constant'
import { LadderLevel } from '../execPong/enums'

// const BRONZE_MAX_POINTS = 9
// const SILVER_MAX_POINTS = 29
// const GOLD_MAX_POINTS = 59
// const PLATINUM_MAX_POINTS = 109
// const DIAMOND_MAX_POINTS = 189

const BRONZE_MAX_POINTS = 39
const SILVER_MAX_POINTS = 59
const GOLD_MAX_POINTS = 89
const PLATINUM_MAX_POINTS = 139
const DIAMOND_MAX_POINTS = 219

const isBronze = (ladderpoints: number) => {
  return MIN_LADDER_POINTS <= ladderpoints && ladderpoints <= BRONZE_MAX_POINTS
}

const isSilver = (ladderpoints: number) => {
  return BRONZE_MAX_POINTS < ladderpoints && ladderpoints <= SILVER_MAX_POINTS
}

const isGold = (ladderpoints: number) => {
  return SILVER_MAX_POINTS < ladderpoints && ladderpoints <= GOLD_MAX_POINTS
}

const isPlatinum = (ladderpoints: number) => {
  return GOLD_MAX_POINTS < ladderpoints && ladderpoints <= PLATINUM_MAX_POINTS
}

const isDiamond = (ladderpoints: number) => {
  return (
    PLATINUM_MAX_POINTS < ladderpoints && ladderpoints <= DIAMOND_MAX_POINTS
  )
}

const convertFromPointsToLevels = (ladderpoints: number) => {
  if (isBronze(ladderpoints)) {
    return LadderLevel.Bronze
  } else if (isSilver(ladderpoints)) {
    return LadderLevel.Silver
  } else if (isGold(ladderpoints)) {
    return LadderLevel.Gold
  } else if (isPlatinum(ladderpoints)) {
    return LadderLevel.Platinum
  } else if (isDiamond(ladderpoints)) {
    return LadderLevel.Diamond
  }
  return LadderLevel.Master
}

export default convertFromPointsToLevels
