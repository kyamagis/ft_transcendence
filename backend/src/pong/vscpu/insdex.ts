import { Socket } from 'socket.io'
import servBall from '../execPong/utils/servBall'

import calcBallBehavior from '../execPong/utils/calcBallBehavior'
import calcPaddlePos from '../execPong/utils/calcPaddlePos'
import calcCpu from './calcCpu'
import { allotGameParameter } from '../execPong/utils/allotGameParameter'
import {
  Ball,
  GameParameters,
  GameParameter,
  PaddleMovement,
  Player,
  initPaddleMovement,
  initPlayer,
} from '../execPong/types'
import { FRAME } from '../execPong/constant'

const vsCpu = (
  socketMap: Map<
    Socket,
    { intervalID: NodeJS.Timer | undefined; paddleMovement: PaddleMovement }
  >,
  client: Socket,
  gameParameterArray: GameParameter[]
) => {
  const gameParameters: GameParameters = allotGameParameter(gameParameterArray)
  const ball: Ball = servBall(gameParameters)
  const myself: Player = initPlayer()
  const opponent: Player = initPlayer()
  const gameover = { flg: false }
  const paddleMovement = initPaddleMovement()
  const intervalID: NodeJS.Timer | undefined = undefined

  socketMap.set(client, { intervalID, paddleMovement })
  socketMap.get(client).intervalID = setInterval(() => {
    calcBallBehavior(gameParameters, ball, myself, opponent, gameover)
    if (gameover.flg) {
      clearInterval(intervalID)
      socketMap.delete(client)
      client.emit('gameover')
    }
    calcCpu(ball, opponent)
    if (socketMap.has(client)) {
      calcPaddlePos(
        gameParameters,
        myself,
        socketMap.get(client).paddleMovement
      )
    }
    client.emit('game_pos_and_point', ball, myself, opponent)
  }, FRAME)
}

export default vsCpu
