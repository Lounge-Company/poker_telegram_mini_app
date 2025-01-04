import { GameState } from '../rooms/schema/GameState'

export class MessageService {
  constructor(private state: GameState) {}
  createChatMessage(playerId: string, message: string) {
    const player = this.state.players.get(playerId)
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
