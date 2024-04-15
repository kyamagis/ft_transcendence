export const BG_WIDTH: number = 800
export const BG_HEIGHT: number = 600
export const VIEWBOX: string = `0 0 ${BG_WIDTH} ${BG_HEIGHT}`
export const BALL_DIAMETER: number = 10 // 辺の長さ
export const BALL_RADIUS: number = BALL_DIAMETER / 2
export const CENTER_OF_BG_X: number = BG_WIDTH / 2 - BALL_RADIUS
export const CENTER_OF_BG_Y: number = BG_HEIGHT / 2 - BALL_RADIUS

export const PADDLE_HEIGHT = 75
export const PADDLE_WIDTH = 10
export const PADDLE_INIT_POS = (BG_HEIGHT - PADDLE_HEIGHT) / 2
export const RIGHT_PADDLE_X_POS = BG_WIDTH - PADDLE_WIDTH

export const GAME_PARAMETER_MAX_LEVEL = 5
