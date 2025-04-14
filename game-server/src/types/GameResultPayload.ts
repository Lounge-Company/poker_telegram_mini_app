export type GameWinner = {
  playerId: string
  amount: number
  hand: string
}

export type GameResultMessage = {
  winners: GameWinner[]
  pot: number
}
