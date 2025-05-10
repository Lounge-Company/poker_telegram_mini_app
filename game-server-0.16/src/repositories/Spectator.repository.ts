import { ISpectatorRepository } from '../interfaces/repositories/ISpectatorRepository'
import { PlayerState } from '../rooms/schema/PlayerState'

export class SpectatorRepository implements ISpectatorRepository {
  constructor(private spectators: PlayerState[]) {}
  getSpectators(): PlayerState[] {
    return this.spectators
  }
  setSpectator(player: PlayerState): void {
    this.spectators.push(player)
  }
  deleteSpectator(playerId: string): void {
    this.spectators = this.spectators.filter(
      (spectator) => spectator.id !== playerId
    )
  }
}
