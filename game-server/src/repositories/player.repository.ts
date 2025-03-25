import { IPlayerRepository } from '../interfaces/IPlayerRepository'
import { PlayerState } from '../rooms/schema/PlayerState'

export class PlayerRepository implements IPlayerRepository {
  constructor(private players: Map<string, PlayerState>) {}

  getPlayer(id: string): PlayerState | undefined {
    return this.players.get(id)
  }

  updatePlayer(player: PlayerState): void {
    const existingPlayer = this.players.get(player.id)
    if (!existingPlayer) {
      this.players.set(player.id, player)
      return
    }

    Object.assign(existingPlayer, player)
    this.players.set(player.id, existingPlayer)
  }

  getAllPlayers(): PlayerState[] {
    return Array.from(this.players.values())
  }
}
