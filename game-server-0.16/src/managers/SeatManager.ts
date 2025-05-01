import { ArraySchema } from '@colyseus/schema'
import { PlayerRepository } from '../repositories/player.repository'
import { SeatRepository } from '../repositories/Seat.repository'
import { Seat } from '../rooms/schema/Seat'
import { GameState } from '../rooms/schema/GameState'

export class SeatManager {
  constructor(
    private state: GameState,
    private playerRepository: PlayerRepository,
    private seatRepository: SeatRepository
  ) {
    this.initializeSeats(this.state.seats)
  }
  cleanSeatByPlayerId(playerId: string) {
    const seat = this.seatRepository
      .getSeats()
      .find((seat) => seat.playerId === playerId)
    if (seat) {
      seat.playerId = ''
    }
  }
  freeEmptySeats(): void {
    this.playerRepository.getAllPlayers().forEach((player) => {
      if (player.chips <= 0) {
        this.cleanSeatByPlayerId(player.id)
      }
    })
  }
  private initializeSeats(seats: ArraySchema<Seat>): void {
    for (let i = 0; i < this.state.MAX_SEATS; i++) {
      const seat = new Seat()
      seat.index = i
      seat.playerId = ''
      this.state.seats.push(seat)
    }
  }
}
