import { GameState } from '../rooms/schema/GameState'
import { Seat } from '../rooms/schema/Seat'

export class RoomManager {
  constructor(private state: GameState) {
    for (let i = 0; i < 9; i++) {
      const seat = new Seat()
      seat.index = i
      seat.playerId = ''
      this.state.seats.push(seat)
    }
  }
  handlePlayerJoinToGame(playerId: string, seatNumber: number): boolean {
    console.log('playerId :', playerId, 'seatNumber :', seatNumber)
    const spectator = this.state.spectators.get(playerId)
    if (!spectator) return false
    const seat = this.state.seats[seatNumber - 1]
    if (seat && seat.playerId !== '') {
      return false
    }
    if (seat && !seat.playerId) {
      this.state.players.set(playerId, spectator)
      this.state.spectators.delete(playerId)
      seat.playerId = playerId
      console.log('seats :', JSON.stringify(this.state.seats))
    }

    console.log('spectators :', this.state.spectators.keys())
    console.log('players :', this.state.players.keys())
    return true
  }

  handlePlayerLeaveGame(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (!player) return false
    this.state.spectators.set(playerId, player)
    this.state.players.delete(playerId)
    const seat = this.state.seats.find((s) => s.playerId === playerId)
    if (seat) {
      seat.playerId = ''
    }
    if (this.state.players.size < 2) {
      this.state.gameStarted = false
    }
    console.log('spectators :', this.state.spectators.keys())
    console.log('players :', this.state.players.keys())
    return true
  }
  isPlayerSeated(playerId: string): Seat | undefined {
    const seat = this.state.seats.find((s) => s.playerId === playerId)
    if (!seat) return undefined
    return seat
  }
}
