import { PlayerState } from '../rooms/schema/PlayerState'

export class MessageService {
  constructor() {}
  createChatMessage(player: PlayerState, message: string) {
    return {
      playerId: player.id,
      playerName: player.name || `Player${Math.floor(Math.random() * 1000)}`,
      message: message,
      timestamp: new Date().toISOString()
    }
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
