import { PlayerRepository } from '../repositories/Player.repository'
import { SeatRepository } from '../repositories/Seat.repository'
import { GameState } from '../rooms/schema/GameState'
import { Seat } from '../rooms/schema/Seat'

export class RoomManager {
  constructor(private state: GameState) {}
  handleJoinRoom(playerId: string): void {}

  proccesJoinGame(playerId: string, name: string, seatNumber: number): boolean {
    const spectator = this.state.spectators.get(playerId)
    if (!spectator) {
      return false
    }

    const seat = this.state.seats[seatNumber]
    if (!seat || seat.playerId !== '') {
      return false
    }

    const clonedPlayer = spectator.clone()
    seat.playerId = playerId

    if (name) {
      clonedPlayer.name = name
    }

    if (!this.state.gameStarted) {
      this.state.players.set(playerId, clonedPlayer)
      this.state.spectators.delete(playerId)
    } else {
      clonedPlayer.chips = 0
      clonedPlayer.ready = false
      clonedPlayer.hasFolded = true
      clonedPlayer.isAllIn = true
      this.state.players.set(playerId, clonedPlayer)
      this.state.spectators.delete(playerId)
    }

    return true
  }
  handlePlayerLeaveGame(playerId: string): boolean {
    const player = this.state.players.get(playerId)
    if (!player) return false
    const clonedPlayer = player.clone()
    this.state.spectators.set(playerId, clonedPlayer)
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
}
