import { GameState } from '../rooms/schema/GameState'

export class RoomManager {
  constructor(private state: GameState) {}
  handlePlayerJoinToGame(playerId: string): boolean {
    const spectator = this.state.spectators.get(playerId)
    if (!spectator) return false
    this.state.players.set(playerId, spectator)
    this.state.spectators.delete(playerId)
    return true
  }
  handlePlayerLeaveGame(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (!player) return false
    this.state.spectators.set(playerId, player)
    this.state.players.delete(playerId)
    console.log('player left', playerId)
    return true
  }
}
