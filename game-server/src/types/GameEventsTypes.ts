export type GameEventTypes = {
  gameStart: () => void
  gameEnd: () => void
  roundStart: () => void
  roundEnd: () => void
  playerCheck: (playerId: string) => void
  playerCall: (playerId: string) => void
  playerFold: (playerId: string) => void
  playerBet: (playerId: string, amount: number) => void
}
