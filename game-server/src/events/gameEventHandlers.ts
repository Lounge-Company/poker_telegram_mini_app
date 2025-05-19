import { GameManager } from '../managers/GameManager'
import { PlayerManager } from '../managers/PlayerManager'

export const createGameEventHandlers = (
  gameManager: GameManager,
  playerManager: PlayerManager
) => ({
  gameStart: () => gameManager.startGame(),
  gameEnd: () => gameManager.stopGame(),
  playerJoin: (playerId: string, seatIndex: number, name: string) =>
    playerManager.handleJoin(playerId, seatIndex, name),
  playerLeave: (playerId: string) => playerManager.handleLeave(playerId),
  playerReady: (playerId: string) => playerManager.handleReady(playerId),
  playerCheck: (playerId: string) => playerManager.handleCheck(playerId),
  playerFold: (playerId: string) => playerManager.handleFold(playerId),
  playerBet: (playerId: string, amount: number) =>
    playerManager.handleBet(playerId, amount),
  playerCall: (playerId: string) => playerManager.handleCall(playerId)
})
