import { PlayerState } from '../../rooms/schema/PlayerState'

export interface IPlayerRepository {
  getPlayer(id: string): PlayerState | undefined
  getAllPlayers(): Map<string, PlayerState>
}
