export type GameEventTypes = {
  gameStart: () => void
  gameEnd: () => void
  roundStart: () => void
  roundEnd: () => void
  playerJoin: (playerId: string, seatIndex: number, name: string) => void
  playerLeave: (playerId: string) => void
  playerReady: (playerId: string) => void
  playerCheck: (playerId: string) => void
  playerCall: (playerId: string) => void
  playerFold: (playerId: string) => void
  playerBet: (playerId: string, amount: number) => void
}
