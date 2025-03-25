import { PlayerState } from '../rooms/schema/PlayerState'

export interface IPlayerRepository {
  getPlayer(id: string): PlayerState | undefined
  updatePlayer(player: PlayerState): void
  getAllPlayers(): PlayerState[]
}
