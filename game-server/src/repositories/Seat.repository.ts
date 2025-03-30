import { ArraySchema } from '@colyseus/schema'
import { ISeatRepository } from '../interfaces/repositories/ISeatRepository'
import { Seat } from '../rooms/schema/Seat'
import { GameState } from '../rooms/schema/GameState'

export class SeatRepository implements ISeatRepository {
  constructor(private state: GameState) {}
  getAllSeats(): ArraySchema<Seat> {
    return this.state.seats
  }
  getIndexOfPlayer(playerId: string): number {
    return this.state.seats.findIndex((seat) => seat.playerId === playerId)
  }
}
