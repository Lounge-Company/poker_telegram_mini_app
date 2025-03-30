import { IPlayerRepository } from '../interfaces/repositories/IPlayerRepository'
import { PlayerState } from '../rooms/schema/PlayerState'

export class PlayerRepository implements IPlayerRepository {
  constructor(private players: Map<string, PlayerState>) {}

  getPlayer(id: string): PlayerState | undefined {
    return this.players.get(id)
  }
  getAllPlayers(): Map<string, PlayerState> {
    return this.players
  }
}
