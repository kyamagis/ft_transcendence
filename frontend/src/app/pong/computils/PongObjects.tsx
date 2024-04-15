import React from 'react'

import {
  BG_WIDTH,
  BALL_DIAMETER,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  RIGHT_PADDLE_X_POS,
  BG_HEIGHT,
} from '../constant'

export const Court = React.memo(() => {
  return (
    <rect
      className="bg-black"
      width={BG_WIDTH}
      height={BG_HEIGHT}
      x={0}
      y={0}
    />
  )
})

Court.displayName = 'Court'

export const CenterLine = React.memo(() => {
  return (
    <line
      className="pongcenterline"
      x1={BG_WIDTH / 2}
      y1={0}
      x2={BG_WIDTH / 2}
      y2={BG_HEIGHT}
    />
  )
})

CenterLine.displayName = 'CenterLine'

export const BallComp = (props: { ballX: number; ballY: number }) => {
  return (
    <rect
      className="pongball"
      width={BALL_DIAMETER}
      height={BALL_DIAMETER}
      x={props.ballX}
      y={props.ballY}
    />
  )
}

export const MyPaddle = React.memo((props: { paddlePos: number }) => {
  return (
    <rect
      className="pongball"
      width={PADDLE_WIDTH}
      height={PADDLE_HEIGHT}
      x={0}
      y={props.paddlePos}
    />
  )
})

MyPaddle.displayName = 'MyPaddle'

export const OpponentPaddle = React.memo((props: { paddlePos: number }) => {
  return (
    <rect
      className="pongball"
      width={PADDLE_WIDTH}
      height={PADDLE_HEIGHT}
      x={RIGHT_PADDLE_X_POS}
      y={props.paddlePos}
    />
  )
})

OpponentPaddle.displayName = 'OpponentPaddle'

export const MyScore = React.memo((props: { score: number }) => {
  return (
    <text className="pongscore" id="text" x={BG_WIDTH / 2 - 70 - 24} y={70}>
      {props.score}
    </text>
  )
})

MyScore.displayName = 'MyScore'

export const OpponentScore = React.memo((props: { score: number }) => {
  return (
    <text className="pongscore" id="text" x={BG_WIDTH / 2 + 70} y={70}>
      {props.score}
    </text>
  )
})

OpponentScore.displayName = 'OpponentScore'
