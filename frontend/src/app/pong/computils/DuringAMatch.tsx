import { VIEWBOX } from '../constant'
import {
  BallComp,
  CenterLine,
  Court,
  MyPaddle,
  MyScore,
  OpponentPaddle,
  OpponentScore,
} from './PongObjects'
import { Ball, Player } from '../types'

const DuringAMatch: React.FC<{
  ballRef: React.MutableRefObject<Ball>
  myselfRef: React.MutableRefObject<Player>
  opponentRef: React.MutableRefObject<Player>
}> = ({ ballRef, myselfRef, opponentRef }) => {
  return (
    <svg
      className="pongbackground"
      viewBox={VIEWBOX}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Court />
      <CenterLine />
      <BallComp ballX={ballRef.current.x} ballY={ballRef.current.y} />
      <MyPaddle paddlePos={myselfRef.current.paddlePos} />
      <OpponentPaddle paddlePos={opponentRef.current.paddlePos} />
      <MyScore score={myselfRef.current.score} />
      <OpponentScore score={opponentRef.current.score} />
    </svg>
  )
}

export default DuringAMatch
