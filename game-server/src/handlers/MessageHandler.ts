import { GameState } from '../rooms/schema/GameState'

export class MessageHandler {
  constructor(private state: GameState) {}
  handleChatMessage(playerId: string, message: string) {
    const player = this.state.players.find((p) => p.id === playerId)
    if (player) {
      return {
        playerId: playerId,
        playerName: player.name || `Player${Math.floor(Math.random() * 1000)}`,
        message: message,
        timestamp: new Date().toISOString()
      }
    }
    return null
  }
  createSystemMessage(message: string) {
    return {
      playerId: 'system',
      playerName: 'System',
      message: message,
      timestamp: new Date().toISOString()
    }
  }
}
