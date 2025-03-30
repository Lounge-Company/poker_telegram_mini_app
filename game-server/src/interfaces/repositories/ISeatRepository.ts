import { ArraySchema } from '@colyseus/schema'
import { Seat } from '../../rooms/schema/Seat'
export interface ISeatRepository {
  getAllSeats(): ArraySchema<Seat>
  getIndexOfPlayer(playerId: string): number
}
