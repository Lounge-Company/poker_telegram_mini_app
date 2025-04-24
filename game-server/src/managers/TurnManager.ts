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
    const seats = this.seatRepository
      .getSeats()
      .filter((seat) => seat.playerId && seat.playerId !== '')

    const dealerId = this.getDealerId()
    const dealerIndex = seats.findIndex((seat) => seat.playerId === dealerId)

    if (dealerIndex === -1 || seats.length === 0) {
      return seats[0]?.playerId
    }

    const startingIndex = (dealerIndex + 3) % seats.length
    const startingPlayer = seats[startingIndex]?.playerId

    console.log({
      totalSeats: seats.length,
      dealerId,
      dealerIndex,
      startingIndex,
      startingPlayer,
    })

    return startingPlayer
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
        this.state.currentTurn = playerId
        return playerId
      }
    }

    return
  }
  getNextActivePlayerAfterDealer(): string {
    const seats = this.seatRepository
      .getSeats()
      .filter((seat) => seat.playerId && seat.playerId !== '')

    const dealerId = this.getDealerId()
    const dealerIndex = seats.findIndex((seat) => seat.playerId === dealerId)

    for (let i = 0; i <= seats.length; i++) {
      const nextIndex = (dealerIndex + i) % seats.length
      const playerId = seats[nextIndex].playerId
      const player = this.playerRepository.getPlayer(playerId)

      if (player && !player.acted && !player.hasFolded && !player.isAllIn) {
        return playerId
      }
    }

    return seats[0].playerId
  }
  moveDealerPosition(): void {
    const seats = this.seatRepository
      .getSeats()
      .filter((seat) => seat.playerId && seat.playerId !== '')

    const dealerId = this.getDealerId()
    const dealerIndex = seats.findIndex((seat) => seat.playerId === dealerId)
    const newDealerIndex = (dealerIndex + 1) % seats.length
    const newDealerId = seats[newDealerIndex].playerId
    console.log('next dealer id:', newDealerId)
    this.state.dealerId = newDealerId
  }
}
