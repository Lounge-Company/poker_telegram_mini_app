import { GameManager } from '../managers/GameManager'
import { PlayerManager } from '../managers/PlayerManager'

export const createGameEventHandlers = (
  gameManager: GameManager,
  playerManager: PlayerManager
) => ({
  gameStart: () => gameManager.startGame(),
  gameEnd: () => gameManager.stopGame(),
  playerCheck: (playerId: string) => playerManager.handleCheck(playerId),
  playerFold: (playerId: string) => playerManager.handleFold(playerId),
  playerBet: (playerId: string, amount: number) =>
    playerManager.handleBet(playerId, amount),
  playerCall: (playerId: string) => playerManager.handleCall(playerId),
})
