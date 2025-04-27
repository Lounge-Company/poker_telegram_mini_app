import { ArraySchema } from '@colyseus/schema'
import { ISeatRepository } from '../interfaces/repositories/ISeatRepository'
import { Seat } from '../rooms/schema/Seat'
import { GameState } from '../rooms/schema/GameState'

export class SeatRepository implements ISeatRepository {
  constructor(private state: GameState) {}
  getSeats(): ArraySchema<Seat> {
    return this.state.seats
  }
  getIndexOfPlayer(playerId: string): number {
    return this.state.seats.findIndex((seat) => seat.playerId === playerId)
  }
  clearSeat(playerId: string): void {
    const seatIndex = this.getIndexOfPlayer(playerId)
    if (seatIndex !== -1) {
      this.state.seats[seatIndex].playerId = ''
    }
  }
}
