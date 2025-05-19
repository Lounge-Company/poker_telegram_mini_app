import { SeatRepository } from '../repositories/Seat.repository'
import { PlayerState } from '../rooms/schema/PlayerState'
import { Seat } from '../rooms/schema/Seat'
import { MapSchema } from '@colyseus/schema'

export class GameManager {
  constructor(
    private seatRepository: SeatRepository,
    private getPlayers: () => MapSchema<PlayerState>,
    private setActivePlayers: (count: number) => void,
    private setGameStarted: (status: boolean) => void,
    private setDealerId: (id: string) => void,
    private gameLoop: () => Promise<void>
  ) {}
  async startGame() {
    console.log('Starting game...')
    this.setGameStarted(true)
    const seats = this.seatRepository
      .getSeats()
      .filter((seat) => seat.playerId && seat.playerId !== '')
    const firstOccupiedSeat: Seat = seats.find((seat) => seat.playerId)
    console.log('set first dealer id:', firstOccupiedSeat.playerId)
    this.setDealerId(firstOccupiedSeat.playerId)
    await this.gameLoop()
  }

  stopGame() {
    this.setGameStarted(false)
  }

  resetGame() {
    this.setActivePlayers(this.getPlayers().size)
  }

  determineWinner(): string {
    return ''
  }
}
