import { IPlayerRepository } from '../interfaces/repositories/IPlayerRepository'
import { ISeatRepository } from '../interfaces/repositories/ISeatRepository'
import { GameState } from '../rooms/schema/GameState'
import { ClientService } from '../services/clientService'

export class TurnManager {
  private state: GameState
  private СlientService: ClientService

  constructor(
    state: GameState,
    private clientService: ClientService,
    private playerRepository: IPlayerRepository,
    private seatRepository: ISeatRepository,
    private getDealerId: () => string
  ) {
    this.state = state
  }
  getStartingPlayer(): string {
    const seats = this.seatRepository.getSeats()
    const dealerId = this.getDealerId()
    const dealerIndex = seats.findIndex((seat) => seat.playerId === dealerId)

    const startingIndex = (dealerIndex + 3) % seats.length

    return seats[startingIndex].playerId
  }
  public allPlayersActed(): boolean {
    for (const player of this.playerRepository.getAllPlayers().values()) {
      if (!player.acted) {
        return false
      }
    }
    return true
  }

  getNextPlayerTurn(): string | undefined {
    const currentSeatIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === this.state.currentTurn
    )

    for (let i = 0; i <= this.state.seats.length; i++) {
      const nextIndex = (currentSeatIndex + i) % this.state.seats.length
      const playerId = this.state.seats[nextIndex].playerId
      const player = this.state.players.get(playerId)

      if (player && !player.acted) {
        console.log('next index ', nextIndex)
        console.log('player id ', playerId)
        return (this.state.currentTurn = playerId)
      }
    }

    return undefined
  }
  moveDealerPosition(): void {
    const dealerId = this.getDealerId()
    const dealerIndex = this.state.seats.findIndex(
      (seat) => seat.playerId === dealerId
    )
    const newDealerIndex = (dealerIndex + 1) % this.state.seats.length
    const newDealerId = this.state.seats[newDealerIndex].playerId
    this.state.dealerId = newDealerId
  }
}
