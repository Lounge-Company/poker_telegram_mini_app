import { PlayerState } from '../../rooms/schema/PlayerState'
import { MapSchema } from '@colyseus/schema'
export interface IPlayerRepository {
  getPlayer(id: string): PlayerState | undefined
  getAllPlayers(): MapSchema<PlayerState>
}
